export const MAX_NICKNAME_LENGTH = 40;

export function normalizeNickname(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

export function getNickname(user) {
  const nickname = normalizeNickname(user?.user_metadata?.nickname);
  return nickname.length <= MAX_NICKNAME_LENGTH ? nickname : '';
}

export function nicknameError(value) {
  const nickname = normalizeNickname(value);
  if (!nickname) return 'Please tell us what to call you.';
  if (nickname.length > MAX_NICKNAME_LENGTH) return `Use a nickname of ${MAX_NICKNAME_LENGTH} characters or fewer.`;
  return null;
}
