import { NextRequest, NextResponse } from 'next/server';
import { db, task, objective } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

// GET /api/tasks - List tasks, optionally filtered by date
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date'); // YYYY-MM-DD format
    const objectiveId = searchParams.get('objectiveId');

    let whereClause = eq(task.userId, session.user.id);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause = and(
        whereClause,
        gte(task.scheduledAt, startOfDay),
        lte(task.scheduledAt, endOfDay)
      )!;
    }

    if (objectiveId) {
      whereClause = and(whereClause, eq(task.objectiveId, objectiveId))!;
    }

    const tasks = await db
      .select()
      .from(task)
      .where(whereClause)
      .orderBy(desc(task.scheduledAt));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { objectiveId, pillarId, ritualId, title, description, whyItMatters, scheduledAt, durationMinutes } = body;

    if (!title || !objectiveId || !scheduledAt) {
      return NextResponse.json({ error: 'Title, objectiveId, and scheduledAt are required' }, { status: 400 });
    }

    // Verify objective ownership
    const obj = await db.query.objective.findFirst({
      where: and(eq(objective.id, objectiveId), eq(objective.userId, session.user.id)),
    });

    if (!obj) {
      return NextResponse.json({ error: 'Objective not found' }, { status: 404 });
    }

    const [newTask] = await db.insert(task).values({
      userId: session.user.id,
      objectiveId,
      pillarId,
      ritualId,
      title,
      description,
      whyItMatters,
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 30,
    }).returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
