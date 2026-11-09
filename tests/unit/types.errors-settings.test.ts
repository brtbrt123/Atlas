import { AtlasError, DEFAULT_SETTINGS, attempt, isAtlasError, parseSettings, serializeSetting } from '../../src/types';

describe('AtlasError and attempt()', () => {
  it('carries a code and details', () => {
    const error = new AtlasError('ACTIVE_SESSION_EXISTS', 'A workout is already active', { sessionId: 's1' });
    expect(isAtlasError(error)).toBe(true);
    expect(error.code).toBe('ACTIVE_SESSION_EXISTS');
    expect(error.details).toEqual({ sessionId: 's1' });
    expect(error).toBeInstanceOf(Error);
  });

  it('wraps success and typed failures', async () => {
    await expect(attempt(async () => 42)).resolves.toEqual({ ok: true, value: 42 });
    const failed = await attempt(async () => {
      throw new AtlasError('NOT_FOUND', 'missing');
    });
    expect(failed.ok).toBe(false);
    if (!failed.ok) expect(failed.error.code).toBe('NOT_FOUND');
  });

  it('maps unexpected errors to INTERNAL, keeping the raw error only in cause (never in safe fields)', async () => {
    const raw = new Error('SQLITE_CONSTRAINT: UNIQUE failed');
    const failed = await attempt(async () => {
      throw raw;
    });
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.error).toBeInstanceOf(AtlasError);
      expect(failed.error.code).toBe('INTERNAL');
      expect(failed.error.cause).toBe(raw);
      expect(failed.error.message).not.toMatch(/SQLITE/);
      expect(JSON.stringify(failed.error.details ?? {})).not.toMatch(/SQLITE/);
    }
  });

  it('recognises an AtlasError even if instanceof is lost', () => {
    const lookalike = Object.assign(new Error('x'), { name: 'AtlasError', code: 'NOT_FOUND' });
    expect(isAtlasError(lookalike)).toBe(true);
    expect(isAtlasError(Object.assign(new Error('x'), { name: 'AtlasError', code: 'NOPE' }))).toBe(false);
    expect(isAtlasError(new Error('plain'))).toBe(false);
  });
});

describe('settings parsing', () => {
  it('uses defaults for an empty table', () => {
    expect(parseSettings({})).toEqual(DEFAULT_SETTINGS);
    expect(DEFAULT_SETTINGS).toEqual({ units: 'kg', theme: 'dark', notificationsEnabled: true, defaultRestSeconds: 90 });
  });

  it('reads valid stored values', () => {
    expect(parseSettings({ units: '"lb"', defaultRestSeconds: '120', notificationsEnabled: 'false' })).toEqual({
      ...DEFAULT_SETTINGS,
      units: 'lb',
      defaultRestSeconds: 120,
      notificationsEnabled: false,
    });
  });

  it('falls back per key on corrupt JSON or invalid values, never throwing', () => {
    expect(
      parseSettings({ units: '{oops', theme: '"neon"', defaultRestSeconds: '0', notificationsEnabled: '"yes"' }),
    ).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings({ units: '"lb"', theme: 'garbage' })).toEqual({ ...DEFAULT_SETTINGS, units: 'lb' });
  });

  it('serializes validated values and rejects invalid ones', () => {
    expect(serializeSetting('units', 'lb')).toBe('"lb"');
    expect(serializeSetting('defaultRestSeconds', 75)).toBe('75');
    expect(() => serializeSetting('defaultRestSeconds', 0)).toThrow();
    expect(() => serializeSetting('defaultRestSeconds', 1801)).toThrow();
  });
});
