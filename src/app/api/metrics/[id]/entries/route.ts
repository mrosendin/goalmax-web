import { NextRequest, NextResponse } from 'next/server';
import { db, metric, metricEntry, objective } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, desc } from 'drizzle-orm';

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/metrics/[id]/entries - Get metric entries
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify metric ownership through objective
    const m = await db.query.metric.findFirst({
      where: eq(metric.id, id),
      with: {
        objective: true,
      },
    });

    if (!m || m.objective.userId !== session.user.id) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    const entries = await db
      .select()
      .from(metricEntry)
      .where(eq(metricEntry.metricId, id))
      .orderBy(desc(metricEntry.recordedAt));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch metric entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/metrics/[id]/entries - Add a metric entry
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { value, note, recordedAt } = body;

    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }

    // Verify metric ownership through objective
    const m = await db.query.metric.findFirst({
      where: eq(metric.id, id),
      with: {
        objective: true,
      },
    });

    if (!m || m.objective.userId !== session.user.id) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    const [entry] = await db.insert(metricEntry).values({
      metricId: id,
      value: Number(value),
      note,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    }).returning();

    // Update current value on metric
    await db
      .update(metric)
      .set({ current: Number(value), updatedAt: new Date() })
      .where(eq(metric.id, id));

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create metric entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
