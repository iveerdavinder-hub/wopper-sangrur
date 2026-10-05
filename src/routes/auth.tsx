import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShieldCheck, KeyRound, Mail, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { loginStaff, ADMIN_PASSCODE } from "@/lib/admin-store";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Staff Sign In | Wopper Sangrur Admin" }, { name: "robots", content: "noindex" }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"passcode" | "supabase">("passcode");
  const [passcode, setPasscode] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const entered = passcode.trim() || ADMIN_PASSCODE;
    if (loginStaff(entered)) {
      nav({ to: "/admin" });
    } else {
      setMsg(`Incorrect passcode. Use default: ${ADMIN_PASSCODE}`);
    }
  }

  function handleQuickAccess() {
    loginStaff(ADMIN_PASSCODE);
    nav({ to: "/admin" });
  }

  async function handleSupabaseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")),
      password = String(f.get("password"));

    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMsg(error.message);
      loginStaff(); // also grant local staff session
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      setMsg(error ? error.message : "Check your email to confirm your account.");
    }
  }

  return (
    <section className="mx-auto max-w-lg px-5 py-16 md:py-24 animate-rise">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff & Admin Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage customer bookings, enquiries, and live visitor traffic.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-surface p-1.5 border border-border/80">
          <button
            type="button"
            onClick={() => {
              setTab("passcode");
              setMsg("");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              tab === "passcode"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Admin Passcode
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("supabase");
              setMsg("");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              tab === "supabase"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4" />
            Supabase Login
          </button>
        </div>

        {/* PASSCODE / QUICK ACCESS */}
        {tab === "passcode" && (
          <div className="mt-6 space-y-5">
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Admin Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode (default: wopper123)"
                    className="field !pl-10"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Enter Admin Dashboard
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </form>

            <div className="relative flex items-center justify-center pt-2">
              <div className="w-full border-t border-border/60" />
              <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                or instant access
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAccess}
              className="btn btn-ghost w-full border border-primary/40 hover:bg-primary/10 text-primary font-semibold text-sm"
            >
              <Sparkles className="h-4 w-4" />
              1-Click Staff Login (Developer / Localhost)
            </button>
          </div>
        )}

        {/* SUPABASE EMAIL/PASSWORD */}
        {tab === "supabase" && (
          <form onSubmit={handleSupabaseSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Staff Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="staff@wopper.in"
                className="field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="field"
                autoComplete={mode === "in" ? "current-password" : "new-password"}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Authenticating..." : mode === "in" ? "Sign in with Email" : "Create Account"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
                className="text-xs text-primary hover:underline"
              >
                {mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}
              </button>
            </div>
          </form>
        )}

        {msg && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
            {msg}
          </div>
        )}

        <div className="mt-8 border-t border-border/60 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Default Passcode: <span className="font-mono text-primary font-bold">wopper123</span>
          </p>
        </div>
      </div>
    </section>
  );
}
