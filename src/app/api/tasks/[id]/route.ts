import { NextRequest, NextResponse } from 'next/server';
import { db, task } from '@/db';
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

// PATCH /api/tasks/[id] - Update a task (complete, skip, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await db.query.task.findFirst({
      where: and(eq(task.id, id), eq(task.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date(),
    };

    // Handle status changes
    if (body.status === 'completed' && !existing.completedAt) {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(task)
      .set(updateData)
      .where(eq(task.id, id))
      .returning();

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db.query.task.findFirst({
      where: and(eq(task.id, id), eq(task.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await db.delete(task).where(eq(task.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
