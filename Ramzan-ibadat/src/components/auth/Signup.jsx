// src/components/auth/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── SVG Icons (no emojis) ──
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
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
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLoader = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}} svg{animation:spin .8s linear infinite;transform-origin:center}`}</style>
  </svg>
);
const IconMoon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function passwordStrength(pw) {
  if (!pw) return { pct: 0, color: "#ef4444", label: "" };
  let score = 0;
  if (pw.length >= 6)           score++;
  if (pw.length >= 10)          score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 1) return { pct: 25,  color: "#ef4444", label: "Weak" };
  if (score <= 2) return { pct: 50,  color: "#f59e0b", label: "Fair" };
  if (score <= 3) return { pct: 75,  color: "#10b981", label: "Good" };
  return              { pct: 100, color: "#10b981", label: "Strong" };
}

function friendlyError(code) {
  const map = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email":        "Please enter a valid email address.",
    "auth/weak-password":        "Password is too weak.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({ displayName:"", email:"", password:"", confirm:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.displayName.trim())    return setError("Please enter your name.");
    if (form.password.length < 6)    return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await signup(form.email, form.password, form.displayName.trim());
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);
  const pwMatch  = form.confirm && form.password === form.confirm;
  const pwNoMatch = form.confirm && form.password !== form.confirm;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;600;900&family=Nunito:wght@300;400;600;700;800&display=swap');

        .su-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.1) 0%, transparent 55%),
                      radial-gradient(circle at 50% 50%, #0d0b1a 0%, #06040f 100%);
          font-family: 'Nunito', sans-serif;
          overflow-y: auto;
          position: relative;
        }

        /* star bg */
        .su-stars {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(1px 1px at 7%  12%, rgba(255,255,255,.75) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 23% 7%, rgba(245,158,11,.9) 0%,transparent 100%),
            radial-gradient(1px 1px at 41% 18%, rgba(255,255,255,.5) 0%,transparent 100%),
            radial-gradient(2px 2px at 63%  4%, rgba(245,158,11,.7) 0%,transparent 100%),
            radial-gradient(1px 1px at 78% 22%, rgba(255,255,255,.6) 0%,transparent 100%),
            radial-gradient(1px 1px at 14% 57%, rgba(255,255,255,.4) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 33% 74%, rgba(245,158,11,.55) 0%,transparent 100%),
            radial-gradient(1px 1px at 87% 63%, rgba(255,255,255,.45) 0%,transparent 100%),
            radial-gradient(1px 1px at 54% 88%, rgba(255,255,255,.3) 0%,transparent 100%),
            radial-gradient(2px 2px at 92% 35%, rgba(245,158,11,.5) 0%,transparent 100%),
            radial-gradient(1px 1px at 5%  90%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1px 1px at 70% 50%, rgba(255,255,255,.25) 0%,transparent 100%);
          animation: suTwinkle 5s ease-in-out infinite alternate;
        }
        @keyframes suTwinkle { from{opacity:.55} to{opacity:1} }

        /* card */
        .su-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 500px;
          background: rgba(13,11,26,0.97);
          border: 1px solid rgba(245,158,11,0.22);
          border-radius: 28px;
          padding: 40px 44px 36px;
          box-shadow: 0 0 80px rgba(245,158,11,0.08), 0 24px 60px rgba(0,0,0,0.5);
          animation: suCardIn .6s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes suCardIn {
          from { opacity:0; transform: translateY(28px) scale(.96); }
          to   { opacity:1; transform: translateY(0)    scale(1);   }
        }

        /* gold top border */
        .su-card::before {
          content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:55%; height:2px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
          border-radius:0 0 4px 4px;
        }

        /* header */
        .su-header { text-align:center; margin-bottom:28px; }
        .su-moon-icon {
          display:inline-flex; align-items:center; justify-content:center;
          width:52px; height:52px; border-radius:16px; margin-bottom:14px;
          background: linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.06));
          border:1px solid rgba(245,158,11,0.3);
          color:#f59e0b;
          box-shadow: 0 0 20px rgba(245,158,11,0.2);
        }
        .su-title {
          font-family:'Cinzel',serif; font-size:1.55rem; font-weight:900;
          color:#f59e0b; letter-spacing:2px; margin:0 0 4px;
          text-shadow:0 0 28px rgba(245,158,11,0.4);
        }
        .su-sub {
          font-size:.7rem; letter-spacing:4px; text-transform:uppercase;
          color:#0d9488; font-weight:700; opacity:.9;
        }

        /* divider */
        .su-divider {
          height:1px; margin:0 0 24px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.2),transparent);
        }

        /* form heading */
        .su-form-title {
          font-family:'Cinzel',serif; font-size:1.1rem; font-weight:600;
          color:#f0ece4; letter-spacing:1px; margin:0 0 4px;
        }
        .su-form-sub {
          font-size:.82rem; color:#8b8298; margin:0 0 22px;
        }

        /* error */
        .su-error {
          background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.28);
          color:#fca5a5; border-radius:12px; padding:11px 15px;
          font-size:.84rem; margin-bottom:18px;
          display:flex; align-items:center; gap:8px;
          animation: suShake .4s ease;
        }
        @keyframes suShake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}
        }

        /* field */
        .su-field { margin-bottom:16px; }
        .su-label {
          display:block; font-size:.72rem; font-weight:800;
          letter-spacing:2px; text-transform:uppercase;
          color:#8b8298; margin-bottom:7px;
        }

        /* input wrapper */
        .su-inp-wrap {
          position:relative; display:flex; align-items:center;
        }
        .su-inp-icon {
          position:absolute; left:14px; color:#8b8298;
          display:flex; align-items:center; pointer-events:none;
          transition: color .25s;
        }
        .su-inp-wrap:focus-within .su-inp-icon { color:#f59e0b; }

        .su-inp {
          width:100%; padding:13px 44px 13px 42px;
          background:rgba(0,0,0,0.45); border:1px solid rgba(245,158,11,0.18);
          border-radius:13px; color:#f0ece4;
          font-family:'Nunito',sans-serif; font-size:.92rem;
          outline:none; transition:border-color .25s, box-shadow .25s;
          box-sizing:border-box;
        }
        .su-inp:focus {
          border-color:#f59e0b;
          box-shadow:0 0 0 3px rgba(245,158,11,0.1), 0 0 16px rgba(245,158,11,0.08);
        }
        .su-inp::placeholder { color:rgba(139,130,152,0.6); }

        /* eye toggle */
        .su-eye {
          position:absolute; right:13px;
          background:none; border:none; cursor:pointer;
          color:#8b8298; padding:4px;
          display:flex; align-items:center;
          transition:color .2s;
        }
        .su-eye:hover { color:#f59e0b; }

        /* strength bar */
        .su-strength-wrap {
          margin-top:8px; display:flex; align-items:center; gap:10px;
        }
        .su-strength-track {
          flex:1; height:4px; background:rgba(255,255,255,0.07);
          border-radius:4px; overflow:hidden;
        }
        .su-strength-fill {
          height:100%; border-radius:4px;
          transition:width .4s ease, background .4s ease;
        }
        .su-strength-lbl {
          font-size:.7rem; font-weight:700; letter-spacing:1px; min-width:44px;
        }

        /* match hints */
        .su-match-ok  { font-size:.76rem; color:#10b981; margin-top:6px; display:flex; align-items:center; gap:5px; }
        .su-match-err { font-size:.76rem; color:#f43f5e; margin-top:6px; }

        /* submit btn */
        .su-btn {
          width:100%; margin-top:6px;
          padding:15px;
          background:linear-gradient(135deg,#d97706,#f59e0b);
          border:none; border-radius:14px;
          font-family:'Cinzel',serif; font-size:.88rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase;
          color:#06040f; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 4px 18px rgba(245,158,11,0.3);
          transition:all .25s;
        }
        .su-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 8px 28px rgba(245,158,11,0.45);
        }
        .su-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }

        /* switch row */
        .su-switch {
          text-align:center; margin-top:22px;
          font-size:.84rem; color:#8b8298;
        }
        .su-switch a {
          color:#f59e0b; font-weight:700; text-decoration:none;
          margin-left:6px; transition:opacity .2s;
        }
        .su-switch a:hover { opacity:.75; }

        /* arabic footer */
        .su-arabic {
          text-align:center; margin-top:20px;
          font-family:'Scheherazade New',serif;
          font-size:1.4rem; color:rgba(245,158,11,0.25);
          letter-spacing:2px;
        }

        /* decorative stars top */
        .su-deco-stars {
          position:absolute; top:18px; right:20px;
          display:flex; gap:5px; opacity:.35;
          color:#f59e0b;
        }

        /* responsive */
        @media(max-width:540px) {
          .su-card { padding:30px 22px 28px; border-radius:20px; }
          .su-title { font-size:1.3rem; }
        }
      `}</style>

      <div className="su-root">
        <div className="su-stars"/>

        <div className="su-card">

          {/* Deco stars top-right */}
          <div className="su-deco-stars">
            <IconStar/><IconStar/><IconStar/>
          </div>

          {/* Header */}
          <div className="su-header">
            <div className="su-moon-icon"><IconMoon/></div>
            {/* <h1 className="su-title"></h1> */}
            <p className="su-sub">Ramadan Legacy 1447</p>
          </div>

          <div className="su-divider"/>

          <h2 className="su-form-title">Begin Your Journey</h2>
          <p className="su-form-sub">Create your Ramadan sanctuary</p>

          {/* Error */}
          {error && (
            <div className="su-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="su-field">
              <label className="su-label">Your Name</label>
              <div className="su-inp-wrap">
                <span className="su-inp-icon"><IconUser/></span>
                <input className="su-inp" type="text" name="displayName"
                  placeholder="e.g. Moon" value={form.displayName}
                  onChange={handleChange} required autoComplete="name"/>
              </div>
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email Address</label>
              <div className="su-inp-wrap">
                <span className="su-inp-icon"><IconMail/></span>
                <input className="su-inp" type="email" name="email"
                  placeholder="your@email.com" value={form.email}
                  onChange={handleChange} required autoComplete="email"/>
              </div>
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-inp-wrap">
                <span className="su-inp-icon"><IconLock/></span>
                <input className="su-inp" type={showPw ? "text" : "password"}
                  name="password" placeholder="Minimum 6 characters"
                  value={form.password} onChange={handleChange}
                  required autoComplete="new-password"/>
                <button type="button" className="su-eye" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <IconEyeOff/> : <IconEye/>}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="su-strength-wrap">
                  <div className="su-strength-track">
                    <div className="su-strength-fill"
                      style={{ width:`${strength.pct}%`, background:strength.color }}/>
                  </div>
                  <span className="su-strength-lbl" style={{ color:strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="su-field">
              <label className="su-label">Confirm Password</label>
              <div className="su-inp-wrap">
                <span className="su-inp-icon"><IconLock/></span>
                <input className="su-inp" type={showCf ? "text" : "password"}
                  name="confirm" placeholder="Re-enter password"
                  value={form.confirm} onChange={handleChange}
                  required autoComplete="new-password"
                  style={{ borderColor: pwNoMatch ? "rgba(244,63,94,0.5)" : pwMatch ? "rgba(16,185,129,0.5)" : "" }}/>
                <button type="button" className="su-eye" onClick={() => setShowCf(s => !s)}>
                  {showCf ? <IconEyeOff/> : <IconEye/>}
                </button>
              </div>
              {pwMatch   && <p className="su-match-ok"><IconCheck/> Passwords match</p>}
              {pwNoMatch && <p className="su-match-err">Passwords don't match</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="su-btn" disabled={loading}>
              {loading ? <IconLoader/> : null}
              {loading ? "Creating account..." : (
                <><span>Create Account</span><IconArrow/></>
              )}
            </button>
          </form>

          {/* Switch */}
          <div className="su-switch">
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>

          {/* Arabic footer */}
          <div className="su-arabic">رَمَضَان مُبَارَك</div>
        </div>
      </div>
    </>
  );
}