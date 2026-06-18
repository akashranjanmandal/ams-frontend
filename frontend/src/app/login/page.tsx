"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

type Mode = "login" | "signup";

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const me = await login(email.trim(), password);
      push("success", `Welcome back, ${me.full_name.split(" ")[0]}!`);
      router.replace("/dashboard");
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Login failed");
      setBusy(false);
    }
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/auth/signup", {
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        designation,
        department,
        phone,
      });
      setDone(true);
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-stretch">
      {/* Brand panel */}
      <div
        className="relative hidden w-[44%] flex-col justify-between p-12 text-white lg:flex"
        style={{ background: "var(--color-green)" }}
      >
        <Logo light size={52} />
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            Human Resource
            <br />
            Management System
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85">
            One simple, secure place for leave, attendance, profiles and
            approvals — for every member of staff at Assam Veterinary &amp;
            Fisheries University.
          </p>
          <ul className="mt-6 space-y-2 text-white/90">
            {[
              "Apply leave and track approvals",
              "Mark daily attendance",
              "Manage your own profile",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 size={18} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-white/75">
          <ShieldCheck size={18} /> Secure government-grade access
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 items-center justify-center bg-[var(--color-bg)] p-5">
        <div
          className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] p-8 sm:p-10 [&_.btn]:rounded-xl [&_.input]:rounded-xl"
          style={{
            border: "1.5px solid var(--color-line)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="mb-6 lg:hidden">
            <Logo size={46} />
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-[var(--color-green)]"
                style={{ border: "2px solid var(--color-green)" }}
              >
                <CheckCircle2 size={34} />
              </div>
              <h1 className="text-2xl font-bold">Account requested</h1>
              <p className="mt-2 text-[var(--color-ink-soft)]">
                Your account has been created and is now awaiting administrator
                approval. You will be able to sign in once it is approved.
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  setMode("login");
                }}
                className="btn btn-primary mt-6 w-full"
              >
                Back to sign in
              </button>
            </motion.div>
          ) : (
            <>
              <div
                className="mb-7 grid grid-cols-2 gap-1 rounded-full p-1"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1.5px solid var(--color-line)",
                }}
              >
                {(["login", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative rounded-full py-2.5 text-[15px] font-semibold transition-colors"
                    style={{ color: mode === m ? "#fff" : "var(--color-ink-soft)" }}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="auth-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "var(--color-green)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">
                      {m === "login" ? "Sign In" : "Sign Up"}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={submitLogin}
                    className="space-y-4"
                  >
                    <h1 className="text-2xl font-bold">Sign in to your account</h1>
                    <div>
                      <label className="label">Email address</label>
                      <input
                        className="input"
                        type="email"
                        autoComplete="username"
                        placeholder="you@avfu.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Password</label>
                      <div className="relative">
                        <input
                          className="input pr-12"
                          type={show ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShow((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)] hover:text-[var(--color-green)]"
                          tabIndex={-1}
                        >
                          {show ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                      {busy ? <Spinner /> : <>Sign in <ArrowRight size={18} /></>}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={submitSignup}
                    className="space-y-4"
                  >
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="-mt-2 text-sm text-[var(--color-ink-faint)]">
                      New accounts require administrator approval before sign in.
                    </p>
                    <div>
                      <label className="label">Full name</label>
                      <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Pranjal Sharma" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Designation</label>
                        <input className="input" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Lecturer" />
                      </div>
                      <div>
                        <label className="label">Department</label>
                        <input className="input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Fisheries" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" />
                    </div>
                    <div>
                      <label className="label">Email address</label>
                      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@avfu.ac.in" required />
                    </div>
                    <div>
                      <label className="label">Password</label>
                      <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" required minLength={6} />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                      {busy ? <Spinner /> : <>Create account <ArrowRight size={18} /></>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
