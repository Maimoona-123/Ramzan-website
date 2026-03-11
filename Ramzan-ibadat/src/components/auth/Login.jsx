// src/components/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── SVG Icons ──
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLoader = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    style={{ animation:"loginSpin .8s linear infinite", transformOrigin:"center" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconMoon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function friendlyError(code) {
  const map = {
    "auth/user-not-found":     "No account found with this email.",
    "auth/wrong-password":     "Incorrect password. Please try again.",
    "auth/invalid-email":      "Please enter a valid email address.",
    "auth/too-many-requests":  "Too many attempts. Please wait a moment.",
    "auth/invalid-credential": "Email or password is incorrect.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email:"", password:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;600;900&family=Nunito:wght@300;400;600;700;800&display=swap');

        @keyframes loginSpin    { to { transform: rotate(360deg); } }
        @keyframes loginCardIn  {
          from { opacity:0; transform: translateY(28px) scale(.96); }
          to   { opacity:1; transform: translateY(0)    scale(1);   }
        }
        @keyframes loginShake {
          0%,100% { transform: translateX(0); }
          25%     { transform: translateX(-7px); }
          75%     { transform: translateX(7px); }
        }
        @keyframes loginTwinkle { from{opacity:.55} to{opacity:1} }
        @keyframes loginFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes loginMoonPulse {
          from { box-shadow: 0 0 14px rgba(245,158,11,0.2); }
          to   { box-shadow: 0 0 28px rgba(245,158,11,0.45); }
        }

        .lg-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 24px 16px;
          background:
            radial-gradient(ellipse at 50% 0%,   rgba(245,158,11,0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 15% 100%,  rgba(13,148,136,0.05) 0%, transparent 50%),
            radial-gradient(circle  at 50% 50%,   #0d0b1a 0%, #06040f 100%);
          font-family: 'Nunito', sans-serif;
          overflow-y: auto;
          position: relative;
        }

        .lg-stars {
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
          animation: loginTwinkle 5s ease-in-out infinite alternate;
        }

        /* ── card ── */
        .lg-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 460px;
          background: rgba(13,11,26,0.97);
          border: 1px solid rgba(245,158,11,0.22);
          border-radius: 28px;
          padding: 44px 46px 38px;
          box-shadow: 0 0 80px rgba(245,158,11,0.07), 0 24px 60px rgba(0,0,0,0.5);
          animation: loginCardIn .6s cubic-bezier(.34,1.56,.64,1);
        }
        .lg-card::before {
          content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:52%; height:2px;
          background: linear-gradient(90deg,transparent,#f59e0b,transparent);
          border-radius: 0 0 4px 4px;
        }
        /* subtle side glow lines */
        .lg-card::after {
          content:''; position:absolute; inset:0; border-radius:28px; pointer-events:none;
          box-shadow: inset 0 0 60px rgba(245,158,11,0.03);
        }

        /* ── deco stars ── */
        .lg-deco-stars {
          position:absolute; top:18px; right:20px;
          display:flex; gap:5px; opacity:.32; color:#f59e0b;
        }
        .lg-deco-stars-left {
          position:absolute; top:18px; left:20px;
          display:flex; gap:5px; opacity:.2; color:#f59e0b;
        }

        /* ── header ── */
        .lg-header { text-align:center; margin-bottom:30px; }

        .lg-moon-wrap {
          display:inline-flex; align-items:center; justify-content:center;
          width:56px; height:56px; border-radius:18px; margin-bottom:16px;
          background: linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.05));
          border: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b;
          animation: loginFloat 4s ease-in-out infinite, loginMoonPulse 3s ease-in-out infinite alternate;
        }

        .lg-app-title {
          font-family: 'Cinzel', serif;
          font-size: 1.6rem; font-weight: 900;
          color: #f59e0b; letter-spacing: 2px;
          margin: 0 0 5px;
          text-shadow: 0 0 28px rgba(245,158,11,0.4);
        }
        .lg-app-sub {
          font-size: .68rem; letter-spacing: 5px;
          text-transform: uppercase;
          color: #0d9488; font-weight: 700;
        }

        /* ── divider ── */
        .lg-divider {
          height: 1px; margin: 0 0 26px;
          background: linear-gradient(90deg,transparent,rgba(245,158,11,0.2),transparent);
        }

        /* ── form heading ── */
        .lg-form-title {
          font-family: 'Cinzel', serif;
          font-size: 1.12rem; font-weight: 600;
          color: #f0ece4; letter-spacing: 1px; margin: 0 0 4px;
        }
        .lg-form-sub {
          font-size: .82rem; color: #8b8298; margin: 0 0 22px;
        }

        /* ── error ── */
        .lg-error {
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.28);
          color: #fca5a5; border-radius: 12px;
          padding: 11px 15px; font-size: .84rem;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
          animation: loginShake .4s ease;
        }

        /* ── field ── */
        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block; font-size: .72rem; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: #8b8298; margin-bottom: 7px;
        }
        .lg-inp-wrap {
          position: relative; display: flex; align-items: center;
        }
        .lg-inp-icon {
          position: absolute; left: 14px; color: #8b8298;
          display: flex; align-items: center; pointer-events: none;
          transition: color .25s;
        }
        .lg-inp-wrap:focus-within .lg-inp-icon { color: #f59e0b; }

        .lg-inp {
          width: 100%; padding: 14px 44px 14px 44px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(245,158,11,0.18);
          border-radius: 13px; color: #f0ece4;
          font-family: 'Nunito', sans-serif; font-size: .92rem;
          outline: none; box-sizing: border-box;
          transition: border-color .25s, box-shadow .25s;
        }
        .lg-inp:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1), 0 0 16px rgba(245,158,11,0.08);
        }
        .lg-inp::placeholder { color: rgba(139,130,152,0.55); }

        .lg-eye {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          color: #8b8298; padding: 4px;
          display: flex; align-items: center;
          transition: color .2s;
        }
        .lg-eye:hover { color: #f59e0b; }

        /* ── submit btn ── */
        .lg-btn {
          width: 100%; margin-top: 4px;
          padding: 15px;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border: none; border-radius: 14px;
          font-family: 'Cinzel', serif;
          font-size: .88rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #06040f; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 18px rgba(245,158,11,0.3);
          transition: all .25s;
        }
        .lg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,158,11,0.48);
        }
        .lg-btn:active:not(:disabled) { transform: translateY(0); }
        .lg-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

        /* ── switch row ── */
        .lg-switch {
          text-align: center; margin-top: 22px;
          font-size: .84rem; color: #8b8298;
        }
        .lg-switch a {
          color: #f59e0b; font-weight: 700;
          text-decoration: none; margin-left: 6px;
          transition: opacity .2s;
        }
        .lg-switch a:hover { opacity: .75; }

        /* ── arabic footer ── */
        .lg-arabic {
          text-align: center; margin-top: 22px;
          font-family: 'Scheherazade New', serif;
          font-size: 1.45rem;
          color: rgba(245,158,11,0.22);
          letter-spacing: 2px;
        }

        /* ── horizontal divider with text ── */
        .lg-or-row {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 0;
        }
        .lg-or-line {
          flex: 1; height: 1px;
          background: rgba(245,158,11,0.12);
        }
        .lg-or-text {
          font-size: .72rem; color: #8b8298;
          letter-spacing: 2px; text-transform: uppercase;
          white-space: nowrap;
        }

        @media(max-width:520px) {
          .lg-card { padding: 32px 22px 28px; border-radius: 20px; }
          .lg-app-title { font-size: 1.35rem; }
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-stars"/>

        <div className="lg-card">

          {/* Deco stars */}
          <div className="lg-deco-stars">
            <IconStar/><IconStar/><IconStar/>
          </div>
          <div className="lg-deco-stars-left">
            <IconStar/><IconStar/>
          </div>

          {/* Header */}
          <div className="lg-header">
            <div className="lg-moon-wrap"><IconMoon/></div>
            <h1 className="lg-app-title">Moon's Space</h1>
            <p className="lg-app-sub">Ramadan Legacy 1447</p>
          </div>

          <div className="lg-divider"/>

          <h2 className="lg-form-title">Welcome Back</h2>
          <p className="lg-form-sub">Sign in to continue your journey</p>

          {/* Error */}
          {error && (
            <div className="lg-error">
              <IconAlert/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="lg-field">
              <label className="lg-label">Email Address</label>
              <div className="lg-inp-wrap">
                <span className="lg-inp-icon"><IconMail/></span>
                <input className="lg-inp" type="email" name="email"
                  placeholder="your@email.com"
                  value={form.email} onChange={handleChange}
                  required autoComplete="email"/>
              </div>
            </div>

            {/* Password */}
            <div className="lg-field">
              <label className="lg-label">Password</label>
              <div className="lg-inp-wrap">
                <span className="lg-inp-icon"><IconLock/></span>
                <input className="lg-inp"
                  type={showPw ? "text" : "password"}
                  name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required autoComplete="current-password"/>
                <button type="button" className="lg-eye"
                  onClick={() => setShowPw(s => !s)}>
                  {showPw ? <IconEyeOff/> : <IconEye/>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? <IconLoader/> : null}
              {loading ? "Signing in..." : (
                <><span>Sign In</span><IconArrow/></>
              )}
            </button>
          </form>

          {/* OR divider */}
          <div className="lg-or-row">
            <div className="lg-or-line"/>
            <span className="lg-or-text">New here?</span>
            <div className="lg-or-line"/>
          </div>

          {/* Switch */}
          <div className="lg-switch">
            Don't have an account?
            <Link to="/signup">Create Account</Link>
          </div>

          {/* Arabic footer */}
          <div className="lg-arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</div>

        </div>
      </div>
    </>
  );
}