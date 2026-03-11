// src/components/Sidebar.jsx
import { useAuth } from "../context/AuthContext";

// ── SVG Icons for nav items ──
const Icons = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  tracker: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  quran: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  journal: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  tasbih: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ashra: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  meals: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  ),
  community: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  duas: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  qadr: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const NAV = [
  { section: "Core OS", items: [
    { id:"home",      icon:"home",      label:"Dashboard" },
    { id:"calendar",  icon:"calendar",  label:"30-Day Calendar" },
    { id:"tracker",   icon:"tracker",   label:"Prayer Tracker" },
    { id:"quran",     icon:"quran",     label:"Quran Progress" },
  ]},
  { section: "Soul & Heart", items: [
    { id:"journal",   icon:"journal",   label:"Gratitude Journal" },
    { id:"tasbih",    icon:"tasbih",    label:"Digital Tasbih" },
    { id:"ashra",     icon:"ashra",     label:"Three Ashras" },
  ]},
  { section: "Life & Prep", items: [
    { id:"meals",     icon:"meals",     label:"Meal Planner" },
    // { id:"community", icon:"community", label:"Community Hub" },
    { id:"duas",      icon:"duas",      label:"Sehri & Iftar Duas" },
    { id:"qadr",      icon:"qadr",      label:"Laylatul Qadr" },
  ]},
];

export default function Sidebar({ activeView, setActiveView, isOpen, theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const initial     = (user?.displayName || user?.email || "K")[0].toUpperCase();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const isDark      = theme === "dark";

  return (
    <>
      <style>{`
        /* ── SIDEBAR BASE ── */
        .sb {
          width: 268px; min-width: 268px;
          height: 100vh;
          display: flex; flex-direction: column;
          padding: 22px 12px 18px;
          overflow-y: auto; overflow-x: hidden;
          position: relative; z-index: 20;
          flex-shrink: 0;
          transition: transform .4s cubic-bezier(.4,0,.2,1), background .3s, border-color .3s;
          border-right: 1px solid var(--sb-border);
          background: var(--sb-bg);
        }

        /* ── DARK THEME VARS ── */
        .sb.dark {
          --sb-bg:          rgba(7,5,16,0.98);
          --sb-border:      rgba(245,158,11,0.18);
          --sb-logo-color:  #f59e0b;
          --sb-logo-glow:   rgba(245,158,11,0.5);
          --sb-sub:         rgba(245,158,11,0.4);
          --sb-section:     rgba(245,158,11,0.55);
          --sb-btn-color:   rgba(240,236,228,0.55);
          --sb-btn-hover-bg:rgba(255,255,255,0.05);
          --sb-btn-hover-c: #f0ece4;
          --sb-active-bg:   linear-gradient(135deg,rgba(245,158,11,0.14),rgba(245,158,11,0.04));
          --sb-active-border:rgba(245,158,11,0.35);
          --sb-active-color:#fbbf24;
          --sb-chip-bg:     rgba(255,255,255,0.04);
          --sb-chip-border: rgba(245,158,11,0.18);
          --sb-avatar-from: #d97706;
          --sb-avatar-to:   #f59e0b;
          --sb-avatar-text: #06040f;
          --sb-name-color:  #f0ece4;
          --sb-email-color: rgba(240,236,228,0.45);
          --sb-logout-bg:   rgba(244,63,94,0.1);
          --sb-logout-border:rgba(244,63,94,0.28);
          --sb-logout-color:#fda4af;
          --sb-toggle-bg:   rgba(245,158,11,0.1);
          --sb-toggle-border:rgba(245,158,11,0.25);
          --sb-toggle-color:#f59e0b;
          --sb-top-glow:    radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 65%);
        }

        /* ── LIGHT THEME VARS ── */
        .sb.light {
          --sb-bg:           rgba(255,252,245,0.99);
          --sb-border:       rgba(180,130,0,0.18);
          --sb-logo-color:   #b45309;
          --sb-logo-glow:    rgba(180,100,0,0.3);
          --sb-sub:          rgba(120,80,0,0.5);
          --sb-section:      rgba(120,80,0,0.6);
          --sb-btn-color:    rgba(60,40,0,0.6);
          --sb-btn-hover-bg: rgba(180,100,0,0.07);
          --sb-btn-hover-c:  #78350f;
          --sb-active-bg:    linear-gradient(135deg,rgba(180,100,0,0.12),rgba(180,100,0,0.04));
          --sb-active-border:rgba(180,100,0,0.35);
          --sb-active-color: #92400e;
          --sb-chip-bg:      rgba(180,100,0,0.06);
          --sb-chip-border:  rgba(180,100,0,0.18);
          --sb-avatar-from:  #d97706;
          --sb-avatar-to:    #f59e0b;
          --sb-avatar-text:  #fff;
          --sb-name-color:   #1c1409;
          --sb-email-color:  rgba(60,40,0,0.5);
          --sb-logout-bg:    rgba(220,38,38,0.07);
          --sb-logout-border:rgba(220,38,38,0.22);
          --sb-logout-color: #b91c1c;
          --sb-toggle-bg:    rgba(180,100,0,0.08);
          --sb-toggle-border:rgba(180,100,0,0.22);
          --sb-toggle-color: #92400e;
          --sb-top-glow:     radial-gradient(ellipse at 50% 0%, rgba(180,100,0,0.06) 0%, transparent 60%);
        }

        /* top glow */
        .sb::after {
          content:''; position:absolute; top:0; left:0; right:0; height:180px;
          background: var(--sb-top-glow); pointer-events:none;
        }

        /* ── LOGO ── */
        .sb-logo { text-align:center; padding:8px 0 20px; }
        .sb-logo-arabic {
          font-family:'Scheherazade New',serif;
          font-size:2.6rem; line-height:1;
          color: var(--sb-logo-color);
          text-shadow: 0 0 24px var(--sb-logo-glow);
          transition: color .3s;
        }
        .sb-logo-sub {
          font-size:.56rem; letter-spacing:4px;
          text-transform:uppercase;
          color: var(--sb-sub);
          margin-top:3px; transition: color .3s;
        }

        /* ── DIVIDER ── */
        .sb-divider {
          height:1px; margin:4px 0;
          background: linear-gradient(90deg,transparent,var(--sb-border),transparent);
          transition: background .3s;
        }

        /* ── SECTION LABEL ── */
        .sb-section-lbl {
          font-size:.55rem; letter-spacing:3px;
          text-transform:uppercase; font-weight:800;
          color: var(--sb-section);
          padding: 16px 12px 5px;
          transition: color .3s;
        }

        /* ── NAV BUTTON ── */
        .sb-btn {
          display:flex; align-items:center; gap:11px;
          padding:10px 13px; border-radius:13px;
          border:1px solid transparent;
          background:transparent;
          color: var(--sb-btn-color);
          cursor:pointer; width:100%; text-align:left;
          font-size:.87rem; font-family:'Nunito',sans-serif;
          font-weight:600; margin-bottom:2px;
          transition: all .22s;
        }
        .sb-btn:hover {
          background: var(--sb-btn-hover-bg);
          color: var(--sb-btn-hover-c);
          transform: translateX(4px);
        }
        .sb-btn.active {
          background: var(--sb-active-bg);
          border-color: var(--sb-active-border);
          color: var(--sb-active-color);
          font-weight:700;
          box-shadow: inset 0 0 16px rgba(245,158,11,0.04);
        }
        .sb-btn-icon {
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px; border-radius:9px; flex-shrink:0;
          background: rgba(245,158,11,0.06);
          transition: background .22s;
        }
        .sb-btn.active .sb-btn-icon {
          background: rgba(245,158,11,0.14);
        }
        .sb-btn:hover .sb-btn-icon {
          background: rgba(245,158,11,0.1);
        }

        /* ── THEME TOGGLE ── */
        .sb-theme-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 14px; border-radius:14px; margin:10px 0 4px;
          background: var(--sb-toggle-bg);
          border:1px solid var(--sb-toggle-border);
          transition: all .3s;
        }
        .sb-theme-label {
          font-size:.75rem; font-weight:700;
          letter-spacing:1px; text-transform:uppercase;
          color: var(--sb-toggle-color);
          display:flex; align-items:center; gap:7px;
        }
        .sb-toggle-track {
          width:42px; height:23px; border-radius:20px;
          background: ${isDark ? 'rgba(245,158,11,0.25)' : 'rgba(180,100,0,0.15)'};
          border:1px solid var(--sb-toggle-border);
          position:relative; cursor:pointer;
          transition:all .3s; flex-shrink:0;
        }
        .sb-toggle-thumb {
          position:absolute; top:3px;
          left:${isDark ? '21px' : '3px'};
          width:15px; height:15px; border-radius:50%;
          background: var(--sb-toggle-color);
          transition: left .3s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        /* ── USER FOOTER ── */
        .sb-footer { margin-top:auto; padding-top:14px; border-top:1px solid var(--sb-chip-border); }
        .sb-user-chip {
          display:flex; align-items:center; gap:10px;
          padding:11px 13px; border-radius:13px;
          background: var(--sb-chip-bg);
          border:1px solid var(--sb-chip-border);
          margin-bottom:8px; transition:all .3s;
        }
        .sb-avatar {
          width:35px; height:35px; border-radius:10px; flex-shrink:0;
          background: linear-gradient(135deg,var(--sb-avatar-from),var(--sb-avatar-to));
          display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:.95rem;
          color: var(--sb-avatar-text);
        }
        .sb-user-name  { font-size:.84rem; font-weight:700; color:var(--sb-name-color); transition:color .3s; }
        .sb-user-email {
          font-size:.67rem; color:var(--sb-email-color);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px;
          transition:color .3s;
        }
        .sb-logout {
          width:100%; padding:10px; border-radius:12px;
          background:var(--sb-logout-bg); border:1px solid var(--sb-logout-border);
          color:var(--sb-logout-color); cursor:pointer;
          font-size:.82rem; font-family:'Nunito',sans-serif; font-weight:700;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all .25s;
        }
        .sb-logout:hover { opacity:.8; transform:translateY(-1px); }

        /* ── MOBILE ── */
        @media(max-width:900px){
          .sb {
            position:fixed; top:0; left:0; height:100vh;
            transform:translateX(-100%); z-index:200;
            box-shadow:4px 0 28px rgba(0,0,0,0.6);
          }
          .sb.open { transform:translateX(0); }
        }
      `}</style>

      <nav className={`sb ${isDark ? "dark" : "light"}${isOpen ? " open" : ""}`}>

        {/* ── Logo ── */}
        <div className="sb-logo">
          <div className="sb-logo-arabic">رَمَضَان</div>
          <div className="sb-logo-sub">Legacy 1447</div>
        </div>

        <div className="sb-divider"/>

        {/* ── Nav Groups ── */}
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sb-section-lbl">{group.section}</div>
            {group.items.map(item => (
              <button key={item.id}
                className={`sb-btn${activeView === item.id ? " active" : ""}`}
                onClick={() => setActiveView(item.id)}>
                <span className="sb-btn-icon">
                  {Icons[item.icon]}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {/* ── Theme Toggle ── */}
        <div className="sb-theme-row">
          <div className="sb-theme-label">
            {isDark ? Icons.moon : Icons.sun}
            {isDark ? "Dark Mode" : "Light Mode"}
          </div>
          <div className="sb-toggle-track" onClick={toggleTheme}>
            <div className="sb-toggle-thumb"/>
          </div>
        </div>

        {/* ── User Footer ── */}
        <div className="sb-footer">
          <div className="sb-user-chip">
            <div className="sb-avatar">{initial}</div>
            <div style={{ overflow:"hidden" }}>
              <div className="sb-user-name">{displayName}</div>
              <div className="sb-user-email">{user?.email}</div>
            </div>
          </div>
          <button className="sb-logout" onClick={logout}>
            {Icons.logout}
            Sign Out
          </button>
        </div>

      </nav>
    </>
  );
}