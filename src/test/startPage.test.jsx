import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StartPage from '../components/StartPage';
import VisitPrivacy from '../components/VisitPrivacy';
import { useAuth } from '../components/context/AuthContext';
import { VISIT_STORAGE_KEY } from '../components/utils/visits';

vi.mock('../components/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../components/pages/LandingPage', () => ({ default: () => <p>Landing introduction</p> }));

function EntryRoutes({ path = '/' }) {
  return <MemoryRouter initialEntries={[path]}>
    <VisitPrivacy />
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/launch" element={<StartPage installed />} />
      <Route path="/welcome" element={<p>Explicit welcome page</p>} />
      <Route path="/login" element={<p>Login screen</p>} />
      <Route path="/entry" element={<p>Private entry</p>} />
      <Route path="/reset-password" element={<p>Reset password screen</p>} />
    </Routes>
  </MemoryRouter>;
}

describe('first and returning visits', () => {
  beforeEach(() => { localStorage.clear(); useAuth.mockReturnValue({ session: null }); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('shows the first visit introduction under Strict Mode, then login on a fresh visit', () => {
    const first = render(<StrictMode><EntryRoutes /></StrictMode>);
    expect(screen.getByText('Landing introduction')).toBeInTheDocument();
    expect(localStorage.getItem(VISIT_STORAGE_KEY)).toBe('true');
    first.unmount();
    render(<EntryRoutes />);
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('recognises browsers that used the older app', () => {
    localStorage.setItem('gr3tful-theme', 'dark');
    render(<EntryRoutes />);
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('launches the installed app at login even with fresh Home Screen storage', () => {
    render(<EntryRoutes path="/launch" />);
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('still allows deliberate access to the landing page and its old feature links', () => {
    localStorage.setItem(VISIT_STORAGE_KEY, 'true');
    const view = render(<EntryRoutes path="/#features" />);
    expect(screen.getByText('Landing introduction')).toBeInTheDocument();
    view.unmount();
    render(<EntryRoutes path="/welcome" />);
    expect(screen.getByText('Explicit welcome page')).toBeInTheDocument();
  });

  it('waits for the current visit auth check without flashing private content', () => {
    localStorage.setItem(VISIT_STORAGE_KEY, 'true');
    useAuth.mockReturnValue({ session: undefined });
    const view = render(<EntryRoutes />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByText('Private entry')).not.toBeInTheDocument();
    useAuth.mockReturnValue({ session: null });
    view.rerender(<EntryRoutes />);
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('keeps a login from the current open visit usable', () => {
    useAuth.mockReturnValue({ session: { user: { id: 'current-visit-user' } } });
    render(<EntryRoutes path="/launch" />);
    expect(screen.getByText('Private entry')).toBeInTheDocument();
  });

  it('does not intercept a password-reset link', () => {
    localStorage.setItem(VISIT_STORAGE_KEY, 'true');
    render(<EntryRoutes path="/reset-password#access_token=recovery" />);
    expect(screen.getByText('Reset password screen')).toBeInTheDocument();
  });

  it('can launch to login when the browser blocks local storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    render(<EntryRoutes path="/launch" />);
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('hides a departing page snapshot without locking a quick visibility change', () => {
    const view = render(<EntryRoutes />);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(document.documentElement.dataset.pageHidden).toBeUndefined();
    act(() => { window.dispatchEvent(new Event('pagehide')); });
    expect(document.documentElement.dataset.pageHidden).toBe('true');
    act(() => { window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false })); });
    expect(document.documentElement.dataset.pageHidden).toBeUndefined();
    view.unmount();
  });
});
