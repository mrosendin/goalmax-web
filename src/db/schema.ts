import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// AUTH TABLES (Better Auth)
// ============================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Telofy-specific fields
  timezone: text('timezone').default('America/Los_Angeles'),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  notificationEnabled: boolean('notification_enabled').default(true),
  notificationAdvanceMinutes: integer('notification_advance_minutes').default(5),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// OBJECTIVE TABLES
// ============================================

export const objective = pgTable('objective', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  category: text('category').notNull(), // career, fitness, health, etc.
  description: text('description'),
  targetOutcome: text('target_outcome'),
  
  // Timeline
  startDate: timestamp('start_date').notNull().defaultNow(),
  endDate: timestamp('end_date'),
  dailyCommitmentMinutes: integer('daily_commitment_minutes').default(60),
  
  // Status
  status: text('status').notNull().default('on_track'), // on_track, deviation_detected, paused, completed
  priority: integer('priority').default(1),
  isPaused: boolean('is_paused').default(false),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('objective_user_idx').on(table.userId),
]);

export const pillar = pgTable('pillar', {
  id: uuid('id').primaryKey().defaultRandom(),
  objectiveId: uuid('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  description: text('description'),
  weight: real('weight').notNull().default(0.25), // 0-1
  progress: real('progress').notNull().default(0), // 0-100
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('pillar_objective_idx').on(table.objectiveId),
]);

export const metric = pgTable('metric', {
  id: uuid('id').primaryKey().defaultRandom(),
  objectiveId: uuid('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  pillarId: uuid('pillar_id').references(() => pillar.id, { onDelete: 'set null' }),
  
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  type: text('type').notNull().default('number'), // number, boolean, duration, rating
  
  target: real('target'),
  targetDirection: text('target_direction'), // increase, decrease, maintain
  current: real('current'),
  
  source: text('source').notNull().default('manual'), // manual, apple_health, google_fit, etc.
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('metric_objective_idx').on(table.objectiveId),
]);

export const metricEntry = pgTable('metric_entry', {
  id: uuid('id').primaryKey().defaultRandom(),
  metricId: uuid('metric_id')
    .notNull()
    .references(() => metric.id, { onDelete: 'cascade' }),
  
  value: real('value').notNull(),
  note: text('note'),
  recordedAt: timestamp('recorded_at').notNull().defaultNow(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('metric_entry_metric_idx').on(table.metricId),
  index('metric_entry_recorded_idx').on(table.recordedAt),
]);

export const ritual = pgTable('ritual', {
  id: uuid('id').primaryKey().defaultRandom(),
  objectiveId: uuid('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  pillarId: uuid('pillar_id').references(() => pillar.id, { onDelete: 'set null' }),
  
  name: text('name').notNull(),
  description: text('description'),
  
  frequency: text('frequency').notNull().default('daily'), // daily, weekly, monthly
  daysOfWeek: jsonb('days_of_week').$type<number[]>(), // 0=Sun, 6=Sat
  timesPerPeriod: integer('times_per_period').notNull().default(1),
  estimatedMinutes: integer('estimated_minutes'),
  
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('ritual_objective_idx').on(table.objectiveId),
]);

export const ritualCompletion = pgTable('ritual_completion', {
  id: uuid('id').primaryKey().defaultRandom(),
  ritualId: uuid('ritual_id')
    .notNull()
    .references(() => ritual.id, { onDelete: 'cascade' }),
  
  completedAt: timestamp('completed_at').notNull().defaultNow(),
  note: text('note'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('ritual_completion_ritual_idx').on(table.ritualId),
  index('ritual_completion_completed_idx').on(table.completedAt),
]);

// ============================================
// TASK TABLES
// ============================================

export const task = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  objectiveId: uuid('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  pillarId: uuid('pillar_id').references(() => pillar.id, { onDelete: 'set null' }),
  ritualId: uuid('ritual_id').references(() => ritual.id, { onDelete: 'set null' }),
  
  title: text('title').notNull(),
  description: text('description'),
  whyItMatters: text('why_it_matters'),
  
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  
  status: text('status').notNull().default('pending'), // pending, in_progress, completed, skipped
  completedAt: timestamp('completed_at'),
  skippedReason: text('skipped_reason'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('task_user_idx').on(table.userId),
  index('task_objective_idx').on(table.objectiveId),
  index('task_scheduled_idx').on(table.scheduledAt),
]);

// ============================================
// DEVIATION TRACKING
// ============================================

export const deviation = pgTable('deviation', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  objectiveId: uuid('objective_id')
    .notNull()
    .references(() => objective.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => task.id, { onDelete: 'set null' }),
  ritualId: uuid('ritual_id').references(() => ritual.id, { onDelete: 'set null' }),
  
  type: text('type').notNull(), // missed_task, missed_ritual, streak_broken, metric_regressed
  detectedAt: timestamp('detected_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at'),
  aiSuggestion: text('ai_suggestion'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('deviation_user_idx').on(table.userId),
  index('deviation_objective_idx').on(table.objectiveId),
]);

// ============================================
// RELATIONS
// ============================================

export const userRelations = relations(user, ({ many }) => ({
  objectives: many(objective),
  tasks: many(task),
  deviations: many(deviation),
  sessions: many(session),
  accounts: many(account),
}));

export const objectiveRelations = relations(objective, ({ one, many }) => ({
  user: one(user, { fields: [objective.userId], references: [user.id] }),
  pillars: many(pillar),
  metrics: many(metric),
  rituals: many(ritual),
  tasks: many(task),
  deviations: many(deviation),
}));

export const pillarRelations = relations(pillar, ({ one, many }) => ({
  objective: one(objective, { fields: [pillar.objectiveId], references: [objective.id] }),
  metrics: many(metric),
  rituals: many(ritual),
  tasks: many(task),
}));

export const metricRelations = relations(metric, ({ one, many }) => ({
  objective: one(objective, { fields: [metric.objectiveId], references: [objective.id] }),
  pillar: one(pillar, { fields: [metric.pillarId], references: [pillar.id] }),
  entries: many(metricEntry),
}));

export const metricEntryRelations = relations(metricEntry, ({ one }) => ({
  metric: one(metric, { fields: [metricEntry.metricId], references: [metric.id] }),
}));

export const ritualRelations = relations(ritual, ({ one, many }) => ({
  objective: one(objective, { fields: [ritual.objectiveId], references: [objective.id] }),
  pillar: one(pillar, { fields: [ritual.pillarId], references: [pillar.id] }),
  completions: many(ritualCompletion),
  tasks: many(task),
}));

export const ritualCompletionRelations = relations(ritualCompletion, ({ one }) => ({
  ritual: one(ritual, { fields: [ritualCompletion.ritualId], references: [ritual.id] }),
}));

export const taskRelations = relations(task, ({ one }) => ({
  user: one(user, { fields: [task.userId], references: [user.id] }),
  objective: one(objective, { fields: [task.objectiveId], references: [objective.id] }),
  pillar: one(pillar, { fields: [task.pillarId], references: [pillar.id] }),
  ritual: one(ritual, { fields: [task.ritualId], references: [ritual.id] }),
}));

export const deviationRelations = relations(deviation, ({ one }) => ({
  user: one(user, { fields: [deviation.userId], references: [user.id] }),
  objective: one(objective, { fields: [deviation.objectiveId], references: [objective.id] }),
  task: one(task, { fields: [deviation.taskId], references: [task.id] }),
  ritual: one(ritual, { fields: [deviation.ritualId], references: [ritual.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Objective = typeof objective.$inferSelect;
export type NewObjective = typeof objective.$inferInsert;

export type Pillar = typeof pillar.$inferSelect;
export type NewPillar = typeof pillar.$inferInsert;

export type Metric = typeof metric.$inferSelect;
export type NewMetric = typeof metric.$inferInsert;

export type MetricEntry = typeof metricEntry.$inferSelect;
export type NewMetricEntry = typeof metricEntry.$inferInsert;

export type Ritual = typeof ritual.$inferSelect;
export type NewRitual = typeof ritual.$inferInsert;

export type RitualCompletion = typeof ritualCompletion.$inferSelect;
export type NewRitualCompletion = typeof ritualCompletion.$inferInsert;

export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;

export type Deviation = typeof deviation.$inferSelect;
export type NewDeviation = typeof deviation.$inferInsert;

// ============================================
// WAITLIST TABLE
// ============================================

export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
