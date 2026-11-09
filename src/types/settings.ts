// Persisted preferences. app_settings stores each key as JSON text; every read is parsed through
// these schemas and falls back to the default on missing or corrupt values (never throws).
import { z } from 'zod';

import { RestTimerSecondsSchema } from './domain';
import { THEME_MODES, WEIGHT_UNITS } from './enums';

export const SettingsSchema = z.object({
  units: z.enum(WEIGHT_UNITS).default('kg'),
  theme: z.enum(THEME_MODES).default('dark'),
  notificationsEnabled: z.boolean().default(true),
  defaultRestSeconds: RestTimerSecondsSchema.default(90),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SettingKey = keyof Settings;

export const DEFAULT_SETTINGS: Settings = SettingsSchema.parse({});

/** Parse raw `app_settings` rows (key -> JSON text); invalid or missing keys use defaults. */
export function parseSettings(rows: Record<string, string | undefined>): Settings {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS) as SettingKey[]) {
    const raw = rows[key];
    if (raw === undefined) continue;
    try {
      const candidate = JSON.parse(raw);
      const field = SettingsSchema.shape[key].safeParse(candidate);
      if (field.success) out[key] = field.data;
    } catch {
      // corrupt JSON: keep the default
    }
  }
  return SettingsSchema.parse(out);
}

export function serializeSetting<K extends SettingKey>(key: K, value: Settings[K]): string {
  return JSON.stringify(SettingsSchema.shape[key].parse(value));
}
