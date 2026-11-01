import { useId, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { getNickname, MAX_NICKNAME_LENGTH, nicknameError, normalizeNickname } from './utils/nickname';

export default function NicknamePrompt() {
  const { user, updateNickname } = useAuth();
  const inputId = useId();
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!user || getNickname(user)) return null;

  async function handleSave(event) {
    event.preventDefault();
    if (saving) return;
    const invalid = nicknameError(nickname);
    setError(invalid);
    if (invalid) return;
    setSaving(true);
    try {
      const { error: saveError } = await updateNickname(normalizeNickname(nickname));
      if (saveError) throw saveError;
      toast.success('Nickname saved.');
    } catch (saveError) {
      setError(saveError.message || 'Your nickname could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} aria-label="Choose a nickname" className="mb-6 rounded-2xl border border-borderline bg-surface p-5">
      <label htmlFor={inputId} className="font-heading text-xl text-darkb">What should we call you?</label>
      <p id={`${inputId}-hint`} className="mt-1 font-parag text-sm text-secondary-text">Add a nickname for your journal greeting.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="nickname"
          autoComplete="nickname"
          required
          maxLength={MAX_NICKNAME_LENGTH}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Your nickname"
          disabled={saving}
          aria-describedby={`${inputId}-hint${error ? ` ${inputId}-error` : ''}`}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 rounded-xl border border-borderline bg-secondary-bg px-4 py-3 font-parag text-sm text-darkb"
        />
        <button type="submit" disabled={saving || !nickname.trim()} className="rounded-full bg-secondary px-5 py-3 font-parag text-sm text-fwhite disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? 'Saving…' : 'Save nickname'}
        </button>
      </div>
      {error && <p id={`${inputId}-error`} role="alert" className="mt-3 font-parag text-sm text-red-600">{error}</p>}
    </form>
  );
}
