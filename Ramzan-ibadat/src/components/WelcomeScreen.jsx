// src/components/WelcomeScreen.jsx
import { useState, useEffect } from "react";

export default function WelcomeScreen({ onEnter }) {
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState(0);
  // phase 0=hidden | 1=bismillah | 2=moon | 3=title | 4=button

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const fadeIn = (show) => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px) scale(1)" : "translateY(18px) scale(0.94)",
    transition: "all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 35%, #14091f 0%, #0a0612 50%, #030208 100%)",
      overflow: "hidden",
    }}>

      {/* ── STAR LAYERS ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Layer 1 slow */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            radial-gradient(1px 1px at 4%   8%,  rgba(255,255,255,.9)  0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 14% 5%,  rgba(245,158,11,.95) 0%,transparent 100%),
            radial-gradient(1px 1px at 26%  12%, rgba(255,255,255,.65) 0%,transparent 100%),
            radial-gradient(2px   2px   at 38% 4%,  rgba(251,191,36,.8)  0%,transparent 100%),
            radial-gradient(1px 1px at 52%  9%,  rgba(255,255,255,.7)  0%,transparent 100%),
            radial-gradient(1px 1px at 67%  6%,  rgba(245,158,11,.75)  0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 11%, rgba(255,255,255,.6) 0%,transparent 100%),
            radial-gradient(1px 1px at 91%  7%,  rgba(251,191,36,.65)  0%,transparent 100%),
            radial-gradient(1px 1px at 8%   28%, rgba(255,255,255,.5)  0%,transparent 100%),
            radial-gradient(1px 1px at 20%  38%, rgba(245,158,11,.6)   0%,transparent 100%),
            radial-gradient(1px 1px at 44%  32%, rgba(255,255,255,.45) 0%,transparent 100%),
            radial-gradient(1px 1px at 60%  42%, rgba(255,255,255,.5)  0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 75% 35%, rgba(245,158,11,.5) 0%,transparent 100%),
            radial-gradient(1px 1px at 88%  40%, rgba(255,255,255,.4)  0%,transparent 100%),
            radial-gradient(1px 1px at 5%   58%, rgba(255,255,255,.4)  0%,transparent 100%),
            radial-gradient(1px 1px at 33%  65%, rgba(251,191,36,.5)   0%,transparent 100%),
            radial-gradient(1px 1px at 55%  70%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1px 1px at 78%  62%, rgba(245,158,11,.45)  0%,transparent 100%),
            radial-gradient(1px 1px at 95%  68%, rgba(255,255,255,.4)  0%,transparent 100%),
            radial-gradient(1px 1px at 18%  82%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(2px   2px   at 42% 88%, rgba(251,191,36,.4)  0%,transparent 100%),
            radial-gradient(1px 1px at 65%  85%, rgba(255,255,255,.3)  0%,transparent 100%),
            radial-gradient(1px 1px at 85%  90%, rgba(245,158,11,.35)  0%,transparent 100%)
          `,
          animation: "stars1 5s ease-in-out infinite alternate",
        }}/>

        {/* Layer 2 fast offset */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            radial-gradient(1px 1px at 10%  18%, rgba(255,255,255,.7)  0%,transparent 100%),
            radial-gradient(1px 1px at 30%  22%, rgba(245,158,11,.65)  0%,transparent 100%),
            radial-gradient(1px 1px at 50%  16%, rgba(255,255,255,.55) 0%,transparent 100%),
            radial-gradient(1px 1px at 70%  24%, rgba(251,191,36,.6)   0%,transparent 100%),
            radial-gradient(1px 1px at 90%  19%, rgba(255,255,255,.5)  0%,transparent 100%),
            radial-gradient(1px 1px at 15%  48%, rgba(245,158,11,.45)  0%,transparent 100%),
            radial-gradient(1px 1px at 48%  52%, rgba(255,255,255,.4)  0%,transparent 100%),
            radial-gradient(1px 1px at 72%  46%, rgba(251,191,36,.45)  0%,transparent 100%),
            radial-gradient(1px 1px at 25%  75%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1px 1px at 58%  78%, rgba(245,158,11,.4)   0%,transparent 100%),
            radial-gradient(1px 1px at 82%  80%, rgba(255,255,255,.3)  0%,transparent 100%)
          `,
          animation: "stars2 3.5s ease-in-out infinite alternate",
        }}/>

        {/* Warm golden nebula */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 45% 30% at 15% 25%, rgba(245,158,11,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 35% 25% at 85% 20%, rgba(217,119,6,0.06)  0%, transparent 55%),
            radial-gradient(ellipse 55% 35% at 50% 88%, rgba(245,158,11,0.05) 0%, transparent 60%)
          `,
        }}/>
      </div>

      {/* ── SHOOTING STARS ── */}
      <div style={{
        position: "absolute", top: "18%", left: "-5%",
        width: 130, height: 1.5,
        background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.9), transparent)",
        borderRadius: 2,
        animation: "shootingStar 7s ease-in-out infinite",
        animationDelay: "1.5s",
      }}/>
      <div style={{
        position: "absolute", top: "42%", left: "-5%",
        width: 90, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)",
        borderRadius: 2,
        animation: "shootingStar 7s ease-in-out infinite",
        animationDelay: "4.5s",
      }}/>
      <div style={{
        position: "absolute", top: "68%", left: "-5%",
        width: 110, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)",
        borderRadius: 2,
        animation: "shootingStar 7s ease-in-out infinite",
        animationDelay: "7s",
      }}/>

      {/* ── FLOATING GOLD PARTICLES ── */}
      {[
        { x:"7%",  y:"28%", s:3,   d:0    },
        { x:"16%", y:"58%", s:2,   d:0.8  },
        { x:"83%", y:"22%", s:2.5, d:1.2  },
        { x:"91%", y:"52%", s:2,   d:0.4  },
        { x:"22%", y:"78%", s:2,   d:1.6  },
        { x:"76%", y:"74%", s:2.5, d:0.6  },
        { x:"48%", y:"91%", s:2,   d:1.0  },
        { x:"62%", y:"14%", s:3,   d:1.8  },
        { x:"35%", y:"20%", s:1.5, d:2.2  },
        { x:"55%", y:"82%", s:1.5, d:0.3  },
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.x, top: p.y,
          width: p.s, height: p.s,
          borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(245,158,11,0.85)" : "rgba(251,191,36,0.65)",
          boxShadow: `0 0 ${p.s * 3}px rgba(245,158,11,0.8)`,
          animation: "particle 4s ease-in-out infinite alternate",
          animationDelay: `${p.d}s`,
        }}/>
      ))}

      {/* ── MAIN ARCH ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        animation: phase >= 1 ? "archFloat 7s ease-in-out infinite" : "none",
        ...fadeIn(phase >= 1),
      }}>
        <div style={{ position: "relative" }}>

          <svg viewBox="0 0 340 530" width="420" height="580"
            style={{
              filter: "drop-shadow(0 0 35px rgba(245,158,11,0.4)) drop-shadow(0 0 70px rgba(245,158,11,0.15))",
            }}
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#fbbf24" stopOpacity=".95"/>
                <stop offset="45%"  stopColor="#f59e0b" stopOpacity=".85"/>
                <stop offset="100%" stopColor="#b45309" stopOpacity=".5"/>
              </linearGradient>
              <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0d0a1e" stopOpacity=".98"/>
                <stop offset="100%" stopColor="#050310" stopOpacity=".98"/>
              </linearGradient>
              <linearGradient id="hl" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="transparent"/>
                <stop offset="50%"  stopColor="#f59e0b" stopOpacity=".6"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="b"/>
                <feComposite in="SourceGraphic" in2="b" operator="over"/>
              </filter>
              <filter id="sg">
                <feGaussianBlur stdDeviation="1.5" result="b"/>
                <feComposite in="SourceGraphic" in2="b" operator="over"/>
              </filter>
            </defs>

            {/* Fill */}
            <path d="M28 525 L28 198 Q28 38 170 26 Q312 38 312 198 L312 525 Z" fill="url(#bg2)"/>
            {/* Outer border */}
            <path d="M28 525 L28 198 Q28 38 170 26 Q312 38 312 198 L312 525 Z"
              fill="none" stroke="url(#ag)" strokeWidth="2.5" filter="url(#glow)"/>
            {/* Inner line 1 */}
            <path d="M50 520 L50 206 Q50 65 170 54 Q290 65 290 206 L290 520"
              fill="none" stroke="rgba(245,158,11,.14)" strokeWidth="1"/>
            {/* Inner line 2 */}
            <path d="M66 518 L66 212 Q66 85 170 75 Q274 85 274 212 L274 518"
              fill="none" stroke="rgba(245,158,11,.07)" strokeWidth="1"/>
            {/* Top arch curve */}
            <path d="M108 200 Q170 155 232 200"
              fill="none" stroke="rgba(245,158,11,.22)" strokeWidth="1.5"/>

            {/* Top ornament lines */}
            <line x1="118" y1="42" x2="118" y2="12" stroke="rgba(245,158,11,.5)"  strokeWidth="1"/>
            <line x1="170" y1="26" x2="170" y2="2"  stroke="rgba(251,191,36,.85)" strokeWidth="1.5" filter="url(#sg)"/>
            <line x1="222" y1="42" x2="222" y2="12" stroke="rgba(245,158,11,.5)"  strokeWidth="1"/>
            <line x1="112" y1="24" x2="128" y2="24" stroke="rgba(245,158,11,.35)" strokeWidth="1"/>
            <line x1="212" y1="24" x2="228" y2="24" stroke="rgba(245,158,11,.35)" strokeWidth="1"/>

            {/* Top star */}
            <polygon points="170,1 173,8 180,8 175,13 177,20 170,16 163,20 165,13 160,8 167,8"
              fill="rgba(251,191,36,.95)" filter="url(#glow)"/>

            {/* Side accent bars */}
            <rect x="18"  y="190" width="10" height="50" rx="3" fill="rgba(245,158,11,.28)"/>
            <rect x="312" y="190" width="10" height="50" rx="3" fill="rgba(245,158,11,.28)"/>
            <circle cx="28"  cy="190" r="5" fill="rgba(251,191,36,.7)" filter="url(#sg)"/>
            <circle cx="312" cy="190" r="5" fill="rgba(251,191,36,.7)" filter="url(#sg)"/>

            {/* Base */}
            <rect x="28" y="518" width="284" height="4" rx="2" fill="url(#ag)" opacity=".6"/>
            <line x1="28" y1="525" x2="312" y2="525" stroke="url(#hl)" strokeWidth="1"/>

            {/* Bottom ornament */}
            <circle cx="170" cy="450" r="32" fill="none" stroke="rgba(245,158,11,.1)"  strokeWidth="1"/>
            <circle cx="170" cy="450" r="20" fill="none" stroke="rgba(245,158,11,.07)" strokeWidth="1"/>
            <circle cx="170" cy="450" r="5"  fill="rgba(245,158,11,.15)"/>
            <polygon points="170,425 184,450 170,475 156,450"
              fill="none" stroke="rgba(245,158,11,.09)" strokeWidth="1"/>
          </svg>

          {/* ── CONTENT INSIDE ARCH ── */}
          <div style={{
            position: "absolute", top: 54, left: "50%",
            transform: "translateX(-50%)",
            width: 330,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
          }}>

            {/* Bismillah */}
            <div style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "1.75rem", color: "#fbbf24",
              textShadow: "0 0 25px rgba(245,158,11,.8), 0 0 50px rgba(245,158,11,.3)",
              lineHeight: 1.6, marginBottom: 6,
              ...fadeIn(phase >= 1),
            }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
            </div>

            {/* Moon emoji */}
            <div style={{
              fontSize: "5rem", margin: "8px 0 6px",
              animation: phase >= 2 ? "moonPulse 3s ease-in-out infinite alternate" : "none",
              ...fadeIn(phase >= 2),
            }}>🌙</div>

            {/* MOON gradient text */}
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "3.2rem", fontWeight: 900,
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #fde68a 70%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: 8,
              filter: "drop-shadow(0 0 18px rgba(245,158,11,0.7))",
              lineHeight: 1, marginBottom: 6,
              ...fadeIn(phase >= 3),
            }}>MOON</div>

            {/* Subtitles */}
            <div style={{
              fontSize: ".72rem", letterSpacing: 5,
              textTransform: "uppercase",
              color: "#0d9488", fontWeight: 700,
              marginBottom: 2,
              ...fadeIn(phase >= 3),
            }}>Ramadan 1447</div>

            <div style={{
              fontSize: ".58rem", letterSpacing: 3,
              color: "rgba(245,158,11,0.4)",
              textTransform: "uppercase", marginBottom: 14,
              ...fadeIn(phase >= 3),
            }}>Legacy OS · Blessed Space</div>

            {/* Divider */}
            <div style={{
              width: "65%", height: 1,
              background: "linear-gradient(90deg,transparent,rgba(245,158,11,.4),transparent)",
              marginBottom: 18,
              ...fadeIn(phase >= 3),
            }}/>

            {/* Button */}
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={onEnter}
              style={{
                padding: "15px 44px",
                background: hovered
                  ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                  : "linear-gradient(135deg,#d97706,#f59e0b)",
                border: "1px solid rgba(251,191,36,0.5)",
                borderRadius: "50px",
                fontFamily: "'Cinzel', serif",
                fontSize: ".85rem", fontWeight: 700,
                letterSpacing: 3, textTransform: "uppercase",
                color: "#0a0612", cursor: "pointer",
                boxShadow: hovered
                  ? "0 0 55px rgba(245,158,11,.75), 0 8px 24px rgba(0,0,0,.5)"
                  : "0 0 28px rgba(245,158,11,.45), 0 6px 18px rgba(0,0,0,.4)",
                transform: hovered
                  ? "scale(1.07) translateY(-2px)"
                  : "scale(1) translateY(0)",
                transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
                animation: phase >= 4 ? "btnPulse 2.5s ease-in-out infinite" : "none",
                ...fadeIn(phase >= 4),
              }}>
              ✦ Enter Blessed Space ✦
            </button>

            {/* Hint */}
            <div style={{
              marginTop: 10, fontSize: ".58rem",
              color: "rgba(245,158,11,0.38)",
              letterSpacing: 3, textTransform: "uppercase",
              animation: phase >= 4 ? "hintBlink 3s ease-in-out infinite" : "none",
              ...fadeIn(phase >= 4),
            }}>Click to continue</div>
          </div>
        </div>
      </div>

      {/* ── CORNER DECORATIONS ── */}
      {[
        { top:24,    left:24,  borderTop:"1.5px solid rgba(245,158,11,.28)", borderLeft:"1.5px solid rgba(245,158,11,.28)",   borderRadius:"8px 0 0 0" },
        { top:24,    right:24, borderTop:"1.5px solid rgba(245,158,11,.28)", borderRight:"1.5px solid rgba(245,158,11,.28)",  borderRadius:"0 8px 0 0" },
        { bottom:24, left:24,  borderBottom:"1.5px solid rgba(245,158,11,.28)", borderLeft:"1.5px solid rgba(245,158,11,.28)", borderRadius:"0 0 0 8px" },
        { bottom:24, right:24, borderBottom:"1.5px solid rgba(245,158,11,.28)", borderRight:"1.5px solid rgba(245,158,11,.28)", borderRadius:"0 0 8px 0" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 52, height: 52,
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 1.2s ease 1s",
          ...s,
        }}/>
      ))}

      {/* Bottom glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 140,
        background: "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <style>{`
        @keyframes stars1 {
          from { opacity: .5; }
          to   { opacity: 1; }
        }
        @keyframes stars2 {
          from { opacity: .3; transform: scale(1); }
          to   { opacity: .9; transform: scale(1.01); }
        }
        @keyframes archFloat {
          0%,100% { transform: translateY(0px);  }
          50%     { transform: translateY(-13px); }
        }
        @keyframes moonPulse {
          from {
            filter: drop-shadow(0 0 18px rgba(245,158,11,.7));
            transform: scale(1);
          }
          to {
            filter: drop-shadow(0 0 42px rgba(251,191,36,1)) drop-shadow(0 0 70px rgba(245,158,11,.5));
            transform: scale(1.08);
          }
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 25px rgba(245,158,11,.42), 0 6px 18px rgba(0,0,0,.4); }
          50%     { box-shadow: 0 0 52px rgba(245,158,11,.78), 0 6px 18px rgba(0,0,0,.4); }
        }
        @keyframes particle {
          from { transform: translateY(0px)   translateX(0px);  opacity: .4; }
          to   { transform: translateY(-22px) translateX(8px);  opacity: 1;  }
        }
        @keyframes hintBlink {
          0%,100% { opacity: .35; }
          50%     { opacity: .8;  }
        }
        @keyframes shootingStar {
          0%   { transform: translateX(0)     translateY(0);   opacity: 0; }
          5%   { opacity: 1; }
          28%  { transform: translateX(110vw) translateY(22px); opacity: 0; }
          100% { transform: translateX(110vw) translateY(22px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}