import { singleFlight } from '../../src/database/singleFlight';

describe('singleFlight', () => {
  it('runs once for concurrent callers and shares the result', async () => {
    let calls = 0;
    const open = singleFlight(async () => {
      calls += 1;
      await Promise.resolve();
      return { id: calls };
    });
    const [a, b, c] = await Promise.all([open(), open(), open()]);
    expect(calls).toBe(1);
    expect(a).toBe(b);
    expect(b).toBe(c);
    expect(await open()).toBe(a); // later callers still share the opened database
    expect(calls).toBe(1);
  });

  it('forgets a failure so a retry runs again, while concurrent callers share the failure', async () => {
    let calls = 0;
    const open = singleFlight(async () => {
      calls += 1;
      if (calls === 1) throw new Error('first attempt fails');
      return 'ok';
    });
    const results = await Promise.allSettled([open(), open()]);
    expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected']);
    expect(calls).toBe(1);
    await expect(open()).resolves.toBe('ok');
    expect(calls).toBe(2);
  });
});
