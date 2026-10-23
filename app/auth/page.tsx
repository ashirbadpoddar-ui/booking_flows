"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Brand } from "@/components/site-header";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) { setMessage("Supabase is not configured. Use either demo role below."); return; }
    setBusy(true); setMessage("");
    try {
      const result = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === "signup"
          ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
          : await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
      if (result.error) throw result.error;
      setMessage(mode === "signin" ? "Signed in successfully." : "Check your email to continue.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Authentication failed."); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><section className="auth-form-side"><Brand/><form onSubmit={submit} className="auth-form"><div className="eyebrow">Customer account</div><h1 className="display">{mode === "signin" ? "Welcome back." : mode === "signup" ? "Create your account." : "Reset your password."}</h1><p className="auth-copy">{mode === "reset" ? "Enter your email and we’ll send a secure reset link." : "Manage visits, make changes, and keep your booking history in one place."}</p>{message && <div className="form-error" role="status">{message}</div>}<div className="form-grid">{mode === "signup" && <div className="field full"><label htmlFor="auth-name">Full name</label><input id="auth-name" autoComplete="name" required value={fullName} onChange={(e)=>setFullName(e.target.value)}/></div>}<div className="field full"><label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/></div>{mode !== "reset" && <div className="field full"><label htmlFor="auth-password">Password</label><input id="auth-password" type="password" minLength={8} required autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e)=>setPassword(e.target.value)}/></div>}</div><button className="btn btn-primary" disabled={busy} style={{width:"100%",marginTop:20}}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"} <ArrowRight size={15}/></button>{mode === "signin" && <button type="button" className="btn btn-ghost" style={{width:"100%",marginTop:8}} onClick={()=>setMode("reset")}>Forgot password?</button>}<p className="auth-switch">{mode === "signin" ? "New to BookingFlow?" : "Already have an account?"} <button type="button" onClick={()=>setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p><div className="demo-access"><div className="demo-pill">Portfolio demo</div><p>Explore either role without entering credentials. Demo access uses seeded presentation data and is separate from production authentication.</p><div><Link className="btn btn-secondary" href="/account">Demo customer</Link><Link className="btn btn-secondary" href="/admin">Demo admin</Link></div></div></form></section><aside className="auth-art"><div className="eyebrow">North & Row</div><h2 className="display">Your time, organized beautifully.</h2>{["See every appointment in one place","Reschedule or cancel without calling","Book faster with saved details"].map((text)=><p key={text}><Check size={17}/>{text}</p>)}</aside></main>;
}
