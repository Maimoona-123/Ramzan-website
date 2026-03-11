// src/components/AuthPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// ── SVG Icons ──
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconEyeOff2 = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLoader = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    style={{ animation:"apSpin .8s linear infinite", transformOrigin:"center", display:"block" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMoon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconStar = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function passwordStrength(pw) {
  if (!pw) return { pct: 0, color: "#ef4444", label: "" };
  let s = 0;
  if (pw.length >= 6)          s++;
  if (pw.length >= 10)         s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { pct: 25,  color: "#ef4444", label: "Weak" };
  if (s <= 2) return { pct: 50,  color: "#f59e0b", label: "Fair" };
  if (s <= 3) return { pct: 75,  color: "#10b981", label: "Good" };
  return            { pct: 100, color: "#10b981", label: "Strong" };
}

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode]       = useState("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);

  const isLogin  = mode === "login";
  const strength = passwordStrength(password);
  const pwMatch  = confirm && password === confirm;
  const pwBad    = confirm && password !== confirm;

  const switchMode = (m) => {
    setMode(m); setError("");
    setName(""); setEmail(""); setPassword(""); setConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && password !== confirm) return setError("Passwords don't match.");
    if (!isLogin && password.length < 6)  return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else         await signup(name.trim(), email, password);
    } catch (err) {
      const map = {
        "auth/user-not-found":      "No account found. Please sign up first.",
        "auth/wrong-password":      "Incorrect password. Try again.",
        "auth/email-already-in-use":"Email already registered. Please sign in.",
        "auth/invalid-email":       "Please enter a valid email address.",
        "auth/too-many-requests":   "Too many attempts. Try again later.",
        "auth/invalid-credential":  "Invalid email or password.",
      };
      setError(map[err.code] || "Something went wrong. Check your Firebase config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;600;900&family=Nunito:wght@300;400;600;700;800&display=swap');

        @keyframes apSpin    { to { transform: rotate(360deg); } }
        @keyframes apCardIn  {
          from { opacity:0; transform:translateY(30px) scale(.95); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes apShake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-7px)}
          75%{transform:translateX(7px)}
        }
        @keyframes apTwinkle { from{opacity:.5} to{opacity:1} }
        @keyframes apFloat {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-7px)}
        }
        @keyframes apMoonPulse {
          from{box-shadow:0 0 14px rgba(245,158,11,.2),0 0 0 0 rgba(245,158,11,0)}
          to  {box-shadow:0 0 28px rgba(245,158,11,.45),0 0 0 8px rgba(245,158,11,.04)}
        }
        @keyframes apSlideIn {
          from{opacity:0;transform:translateY(12px)}
          to  {opacity:1;transform:translateY(0)}
        }

        .ap-root {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 24px 16px;
          background:
            radial-gradient(ellipse at 50% 0%,  rgba(245,158,11,.12) 0%, transparent 55%),
            radial-gradient(ellipse at 0%  80%,  rgba(13,148,136,.05) 0%, transparent 50%),
            radial-gradient(circle  at 50% 50%,  #0d0b1a 0%, #06040f 100%);
          font-family: 'Nunito', sans-serif;
          overflow-y: auto;
        }

        .ap-stars {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(1px   1px   at  7% 12%, rgba(255,255,255,.8)  0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 23%  7%, rgba(245,158,11,.9)   0%,transparent 100%),
            radial-gradient(1px   1px   at 41% 18%, rgba(255,255,255,.55) 0%,transparent 100%),
            radial-gradient(2px   2px   at 63%  4%, rgba(245,158,11,.7)   0%,transparent 100%),
            radial-gradient(1px   1px   at 78% 22%, rgba(255,255,255,.6)  0%,transparent 100%),
            radial-gradient(1px   1px   at 14% 57%, rgba(255,255,255,.4)  0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 33% 74%, rgba(245,158,11,.55)  0%,transparent 100%),
            radial-gradient(1px   1px   at 87% 63%, rgba(255,255,255,.45) 0%,transparent 100%),
            radial-gradient(1px   1px   at 54% 88%, rgba(255,255,255,.3)  0%,transparent 100%),
            radial-gradient(2px   2px   at 92% 35%, rgba(245,158,11,.5)   0%,transparent 100%),
            radial-gradient(1px   1px   at  5% 90%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1px   1px   at 70% 50%, rgba(255,255,255,.25) 0%,transparent 100%);
          animation: apTwinkle 5s ease-in-out infinite alternate;
        }

        /* ── outer wrapper ── */
        .ap-wrap {
          position: relative; z-index: 2; margin: auto;
          width: 100%; max-width: 460px;
          animation: apCardIn .65s cubic-bezier(.34,1.56,.64,1);
        }

        /* ── top header (outside card) ── */
        .ap-header {
          text-align: center; margin-bottom: 22px; margin-top: 4px;
        }
        .ap-moon-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 64px; height: 64px; border-radius: 20px; margin-bottom: 14px;
          background: linear-gradient(135deg,rgba(245,158,11,.18),rgba(245,158,11,.05));
          border: 1px solid rgba(245,158,11,.32);
          color: #f59e0b;
          animation: apFloat 4.5s ease-in-out infinite, apMoonPulse 3s ease-in-out infinite alternate;
        }
        .ap-title {
          font-family: 'Cinzel', serif;
          font-size: 2rem; font-weight: 900;
          color: #f59e0b; letter-spacing: 3px; margin: 0 0 5px;
          text-shadow: 0 0 30px rgba(245,158,11,.45);
        }
        .ap-subtitle {
          font-size: .67rem; letter-spacing: 5px;
          text-transform: uppercase;
          color: #0d9488; font-weight: 700;
        }

        /* ── card ── */
        .ap-card {
          background: rgba(13,11,26,.97);
          border: 1px solid rgba(245,158,11,.2);
          border-radius: 28px;
          padding: 38px 42px 34px;
          box-shadow: 0 0 80px rgba(245,158,11,.07), 0 24px 60px rgba(0,0,0,.55);
          position: relative; overflow: hidden;
        }
        .ap-card::before {
          content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:55%; height:2px;
          background:linear-gradient(90deg,transparent,#f59e0b,transparent);
          border-radius:0 0 4px 4px;
        }

        /* deco stars */
        .ap-deco {
          position:absolute; top:16px; right:18px;
          display:flex; gap:4px; color:#f59e0b; opacity:.3;
        }
        .ap-deco-l {
          position:absolute; top:16px; left:18px;
          display:flex; gap:4px; color:#f59e0b; opacity:.18;
        }

        /* ── tabs ── */
        .ap-tabs {
          display: flex; gap: 0;
          background: rgba(0,0,0,.35);
          border-radius: 16px; padding: 4px;
          margin-bottom: 28px;
        }
        .ap-tab {
          flex: 1; padding: 11px 8px;
          border: none; border-radius: 12px;
          font-family: 'Cinzel', serif;
          font-size: .8rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer; transition: all .3s;
        }
        .ap-tab-active {
          background: linear-gradient(135deg,#d97706,#f59e0b);
          color: #06040f;
          box-shadow: 0 4px 14px rgba(245,158,11,.3);
        }
        .ap-tab-inactive {
          background: transparent;
          color: rgba(240,236,228,.45);
        }
        .ap-tab-inactive:hover { color: rgba(240,236,228,.75); }

        /* ── form heading ── */
        .ap-form-title {
          font-family: 'Cinzel', serif;
          font-size: 1.15rem; font-weight: 600;
          color: #f0ece4; letter-spacing: 1px;
          margin: 0 0 4px;
        }
        .ap-form-sub {
          font-size: .82rem; color: #8b8298;
          margin: 0 0 20px; line-height: 1.5;
        }

        /* ── error ── */
        .ap-error {
          background: rgba(244,63,94,.1);
          border: 1px solid rgba(244,63,94,.28);
          color: #fca5a5; border-radius: 13px;
          padding: 11px 14px; font-size: .84rem;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 9px;
          animation: apShake .4s ease;
        }

        /* ── field ── */
        .ap-field { margin-bottom: 16px; animation: apSlideIn .4s ease; }
        .ap-label {
          display: block; font-size: .7rem; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: #8b8298; margin-bottom: 7px;
        }
        .ap-inp-wrap {
          position: relative; display: flex; align-items: center;
        }
        .ap-inp-icon {
          position: absolute; left: 14px;
          color: #8b8298; display: flex; align-items: center;
          pointer-events: none; transition: color .25s;
        }
        .ap-inp-wrap:focus-within .ap-inp-icon { color: #f59e0b; }

        .ap-inp {
          width: 100%; padding: 15px 46px 15px 44px;
          background: rgba(0,0,0,.45);
          border: 1px solid rgba(245,158,11,.18);
          border-radius: 13px; color: #f0ece4;
          font-family: 'Nunito', sans-serif; font-size: .95rem;
          outline: none; box-sizing: border-box;
          transition: border-color .25s, box-shadow .25s;
        }
        .ap-inp:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,.1);
        }
        .ap-inp::placeholder { color: rgba(139,130,152,.55); }

        .ap-eye {
          position: absolute; right: 12px;
          background: none; border: none; cursor: pointer;
          color: #8b8298; padding: 4px;
          display: flex; align-items: center;
          transition: color .2s;
        }
        .ap-eye:hover { color: #f59e0b; }

        /* ── strength ── */
        .ap-strength {
          display: flex; align-items: center; gap: 10px; margin-top: 7px;
        }
        .ap-strength-track {
          flex: 1; height: 3px;
          background: rgba(255,255,255,.07); border-radius: 4px; overflow: hidden;
        }
        .ap-strength-fill {
          height: 100%; border-radius: 4px;
          transition: width .4s, background .4s;
        }
        .ap-strength-lbl {
          font-size: .68rem; font-weight: 800;
          letter-spacing: 1px; min-width: 42px; text-align: right;
        }

        /* ── match hints ── */
        .ap-ok  { font-size:.75rem; color:#10b981; margin-top:6px; display:flex; align-items:center; gap:5px; }
        .ap-bad { font-size:.75rem; color:#f43f5e; margin-top:6px; }

        /* ── submit ── */
        .ap-btn {
          width: 100%; margin-top: 8px;
          padding: 15px;
          background: linear-gradient(135deg,#d97706,#f59e0b);
          border: none; border-radius: 14px;
          font-family: 'Cinzel', serif;
          font-size: .85rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #06040f; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 18px rgba(245,158,11,.3);
          transition: all .25s;
        }
        .ap-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,158,11,.48);
        }
        .ap-btn:active:not(:disabled) { transform: translateY(0); }
        .ap-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }

        /* ── switch ── */
        .ap-switch {
          text-align: center; margin-top: 22px;
          font-size: .83rem; color: #8b8298;
        }
        .ap-switch-btn {
          background: none; border: none;
          color: #f59e0b; font-weight: 800;
          font-size: .83rem; font-family: 'Nunito', sans-serif;
          cursor: pointer; margin-left: 5px;
          transition: opacity .2s;
        }
        .ap-switch-btn:hover { opacity: .75; }

        /* ── footer ── */
        .ap-footer {
          text-align: center; margin-top: 16px;
          font-size: .68rem; opacity: .35;
          letter-spacing: 2px; color: #f0ece4;
        }
        .ap-arabic {
          text-align: center; margin-top: 18px;
          font-family: 'Scheherazade New', serif;
          font-size: 1.3rem; color: rgba(245,158,11,.22);
        }

        /* ── divider ── */
        .ap-divider {
          height: 1px; margin: 20px 0 0;
          background: linear-gradient(90deg,transparent,rgba(245,158,11,.15),transparent);
        }

        @media(max-width:520px){
          .ap-card { padding:28px 20px 26px; border-radius:20px; }
          .ap-title { font-size:1.4rem; }
        }
      `}</style>

      <div className="ap-root">
        <div className="ap-stars"/>

        <div className="ap-wrap">

          {/* ── Card ── */}
          <div className="ap-card">

            {/* Deco stars */}
            <div className="ap-deco"><IconStar/><IconStar/><IconStar/></div>
            <div className="ap-deco-l"><IconStar/><IconStar/></div>

            {/* ── Header inside card ── */}
            <div className="ap-header">
              <div className="ap-moon-btn"><IconMoon/></div>
              <div className="ap-title">MOON</div>
              <div className="ap-subtitle">Ramadan 1447 · Legacy OS</div>
            </div>

            {/* Tabs */}
            <div className="ap-tabs">
              {["login","signup"].map(m => (
                <button key={m}
                  className={`ap-tab ${mode===m ? "ap-tab-active" : "ap-tab-inactive"}`}
                  onClick={() => switchMode(m)}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form title */}
            <div className="ap-form-title">
              {isLogin ? "Welcome Back" : "Begin Your Journey"}
            </div>
            <div className="ap-form-sub">
              {isLogin
                ? "Sign in to continue your Ramadan journey"
                : "Create your blessed Ramadan sanctuary"}
            </div>

            {/* Error */}
            {error && (
              <div className="ap-error">
                <IconAlert/> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Name — signup only */}
              {!isLogin && (
                <div className="ap-field">
                  <label className="ap-label">Your Name</label>
                  <div className="ap-inp-wrap">
                    <span className="ap-inp-icon"><IconUser/></span>
                    <input className="ap-inp" type="text"
                      placeholder="e.g. Kinza Fatima"
                      value={name} onChange={e => setName(e.target.value)}
                      required autoComplete="name"/>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="ap-field">
                <label className="ap-label">Email Address</label>
                <div className="ap-inp-wrap">
                  <span className="ap-inp-icon"><IconMail/></span>
                  <input className="ap-inp" type="email"
                    placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="email"/>
                </div>
              </div>

              {/* Password */}
              <div className="ap-field">
                <label className="ap-label">Password</label>
                <div className="ap-inp-wrap">
                  <span className="ap-inp-icon"><IconLock/></span>
                  <input className="ap-inp"
                    type={showPw ? "text" : "password"}
                    placeholder={isLogin ? "Your password" : "Min. 6 characters"}
                    value={password} onChange={e => setPassword(e.target.value)}
                    required autoComplete={isLogin ? "current-password" : "new-password"}/>
                  <button type="button" className="ap-eye"
                    onClick={() => setShowPw(s => !s)}>
                    {showPw ? <IconEyeOff/> : <IconEye/>}
                  </button>
                </div>
                {/* Strength — signup only */}
                {!isLogin && password && (
                  <div className="ap-strength">
                    <div className="ap-strength-track">
                      <div className="ap-strength-fill"
                        style={{ width:`${strength.pct}%`, background:strength.color }}/>
                    </div>
                    <span className="ap-strength-lbl" style={{ color:strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm — signup only */}
              {!isLogin && (
                <div className="ap-field">
                  <label className="ap-label">Confirm Password</label>
                  <div className="ap-inp-wrap">
                    <span className="ap-inp-icon"><IconLock/></span>
                    <input className="ap-inp"
                      type={showCf ? "text" : "password"}
                      placeholder="Repeat password"
                      value={confirm} onChange={e => setConfirm(e.target.value)}
                      required
                      style={{
                        borderColor: pwBad ? "rgba(244,63,94,.5)" : pwMatch ? "rgba(16,185,129,.5)" : ""
                      }}/>
                    <button type="button" className="ap-eye"
                      onClick={() => setShowCf(s => !s)}>
                      {showCf ? <IconEyeOff/> : <IconEye/>}
                    </button>
                  </div>
                  {pwMatch && <p className="ap-ok"><IconCheck/> Passwords match</p>}
                  {pwBad   && <p className="ap-bad">Passwords don't match</p>}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="ap-btn" disabled={loading}>
                {loading
                  ? <><IconLoader/>{isLogin ? "Signing in..." : "Creating account..."}</>
                  : <><span>{isLogin ? "Sign In" : "Create Account"}</span><IconArrow/></>
                }
              </button>
            </form>

            <div className="ap-divider"/>

            {/* Switch */}
            <div className="ap-switch">
              {isLogin ? "New here?" : "Already have an account?"}
              <button className="ap-switch-btn"
                onClick={() => switchMode(isLogin ? "signup" : "login")}>
                {isLogin ? "Create an account" : "Sign in instead"}
              </button>
            </div>

            {/* Arabic */}
            <div className="ap-arabic">
              {isLogin ? "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ" : "رَمَضَان مُبَارَك"}
            </div>
          </div>

          {/* Footer */}
          <div className="ap-footer">
            Secured with Firebase Authentication
          </div>

        </div>
      </div>
    </>
  );
}