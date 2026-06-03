import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  fullName: string;
  picture: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, isLoggedIn: false, isAdmin: false, loading: true,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => {},
  logout: async () => {},
});

function toAuthUser(supabaseUser: User): AuthUser {
  const meta = supabaseUser.user_metadata || {};
  const fullName = meta.full_name || meta.name || "";
  const raw = meta.given_name || fullName.split(" ")[0] || supabaseUser.email?.split("@")[0] || "User";
  const firstName = raw.charAt(0).toUpperCase() + raw.slice(1);
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    firstName,
    fullName: fullName || firstName,
    picture: meta.avatar_url || meta.picture || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase() || "deanna@druaiconsulting.com";
  const isAdmin = !!user && user.email.toLowerCase() === adminEmail;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const authUser = toAuthUser(session.user);
        setUser(authUser);
        // Fetch from profiles table for correctly cased name
        supabase.from("profiles").select("first_name, last_name").eq("id", session.user.id).single()
          .then(({ data }) => {
            if (data?.first_name) {
              setUser(prev => prev ? {
                ...prev,
                firstName: data.first_name!,
                fullName: [data.first_name, data.last_name].filter(Boolean).join(" ") || prev.fullName,
              } : prev);
            }
          });
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const authUser = toAuthUser(session.user);
        setUser(authUser);
        // Fetch from profiles table for correctly cased name
        supabase.from("profiles").select("first_name, last_name").eq("id", session.user.id).single()
          .then(({ data }) => {
            if (data?.first_name) {
              setUser(prev => prev ? {
                ...prev,
                firstName: data.first_name!,
                fullName: [data.first_name, data.last_name].filter(Boolean).join(" ") || prev.fullName,
              } : prev);
            }
          });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoggedIn: !!user, isAdmin, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
