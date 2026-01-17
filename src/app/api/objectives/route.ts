import { NextRequest, NextResponse } from 'next/server';
import { db, objective, pillar, metric, ritual } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

// GET /api/objectives - List all objectives for the current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const objectives = await db.query.objective.findMany({
      where: eq(objective.userId, session.user.id),
      with: {
        pillars: true,
        metrics: true,
        rituals: true,
      },
      orderBy: (objective, { desc }) => [desc(objective.createdAt)],
    });

    return NextResponse.json({ objectives });
  } catch (error) {
    console.error('Failed to fetch objectives:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/objectives - Create a new objective
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id: clientId, name, category, description, targetOutcome, endDate, dailyCommitmentMinutes, pillars: pillarsData, metrics: metricsData, rituals: ritualsData } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    // Create objective - use client ID if provided
    const [newObjective] = await db.insert(objective).values({
      ...(clientId && { id: clientId }), // Use client-provided ID if available
      userId: session.user.id,
      name,
      category,
      description,
      targetOutcome,
      endDate: endDate ? new Date(endDate) : undefined,
      dailyCommitmentMinutes,
    }).returning();

    // Create pillars if provided
    if (pillarsData && Array.isArray(pillarsData)) {
      for (const p of pillarsData) {
        await db.insert(pillar).values({
          ...(p.id && { id: p.id }), // Use client-provided ID if available
          objectiveId: newObjective.id,
          name: p.name,
          description: p.description,
          weight: p.weight,
        });
      }
    }

    // Create metrics if provided
    if (metricsData && Array.isArray(metricsData)) {
      for (const m of metricsData) {
        await db.insert(metric).values({
          ...(m.id && { id: m.id }), // Use client-provided ID if available
          objectiveId: newObjective.id,
          name: m.name,
          unit: m.unit,
          type: m.type,
          target: m.target,
          targetDirection: m.targetDirection,
        });
      }
    }

    // Create rituals if provided
    if (ritualsData && Array.isArray(ritualsData)) {
      for (const r of ritualsData) {
        await db.insert(ritual).values({
          ...(r.id && { id: r.id }), // Use client-provided ID if available
          objectiveId: newObjective.id,
          name: r.name,
          description: r.description,
          frequency: r.frequency,
          daysOfWeek: r.daysOfWeek,
          timesPerPeriod: r.timesPerPeriod,
          estimatedMinutes: r.estimatedMinutes,
        });
      }
    }

    // Fetch the complete objective with relations
    const completeObjective = await db.query.objective.findFirst({
      where: eq(objective.id, newObjective.id),
      with: {
        pillars: true,
        metrics: true,
        rituals: true,
      },
    });

    return NextResponse.json({ objective: completeObjective }, { status: 201 });
  } catch (error) {
    console.error('Failed to create objective:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
