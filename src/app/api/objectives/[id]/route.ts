import { NextRequest, NextResponse } from 'next/server';
import { db, objective } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/objectives/[id] - Get a single objective
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const obj = await db.query.objective.findFirst({
      where: and(eq(objective.id, id), eq(objective.userId, session.user.id)),
      with: {
        pillars: true,
        metrics: {
          with: {
            entries: {
              orderBy: (metricEntry, { desc }) => [desc(metricEntry.recordedAt)],
              limit: 30,
            },
          },
        },
        rituals: {
          with: {
            completions: {
              orderBy: (ritualCompletion, { desc }) => [desc(ritualCompletion.completedAt)],
              limit: 30,
            },
          },
        },
        tasks: {
          orderBy: (task, { desc }) => [desc(task.scheduledAt)],
          limit: 50,
        },
      },
    });

    if (!obj) {
      return NextResponse.json({ error: 'Objective not found' }, { status: 404 });
    }

    return NextResponse.json({ objective: obj });
  } catch (error) {
    console.error('Failed to fetch objective:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/objectives/[id] - Update an objective
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await db.query.objective.findFirst({
      where: and(eq(objective.id, id), eq(objective.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Objective not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(objective)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(objective.id, id))
      .returning();

    return NextResponse.json({ objective: updated });
  } catch (error) {
    console.error('Failed to update objective:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/objectives/[id] - Delete an objective
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db.query.objective.findFirst({
      where: and(eq(objective.id, id), eq(objective.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Objective not found' }, { status: 404 });
    }

    await db.delete(objective).where(eq(objective.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete objective:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
