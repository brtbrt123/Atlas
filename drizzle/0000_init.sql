CREATE TABLE `app_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_muscles` (
	`exercise_id` text NOT NULL,
	`muscle` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "exercise_muscles_role_valid" CHECK(role IN ('primary', 'secondary'))
);
--> statement-breakpoint
CREATE INDEX `exercise_muscles_muscle_idx` ON `exercise_muscles` (`muscle`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`builtin_key` text,
	`name` text NOT NULL,
	`equipment` text,
	`tracking_type` text DEFAULT 'weight_reps' NOT NULL,
	`is_custom` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "exercises_name_not_blank" CHECK(length(trim("exercises"."name")) > 0),
	CONSTRAINT "exercises_tracking_type_valid" CHECK(tracking_type IN ('weight_reps', 'bodyweight_reps', 'duration', 'distance_duration'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_builtin_key_uq` ON `exercises` (`builtin_key`);--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`rest_seconds` integer,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "routine_exercises_position_nonneg" CHECK("routine_exercises"."position" >= 0),
	CONSTRAINT "routine_exercises_rest_nonneg" CHECK("routine_exercises"."rest_seconds" IS NULL OR "routine_exercises"."rest_seconds" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_exercises_position_uq` ON `routine_exercises` (`routine_id`,`position`);--> statement-breakpoint
CREATE INDEX `routine_exercises_exercise_idx` ON `routine_exercises` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `routine_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`set_type` text DEFAULT 'normal' NOT NULL,
	`target_reps` integer,
	`target_weight_kg` real,
	`target_duration_seconds` integer,
	`target_distance_m` real,
	FOREIGN KEY (`routine_exercise_id`) REFERENCES `routine_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "routine_sets_position_nonneg" CHECK("routine_sets"."position" >= 0),
	CONSTRAINT "routine_sets_type_valid" CHECK(set_type IN ('normal', 'warmup', 'drop', 'failure')),
	CONSTRAINT "routine_sets_targets_nonneg" CHECK(("routine_sets"."target_reps" IS NULL OR "routine_sets"."target_reps" >= 0)
      AND ("routine_sets"."target_weight_kg" IS NULL OR "routine_sets"."target_weight_kg" >= 0)
      AND ("routine_sets"."target_duration_seconds" IS NULL OR "routine_sets"."target_duration_seconds" >= 0)
      AND ("routine_sets"."target_distance_m" IS NULL OR "routine_sets"."target_distance_m" >= 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_sets_position_uq` ON `routine_sets` (`routine_exercise_id`,`position`);--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "routines_name_not_blank" CHECK(length(trim("routines"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE `session_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`exercise_id` text,
	`name` text NOT NULL,
	`tracking_type` text NOT NULL,
	`position` integer NOT NULL,
	`rest_seconds` integer,
	`notes` text,
	FOREIGN KEY (`session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "session_exercises_position_nonneg" CHECK("session_exercises"."position" >= 0),
	CONSTRAINT "session_exercises_tracking_type_valid" CHECK(tracking_type IN ('weight_reps', 'bodyweight_reps', 'duration', 'distance_duration')),
	CONSTRAINT "session_exercises_rest_nonneg" CHECK("session_exercises"."rest_seconds" IS NULL OR "session_exercises"."rest_seconds" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_exercises_position_uq` ON `session_exercises` (`session_id`,`position`);--> statement-breakpoint
CREATE INDEX `session_exercises_exercise_idx` ON `session_exercises` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `workout_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text,
	`name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`rest_timer_ends_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "workout_sessions_status_valid" CHECK(status IN ('active', 'completed')),
	CONSTRAINT "workout_sessions_end_matches_status" CHECK(("workout_sessions"."status" = 'active' AND "workout_sessions"."ended_at" IS NULL)
        OR ("workout_sessions"."status" = 'completed' AND "workout_sessions"."ended_at" IS NOT NULL AND "workout_sessions"."ended_at" >= "workout_sessions"."started_at"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workout_sessions_one_active_uq` ON `workout_sessions` (`status`) WHERE "workout_sessions"."status" = 'active';--> statement-breakpoint
CREATE INDEX `workout_sessions_status_started_idx` ON `workout_sessions` (`status`,`started_at`);--> statement-breakpoint
CREATE INDEX `workout_sessions_routine_idx` ON `workout_sessions` (`routine_id`);--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`session_exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`set_type` text DEFAULT 'normal' NOT NULL,
	`target_reps` integer,
	`target_weight_kg` real,
	`target_duration_seconds` integer,
	`target_distance_m` real,
	`weight_kg` real,
	`reps` integer,
	`rpe` real,
	`duration_seconds` integer,
	`distance_m` real,
	`is_completed` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`session_exercise_id`) REFERENCES `session_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "workout_sets_position_nonneg" CHECK("workout_sets"."position" >= 0),
	CONSTRAINT "workout_sets_type_valid" CHECK(set_type IN ('normal', 'warmup', 'drop', 'failure')),
	CONSTRAINT "workout_sets_values_valid" CHECK(("workout_sets"."weight_kg" IS NULL OR "workout_sets"."weight_kg" >= 0)
      AND ("workout_sets"."reps" IS NULL OR "workout_sets"."reps" >= 0)
      AND ("workout_sets"."rpe" IS NULL OR ("workout_sets"."rpe" >= 1 AND "workout_sets"."rpe" <= 10))
      AND ("workout_sets"."duration_seconds" IS NULL OR "workout_sets"."duration_seconds" >= 0)
      AND ("workout_sets"."distance_m" IS NULL OR "workout_sets"."distance_m" >= 0)),
	CONSTRAINT "workout_sets_targets_nonneg" CHECK(("workout_sets"."target_reps" IS NULL OR "workout_sets"."target_reps" >= 0)
      AND ("workout_sets"."target_weight_kg" IS NULL OR "workout_sets"."target_weight_kg" >= 0)
      AND ("workout_sets"."target_duration_seconds" IS NULL OR "workout_sets"."target_duration_seconds" >= 0)
      AND ("workout_sets"."target_distance_m" IS NULL OR "workout_sets"."target_distance_m" >= 0)),
	CONSTRAINT "workout_sets_completed_matches_time" CHECK(("workout_sets"."is_completed" = 1 AND "workout_sets"."completed_at" IS NOT NULL) OR ("workout_sets"."is_completed" = 0 AND "workout_sets"."completed_at" IS NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workout_sets_position_uq` ON `workout_sets` (`session_exercise_id`,`position`);