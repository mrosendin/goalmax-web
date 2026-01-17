import { NextRequest, NextResponse } from 'next/server';
import { db, ritual, ritualCompletion } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc, gte } from 'drizzle-orm';

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/rituals/[id]/completions - Mark ritual as complete
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { note, completedAt } = body;

    // Verify ritual ownership through objective
    const r = await db.query.ritual.findFirst({
      where: eq(ritual.id, id),
      with: {
        objective: true,
      },
    });

    if (!r || r.objective.userId !== session.user.id) {
      return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
    }

    // Create completion
    const [completion] = await db.insert(ritualCompletion).values({
      ritualId: id,
      note,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    }).returning();

    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const recentCompletions = await db
      .select()
      .from(ritualCompletion)
      .where(eq(ritualCompletion.ritualId, id))
      .orderBy(desc(ritualCompletion.completedAt));

    // Simple streak calculation - check consecutive days
    let streak = 1;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);

    for (const c of recentCompletions.slice(1)) {
      const completionDate = new Date(c.completedAt);
      completionDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((lastDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        lastDate = completionDate;
      } else if (dayDiff > 1) {
        break;
      }
    }

    // Update streak on ritual
    await db
      .update(ritual)
      .set({
        currentStreak: streak,
        longestStreak: Math.max(r.longestStreak, streak),
        updatedAt: new Date(),
      })
      .where(eq(ritual.id, id));

    return NextResponse.json({ completion, streak }, { status: 201 });
  } catch (error) {
    console.error('Failed to complete ritual:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
