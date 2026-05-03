import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, setAccessToken, setAccessTokenGetter } from "../services/api";
import { safeInternalPath } from "../utils/navigation.js";
import { isSupabaseConfigured, supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

/**
 * @param {{ silent?: boolean }} [options]
 * - silent: when true, do not toggle `loading` (avoids blanking Protected routes on TOKEN_REFRESHED / tab focus).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  const refresh = useCallback(async (options = {}) => {
    const silent = Boolean(options.silent);
    setError(null);
    if (!silent) setLoading(true);
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
    } catch (e) {
      setError(e);
      setUser(null);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  async function logout(options = {}) {
    const { redirectTo } = options;
    try {
      if (supabase) await supabase.auth.signOut();
    } catch {
      // Still clear client state and redirect — sign-out must not block navigation.
    }
    setUser(null);
    setSession(null);
    setAccessToken(null);
    if (redirectTo) {
      const href =
        redirectTo.startsWith("http://") || redirectTo.startsWith("https://")
          ? redirectTo
          : new URL(redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`, window.location.origin).href;
      window.location.assign(href);
    }
  }

  async function signInWithGoogle(nextPath) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const safe = safeInternalPath(nextPath);
    const path = safe ?? "/dashboard";
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${path}` },
    });
    if (e) throw e;
  }

  async function sendEmailOtp(email) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (e) throw e;
  }

  async function verifyEmailOtp({ email, token }) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error: e } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (e) throw e;
    setSession(data.session ?? null);
  }

  useEffect(() => {
    setAccessTokenGetter(async () => {
      if (!supabase) return null;
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });

    if (!isSupabaseConfigured()) {
      setError(
        new Error(
          "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env."
        )
      );
      setLoading(false);
      return () => {};
    }

    let unsub = () => {};

    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setAccessToken(data.session?.access_token ?? null);
      await refresh();

      const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
        setSession(s ?? null);
        setAccessToken(s?.access_token ?? null);
        // Avoid duplicate /api/auth/me right after the initial getSession + refresh above.
        if (event === "INITIAL_SESSION") return;
        // Never toggle global `loading` here — TOKEN_REFRESHED (tab focus), SIGNED_IN, etc. would blank Protected routes.
        await refresh({ silent: true });
      });
      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => unsub();
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh,
      logout,
      session,
      signInWithGoogle,
      sendEmailOtp,
      verifyEmailOtp,
    }),
    [user, loading, error, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

