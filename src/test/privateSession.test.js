import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VISIT_STORAGE_KEY } from '../components/utils/visits';

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn(() => ({})) }));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

describe('private login storage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://privacy-test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-test-key');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('keeps auth in memory and retains recovery-link detection', async () => {
    await import('../supabaseClient');
    expect(createClient).toHaveBeenCalledWith('https://privacy-test.supabase.co', 'public-test-key', {
      auth: { persistSession: false, detectSessionInUrl: true },
    });
  });

  it('removes legacy remembered logins while preserving ordinary preferences', async () => {
    const key = 'sb-privacy-test-auth-token';
    localStorage.setItem(key, 'legacy-session');
    localStorage.setItem(`${key}-user`, 'legacy-profile');
    localStorage.setItem(`${key}-code-verifier`, 'legacy-verifier');
    localStorage.setItem('gr3tful-theme', 'dark');
    await import('../supabaseClient');
    for (const suffix of ['', '-user', '-code-verifier']) expect(localStorage.getItem(`${key}${suffix}`)).toBeNull();
    expect(localStorage.getItem('gr3tful-theme')).toBe('dark');
    expect(localStorage.getItem(VISIT_STORAGE_KEY)).toBe('true');
  });
});
