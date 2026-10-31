import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading

  async function signOut() {
    // A device can be shared; stop reminders for the signed-out account.
    try {
      if (session?.user && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        const push = await registration?.pushManager?.getSubscription();
        if (push) {
          const { error } = await supabase.from('push_subscriptions').delete()
            .eq('user_id', session.user.id).eq('endpoint', push.endpoint);
          if (error) throw error;
          await push.unsubscribe();
        }
      }
    } catch { /* The user can still sign out if push cleanup fails. */ }
    return supabase.auth.signOut();
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
