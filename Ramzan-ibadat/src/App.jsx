// src/App.jsx
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import WelcomeScreen from "./components/WelcomeScreen";
import AuthPage      from "./components/AuthPage";
import Sidebar       from "./components/Sidebar";
import Dashboard     from "./views/Dashboard";
import Calendar      from "./views/Calendar";
import Tracker       from "./views/Tracker";
import QuranProgress from "./views/QuranProgress";
import Journal       from "./views/Journal";
import Tasbih        from "./views/Tasbih";
import Ashras        from "./views/Ashras";
import MealPlanner   from "./views/MealPlanner";
// import Community     from "./views/Community";
import Duas          from "./views/Duas";
import QadrPrep      from "./views/QadrPrep";
import "./styles/globals.css";

// ── THEME TOGGLE BUTTON (top-right, always visible) ──
function ThemeBtn({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      style={{
        position: "fixed", top: 14, right: 16, zIndex: 9999,
        width: 42, height: 42, borderRadius: 12,
        border: "1px solid rgba(245,158,11,0.3)",
        background: theme === "dark"
          ? "rgba(13,11,26,0.95)"
          : "rgba(255,248,230,0.97)",
        color: "#f59e0b",
        cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        transition: "all .3s",
        backdropFilter: "blur(10px)",
      }}
    >
      {theme === "dark" ? (
        // Sun icon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// ── VIEWS MAP ──
const VIEWS = {
  home:      <Dashboard/>,
  calendar:  <Calendar/>,
  tracker:   <Tracker/>,
  quran:     <QuranProgress/>,
  journal:   <Journal/>,
  tasbih:    <Tasbih/>,
  ashra:     <Ashras/>,
  meals:     <MealPlanner/>,
  duas:      <Duas/>,
  qadr:      <QadrPrep/>,
};

// ── INNER APP ──
function InnerApp({ theme, toggleTheme }) {
  const { user, loading } = useAuth();
  const [welcomed, setWelcomed]       = useState(false);
  const [activeView, setActiveView]   = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        height:"100vh",
        background: theme === "dark" ? "#06040f" : "#fdf8ef",
        transition: "background .35s",
      }}>
        <div style={{ textAlign:"center" }}>
          <div style={{
            fontFamily:"'Scheherazade New',serif", fontSize:"3rem",
            color:"#f59e0b", textShadow:"0 0 30px rgba(245,158,11,.5)",
            animation:"moonPulse 2s infinite alternate",
          }}>🌙</div>
          <div style={{
            marginTop:12, letterSpacing:3, fontSize:".75rem",
            textTransform:"uppercase",
            color: theme === "dark" ? "rgba(240,236,228,0.5)" : "rgba(60,40,0,0.5)",
          }}>Loading...</div>
        </div>
        <style>{`@keyframes moonPulse{from{opacity:.5}to{opacity:1}}`}</style>
      </div>
    );
  }

  // Step 1 — Welcome
  if (!welcomed) return <WelcomeScreen onEnter={() => setWelcomed(true)} theme={theme}/>;

  // Step 2 — Auth
  if (!user) return <AuthPage theme={theme}/>;

  // Step 3 — Main App
  return (
    <div className={`app-shell ${theme}`}>
      <div className="app-bg"><div className="star-field"/></div>

      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(s => !s)}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <Sidebar
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
            zIndex:150, backdropFilter:"blur(2px)" }}/>
      )}

      <main className="main-content" key={activeView}>
        {VIEWS[activeView] || <Dashboard/>}
      </main>
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ramadan-theme") || "dark"
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ramadan-theme", next);
  };

  // Apply theme class to body too (for global bg color)
  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    document.body.classList.toggle("dark",  theme === "dark");
  }, [theme]);

  return (
    <div className={theme}>
      {/* Theme toggle — always visible on every screen */}
      <ThemeBtn theme={theme} toggleTheme={toggleTheme}/>

      <AuthProvider>
        <InnerApp theme={theme} toggleTheme={toggleTheme}/>
      </AuthProvider>
    </div>
  );
}