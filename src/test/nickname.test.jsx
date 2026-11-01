import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../components/context/AuthContext';
import SignupPage from '../components/pages/SignupPage';
import JournalPage from '../components/pages/JournalPage';

const { signUp, updateUser, getSession } = vi.hoisted(() => ({
  signUp: vi.fn(), updateUser: vi.fn(), getSession: vi.fn(),
}));

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp, updateUser, getSession,
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
    })),
  },
}));
vi.mock('../components/ThemeToggle', () => ({ default: () => <button type="button">Theme</button> }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn() }, Toaster: () => null }));

function renderJournal(metadata = {}) {
  const account = { id: 'existing-user', user_metadata: metadata };
  getSession.mockResolvedValue({ data: { session: { user: account } } });
  return render(<MemoryRouter><AuthProvider><JournalPage /></AuthProvider></MemoryRouter>);
}

describe('nicknames', () => {
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;
  const originalScrollTo = window.scrollTo;
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; this.querySelector('input')?.focus(); };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
    window.scrollTo = vi.fn();
  });
  afterAll(() => {
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
    window.scrollTo = originalScrollTo;
  });
  beforeEach(() => {
    vi.clearAllMocks();
    signUp.mockResolvedValue({ error: null });
    updateUser.mockResolvedValue({ data: { user: { id: 'existing-user', user_metadata: { nickname: 'Mira Rose' } } }, error: null });
  });

  it('saves a trimmed nickname with signup and continues to email confirmation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<p>Confirm your email</p>} />
    </Routes></MemoryRouter>);
    const nickname = screen.getByLabelText('What should we call you?');
    expect(nickname).toBeRequired();
    expect(nickname).toHaveAttribute('maxlength', '40');
    await user.type(nickname, '  Mira   Rose  ');
    await user.type(screen.getByLabelText('Email'), 'mira@example.com');
    await user.type(screen.getByLabelText('Password'), 'new-password-123');
    await user.type(screen.getByLabelText('Confirm Password'), 'new-password-123');
    await user.click(screen.getByRole('button', { name: 'Create account →' }));
    await screen.findByText('Confirm your email');
    expect(signUp).toHaveBeenCalledWith({
      email: 'mira@example.com', password: 'new-password-123',
      options: { data: { nickname: 'Mira Rose' } },
    });
  });

  it('rejects a nickname made only of spaces before creating an account', async () => {
    render(<MemoryRouter><SignupPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('What should we call you?'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Create account →' }).closest('form'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please tell us what to call you.');
    expect(signUp).not.toHaveBeenCalled();
  });

  it('prompts an existing account and updates the real journal heading after saving', async () => {
    const user = userEvent.setup();
    renderJournal();
    await screen.findByRole('heading', { name: 'A record of your good things.' });
    const dialog = screen.getByRole('dialog', { name: 'What should we call you?' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.position).toBe('fixed');
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(screen.getByRole('textbox', { name: 'What should we call you?' })).toHaveFocus();
    expect(screen.queryByText('Your journal', { exact: true })).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'What should we call you?' }), '  Mira   Rose  ');
    await user.click(screen.getByRole('button', { name: 'Save nickname' }));
    await screen.findByRole('heading', { name: 'A record of Mira Rose’s good things.' });
    expect(updateUser).toHaveBeenCalledWith({ data: { nickname: 'Mira Rose' } });
    expect(screen.queryByRole('form', { name: 'Choose a nickname' })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.position).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('uses a saved nickname without prompting again', async () => {
    renderJournal({ nickname: 'Zoë O’Neil' });
    await screen.findByRole('heading', { name: 'A record of Zoë O’Neil’s good things.' });
    expect(screen.queryByLabelText('What should we call you?')).not.toBeInTheDocument();
  });

  it('keeps the prompt and fallback greeting when saving fails', async () => {
    updateUser.mockResolvedValue({ data: { user: null }, error: { message: 'Could not save your nickname.' } });
    const user = userEvent.setup();
    renderJournal();
    await user.type(await screen.findByRole('textbox', { name: 'What should we call you?' }), 'Mira');
    await user.click(screen.getByRole('button', { name: 'Save nickname' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Could not save your nickname.'));
    expect(screen.getByRole('heading', { name: 'A record of your good things.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save nickname' })).toBeEnabled();
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('keeps the prompt open on Escape and restores scrolling when leaving the page', async () => {
    const view = renderJournal();
    const dialog = await screen.findByRole('dialog');
    const cancel = new Event('cancel', { bubbles: true, cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog).toHaveAttribute('open');
    view.unmount();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });
});
