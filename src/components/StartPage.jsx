import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { hasVisitedBefore } from './utils/visits';
import LandingPage from './pages/LandingPage';

export default function StartPage({ installed = false }) {
  const { session } = useAuth();
  const { hash } = useLocation();
  const [returningVisitor] = useState(hasVisitedBefore);
  const landingSection = hash === '#features' || hash === '#how-it-works';

  if (!installed && (!returningVisitor || landingSection)) return <LandingPage />;
  if (session === undefined) {
    return <div role="status" className="flex min-h-screen items-center justify-center bg-surface font-parag text-sm italic text-secondary-text">Loading…</div>;
  }
  return <Navigate to={session ? '/entry' : '/login'} replace />;
}
