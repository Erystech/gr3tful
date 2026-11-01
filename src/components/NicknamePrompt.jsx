import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { getNickname, MAX_NICKNAME_LENGTH, nicknameError, normalizeNickname } from './utils/nickname';

export default function NicknamePrompt() {
  const { user, updateNickname } = useAuth();
  const inputId = useId();
  const dialogRef = useRef(null);
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const open = Boolean(user && !getNickname(user));

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const saved = {
      position: body.style.position, top: body.style.top, left: body.style.left,
      right: body.style.right, width: body.style.width, overflow: body.style.overflow,
    };
    const rootOverflow = document.documentElement.style.overflow;
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0', width: '100%', overflow: 'hidden' });
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      Object.assign(body.style, saved);
      document.documentElement.style.overflow = rootOverflow;
      window.scrollTo(scrollX, scrollY);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

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

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby={`${inputId}-title`} aria-describedby={`${inputId}-hint`} aria-modal="true" onCancel={(event) => event.preventDefault()} className="nickname-dialog fixed inset-0 m-auto max-h-[calc(100dvh_-_2.5rem)] w-[calc(100%_-_2.5rem)] max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-borderline bg-surface p-0 text-darkb shadow-2xl">
    <form onSubmit={handleSave} aria-label="Choose a nickname" className="p-5">
      <label id={`${inputId}-title`} htmlFor={inputId} className="font-heading text-xl text-darkb">What should we call you?</label>
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
    </dialog>,
    document.body,
  );
}
