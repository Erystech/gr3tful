export const VISIT_STORAGE_KEY = 'gr3tful-has-visited';

export function hasVisitedBefore() {
  try {
    // Theme preferences also identify browsers that used earlier app versions.
    return window.localStorage.getItem(VISIT_STORAGE_KEY) === 'true'
      || window.localStorage.getItem('gr3tful-theme') !== null;
  } catch {
    return false;
  }
}

export function rememberVisit() {
  try { window.localStorage.setItem(VISIT_STORAGE_KEY, 'true'); } catch { /* Installed launches work without storage. */ }
}

export function removeRememberedLogin(projectUrl) {
  try {
    const key = `sb-${new URL(projectUrl).hostname.split('.')[0]}-auth-token`;
    if (window.localStorage.getItem(key)) rememberVisit();
    for (const suffix of ['', '-user', '-code-verifier']) window.localStorage.removeItem(`${key}${suffix}`);
  } catch { /* Authentication itself uses memory and does not depend on storage. */ }
}
