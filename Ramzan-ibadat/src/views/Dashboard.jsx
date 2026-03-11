// src/views/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// ── Prayer times for Karachi (approximate) ──
const PRAYER_TIMES = [
  { name:"Fajr",    time:"05:12", icon:"🌄" },
  { name:"Sunrise", time:"06:38", icon:"☀️" },
  { name:"Dhuhr",   time:"12:30", icon:"🌤️" },
  { name:"Asr",     time:"16:05", icon:"🌇" },
  { name:"Maghrib", time:"18:42", icon:"🌅" },
  { name:"Isha",    time:"20:08", icon:"🌙" },
];

const GUIDANCE = {
  1:{type:"Quran",ar:"شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ",en:"The month of Ramadan in which the Quran was revealed."},
  2:{type:"Hadith",ar:"الصِّيَامُ جُنَّةٌ",en:"Fasting is a shield from hellfire and sins."},
  3:{type:"Quran",ar:"لَعَلَّكُمْ تَتَّقُونَ",en:"...so that you may become mindful of Allah."},
  4:{type:"Hadith",ar:"مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ",en:"Whoever fasts Ramadan with faith, his sins are forgiven."},
  5:{type:"Quran",ar:"وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",en:"When My servants ask about Me, I am near."},
  6:{type:"Hadith",ar:"تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً",en:"Take Suhoor, for in Suhoor there is blessing."},
  7:{type:"Quran",ar:"فَاذْكُرُونِي أَذْكُرْكُمْ",en:"Remember Me; I will remember you."},
  8:{type:"Hadith",ar:"أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا",en:"The most beloved deeds are the most consistent."},
  9:{type:"Quran",ar:"إِنَّ مَعَ الْعُسْرِ يُسْرًا",en:"Indeed, with hardship comes ease."},
  10:{type:"Hadith",ar:"لِلصَّائِمِ فَرْحَتَانِ",en:"The fasting person has two joys."},
  11:{type:"Quran",ar:"وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِنْ رَبِّكُمْ",en:"Hasten to forgiveness from your Lord."},
  12:{type:"Hadith",ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",en:"The best of you learn the Quran and teach it."},
  13:{type:"Quran",ar:"وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ",en:"Cooperate in righteousness and piety."},
  14:{type:"Hadith",ar:"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",en:"Actions are judged by intentions."},
  15:{type:"Quran",ar:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",en:"Indeed, Allah is with the patient."},
  16:{type:"Hadith",ar:"الدُّعَاءُ هُوَ الْعِبَادَةُ",en:"Dua is the essence of worship."},
  17:{type:"Quran",ar:"لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ",en:"If you are grateful, I will increase you."},
  18:{type:"Hadith",ar:"أَفْضَلُ الصَّدَقَةِ صَدَقَةٌ فِي رَمَضَانَ",en:"The best charity is given in Ramadan."},
  19:{type:"Quran",ar:"وَقُولُوا لِلنَّاسِ حُسْنًا",en:"Speak to people good words."},
  20:{type:"Hadith",ar:"اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",en:"Fear Allah wherever you are."},
  21:{type:"Quran",ar:"لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",en:"The Night of Decree is better than a thousand months."},
  22:{type:"Hadith",ar:"تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ",en:"Search for Laylatul Qadr in the odd nights."},
  23:{type:"Quran",ar:"رَبَّنَا تَقَبَّلْ مِنَّا",en:"Our Lord, accept from us."},
  24:{type:"Hadith",ar:"اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",en:"O Allah, You love forgiveness, so forgive me."},
  25:{type:"Quran",ar:"فَاسْتَبِقُوا الْخَيْرَاتِ",en:"Race to all that is good."},
  26:{type:"Hadith",ar:"الْبِرُّ حُسْنُ الْخُلُقِ",en:"Righteousness is good character."},
  27:{type:"Quran",ar:"وَمَا تَفْعَلُوا مِنْ خَيْرٍ يَعْلَمْهُ اللَّهُ",en:"Whatever good you do, Allah knows it."},
  28:{type:"Hadith",ar:"كُلُّ مَعْرُوفٍ صَدَقَةٌ",en:"Every good deed is a charity."},
  29:{type:"Quran",ar:"إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",en:"Allah does not waste the reward of the doers of good."},
  30:{type:"Hadith",ar:"اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ",en:"Protect yourself from the fire, even with half a date."},
};

// ── SVG Icons ──
const IcoPrayer   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoBook     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoStar     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoHeart    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoMoon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcoSun      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>;
const IcoCheck    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoTrend    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

function getNextPrayer() {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYER_TIMES) {
    const [h, m] = p.time.split(":").map(Number);
    if (h * 60 + m > cur) return p;
  }
  return PRAYER_TIMES[0];
}

function getCountdown(timeStr) {
  const now = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diff = Math.max(0, target - now);
  const hrs  = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

// ── Mood tracker — unique feature ──
const MOODS = [
  { emoji:"😌", label:"Peaceful" },
  { emoji:"🤲", label:"Grateful" },
  { emoji:"💪", label:"Strong" },
  { emoji:"😔", label:"Struggling" },
  { emoji:"✨", label:"Inspired" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Sister";

  const ramadanStart = new Date("2026-02-20");
  const today        = new Date();
  const dayNum       = Math.min(30, Math.max(1, Math.round((today - ramadanStart) / 86400000) + 1));
  const g            = GUIDANCE[dayNum] || GUIDANCE[1];

  const ashra = dayNum <= 10
    ? { label:"Mercy",       badge:"badge-green",  color:"#10b981", bg:"rgba(16,185,129,0.1)" }
    : dayNum <= 20
    ? { label:"Forgiveness", badge:"badge-indigo", color:"#6366f1", bg:"rgba(99,102,241,0.1)" }
    : { label:"Salvation",   badge:"badge-rose",   color:"#f43f5e", bg:"rgba(244,63,94,0.1)"  };

  const ramadanPct  = Math.round((dayNum / 30) * 100);
  const nextPrayer  = getNextPrayer();

  const [countdown, setCountdown] = useState(() => getCountdown(nextPrayer.time));
  const [mood, setMood]           = useState(() => localStorage.getItem("ramadan-mood-" + dayNum) || "");
  const [moodSaved, setMoodSaved] = useState(!!localStorage.getItem("ramadan-mood-" + dayNum));

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown(nextPrayer.time)), 1000);
    return () => clearInterval(t);
  }, [nextPrayer.time]);

  const saveMood = (m) => {
    setMood(m); setMoodSaved(true);
    localStorage.setItem("ramadan-mood-" + dayNum, m);
  };

  const greetingHour = today.getHours();
  const greeting = greetingHour < 12 ? "Sabah Al-Khayr" : greetingHour < 17 ? "Assalamu Alaikum" : "Masa Al-Khayr";

  return (
    <>
      <style>{`
        .db-root { width:100%; box-sizing:border-box; }

        /* ── Hero row ── */
        .db-hero {
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 20px;
          margin-bottom: 28px;
          padding: 28px 32px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%);
          border: 1px solid rgba(245,158,11,0.2);
          position: relative; overflow: hidden;
          animation: dbFadeUp .6s ease both;
        }
        .db-hero::before {
          content:''; position:absolute; top:-40px; right:-40px;
          width:200px; height:200px; border-radius:50%;
          background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
          pointer-events:none;
        }
        .db-greeting {
          font-size:.7rem; letter-spacing:4px; text-transform:uppercase;
          color: var(--teal); font-weight:700; margin-bottom:6px;
        }
        .db-name {
          font-family:'Cinzel',serif; font-size:2rem; font-weight:900;
          color:var(--gold); letter-spacing:1px;
          text-shadow:0 0 24px rgba(245,158,11,0.3);
        }
        .db-tagline { font-size:.88rem; color:var(--muted); margin-top:4px; }

        /* Day counter */
        .db-day-pill {
          text-align:center; padding:18px 28px; border-radius:20px;
          background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.22);
        }
        .db-day-num {
          font-family:'Cinzel',serif; font-size:3.8rem; font-weight:900;
          color:#f59e0b; line-height:1;
          text-shadow:0 0 30px rgba(245,158,11,0.5);
        }
        .db-day-lbl { font-size:.6rem; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-top:2px; }

        /* ── Section rows ── */
        .db-row { display:grid; gap:18px; margin-bottom:18px; }
        .db-row-2 { grid-template-columns:1fr 1fr; }
        .db-row-3 { grid-template-columns:1fr 1fr 1fr; }
        .db-row-4 { grid-template-columns:repeat(4,1fr); }

        /* ── Stat card ── */
        .db-stat {
          padding:20px 22px; border-radius:18px;
          border:1px solid var(--card-border);
          background:var(--card-bg);
          display:flex; flex-direction:column; gap:8px;
          position:relative; overflow:hidden;
          transition:transform .25s, box-shadow .25s;
          animation: dbFadeUp .6s ease both;
        }
        .db-stat:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(0,0,0,0.2); }
        .db-stat-icon {
          width:38px; height:38px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:4px;
        }
        .db-stat-val { font-family:'Cinzel',serif; font-size:1.8rem; font-weight:900; color:var(--gold); line-height:1; }
        .db-stat-lbl { font-size:.72rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); }
        .db-stat-sub { font-size:.78rem; color:var(--muted); }

        /* ── Progress bar ── */
        .db-prog-track {
          height:6px; border-radius:6px;
          background:rgba(255,255,255,0.08); overflow:hidden; margin-top:6px;
        }
        .db-prog-fill {
          height:100%; border-radius:6px;
          background:linear-gradient(90deg,#d97706,#f59e0b);
          transition:width 1.2s cubic-bezier(.4,0,.2,1);
        }

        /* ── Prayer countdown card ── */
        .db-prayer-card {
          padding:22px 24px; border-radius:18px;
          background:linear-gradient(135deg,rgba(13,148,136,0.1),rgba(13,148,136,0.03));
          border:1px solid rgba(13,148,136,0.25);
          animation: dbFadeUp .6s .1s ease both;
        }
        .db-countdown {
          font-family:'Cinzel',serif; font-size:2rem; font-weight:900;
          color:#5eead4; letter-spacing:4px;
          text-shadow:0 0 20px rgba(94,234,212,0.4);
        }
        .db-prayer-list { display:flex; flex-direction:column; gap:6px; margin-top:14px; }
        .db-prayer-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:8px 12px; border-radius:10px;
          font-size:.82rem; transition:background .2s;
        }
        .db-prayer-row.next-prayer {
          background:rgba(94,234,212,0.1); border:1px solid rgba(94,234,212,0.2);
        }
        .db-prayer-name { display:flex; align-items:center; gap:7px; font-weight:600; color:var(--text); }
        .db-prayer-time { color:var(--muted); font-size:.8rem; }

        /* ── Ayah card ── */
        .db-ayah {
          padding:26px 28px; border-radius:18px;
          background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.02));
          border:1px solid rgba(245,158,11,0.2);
          animation: dbFadeUp .6s .15s ease both;
        }
        .db-ayah-arabic {
          font-family:'Scheherazade New',serif;
          font-size:1.9rem; line-height:1.8; text-align:right;
          color:var(--gold2); margin-bottom:14px;
          direction:rtl;
        }
        .db-ayah-en {
          font-style:italic; font-size:.95rem; line-height:1.7;
          color:var(--text); opacity:.85;
          padding-left:14px; border-left:2px solid rgba(245,158,11,0.35);
        }

        /* ── Mood tracker ── */
        .db-mood {
          padding:22px 24px; border-radius:18px;
          background:var(--card-bg); border:1px solid var(--card-border);
          animation: dbFadeUp .6s .2s ease both;
        }
        .db-mood-btns { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
        .db-mood-btn {
          padding:9px 16px; border-radius:28px;
          border:1px solid var(--border); background:transparent;
          cursor:pointer; transition:all .25s;
          font-size:.82rem; font-family:'Nunito',sans-serif;
          color:var(--muted); display:flex; align-items:center; gap:6px;
        }
        .db-mood-btn:hover { border-color:var(--gold); color:var(--text); background:rgba(245,158,11,0.07); }
        .db-mood-btn.active {
          background:rgba(245,158,11,0.15); border-color:var(--gold);
          color:var(--gold2); font-weight:700;
        }
        .db-mood-saved { font-size:.75rem; color:var(--emerald); margin-top:8px; display:flex; align-items:center; gap:5px; }

        /* ── Ramadan timeline ── */
        .db-timeline {
          padding:22px 24px; border-radius:18px;
          background:var(--card-bg); border:1px solid var(--card-border);
          animation: dbFadeUp .6s .25s ease both;
        }
        .db-timeline-dots {
          display:flex; gap:4px; flex-wrap:wrap; margin-top:14px;
        }
        .db-tl-dot {
          width:18px; height:18px; border-radius:5px;
          border:1px solid var(--border);
          display:flex; align-items:center; justify-content:center;
          font-size:.5rem; transition:all .2s; cursor:default;
        }
        .db-tl-dot.done { background:rgba(245,158,11,0.25); border-color:rgba(245,158,11,0.4); }
        .db-tl-dot.today { background:var(--gold); border-color:var(--gold); box-shadow:0 0 8px rgba(245,158,11,0.5); }
        .db-tl-dot.future { background:transparent; }

        /* ── Quick stats row ── */
        .db-qs {
          padding:18px 20px; border-radius:16px;
          background:var(--card-bg); border:1px solid var(--card-border);
          display:flex; flex-direction:column; gap:6px;
          animation: dbFadeUp .6s .3s ease both;
          transition:transform .25s;
        }
        .db-qs:hover { transform:translateY(-2px); }
        .db-qs-icon {
          width:34px; height:34px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
        }
        .db-qs-num { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); }
        .db-qs-lbl { font-size:.68rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); }

        /* ── Sunnah card ── */
        .db-sunnah {
          padding:24px 28px; border-radius:18px;
          background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(99,102,241,0.02));
          border:1px solid rgba(99,102,241,0.22);
          animation: dbFadeUp .6s .35s ease both;
        }

        /* ── Section header ── */
        .db-sec-hdr {
          display:flex; align-items:center; gap:8px; margin-bottom:10px;
        }
        .db-sec-title {
          font-family:'Cinzel',serif; font-size:.82rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; color:var(--text);
        }

        @keyframes dbFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @media(max-width:900px) {
          .db-row-2, .db-row-3, .db-row-4 { grid-template-columns:1fr; }
          .db-hero { grid-template-columns:1fr; }
          .db-day-pill { display:none; }
          .db-name { font-size:1.5rem; }
        }
      `}</style>

      <div className="db-root">

        {/* ── Hero ── */}
        <div className="db-hero">
          <div>
            <div className="db-greeting">{greeting}</div>
            <div className="db-name">{firstName} 🌙</div>
            <div className="db-tagline">Your blessed Ramadan 1447 companion</div>
            <div style={{ marginTop:14, display:"flex", gap:10, flexWrap:"wrap" }}>
              <span className={`badge ${ashra.badge}`}>Day {dayNum} · Ashra of {ashra.label}</span>
              <span className="badge badge-gold">Ramadan 1447</span>
              <span className="badge badge-teal">{30 - dayNum} days remaining</span>
            </div>
          </div>
          <div className="db-day-pill">
            <div className="db-day-num">{dayNum}</div>
            <div className="db-day-lbl">of Ramadan</div>
            <div style={{ marginTop:10 }}>
              <div className="db-prog-track" style={{ width:90 }}>
                <div className="db-prog-fill" style={{ width:`${ramadanPct}%` }}/>
              </div>
              <div style={{ fontSize:".6rem", color:"var(--muted)", marginTop:4, textAlign:"center" }}>{ramadanPct}% complete</div>
            </div>
          </div>
        </div>

        {/* ── Row 1: Quick stats ── */}
        <div className="db-row db-row-4" style={{ marginBottom:18 }}>
          {[
            { icon:<IcoStar/>, color:"rgba(245,158,11,0.15)", num:dayNum, lbl:"Days Fasted", sub:"MashaAllah!" },
            { icon:<IcoBook/>, color:"rgba(16,185,129,0.15)",  num:`${dayNum * 2}+`, lbl:"Juz Available", sub:"Keep reading" },
            { icon:<IcoHeart/>, color:"rgba(244,63,94,0.15)",  num:"∞", lbl:"Allah's Mercy", sub:"Always near" },
            { icon:<IcoTrend/>, color:"rgba(99,102,241,0.15)", num:`${ramadanPct}%`, lbl:"Journey Done", sub:"Stay strong!" },
          ].map((s,i) => (
            <div className="db-qs" key={i} style={{ animationDelay:`${i*0.07}s` }}>
              <div className="db-qs-icon" style={{ background:s.color, color: i===0?"#f59e0b":i===1?"#10b981":i===2?"#f43f5e":"#6366f1" }}>
                {s.icon}
              </div>
              <div className="db-qs-num">{s.num}</div>
              <div className="db-qs-lbl">{s.lbl}</div>
              <div style={{ fontSize:".72rem", color:"var(--muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Row 2: Ayah + Prayer times ── */}
        <div className="db-row db-row-2" style={{ marginBottom:18 }}>

          {/* Ayah of the day */}
          <div className="db-ayah">
            <div className="db-sec-hdr">
              <div className="db-qs-icon" style={{ background:"rgba(245,158,11,0.12)", color:"#f59e0b", width:32, height:32, borderRadius:9 }}>
                <IcoBook/>
              </div>
              <span className="db-sec-title">Ayah of Day {dayNum}</span>
              <span className={`badge ${g.type === "Quran" ? "badge-gold" : "badge-teal"}`} style={{ marginLeft:"auto" }}>
                {g.type}
              </span>
            </div>
            <div className="db-ayah-arabic">{g.ar}</div>
            <div className="db-ayah-en">"{g.en}"</div>
          </div>

          {/* Prayer countdown */}
          <div className="db-prayer-card">
            <div className="db-sec-hdr">
              <div className="db-qs-icon" style={{ background:"rgba(13,148,136,0.12)", color:"#0d9488", width:32, height:32, borderRadius:9 }}>
                <IcoPrayer/>
              </div>
              <span className="db-sec-title">Next Prayer</span>
              <span className="badge badge-teal" style={{ marginLeft:"auto" }}>{nextPrayer.name}</span>
            </div>
            <div className="db-countdown">{countdown}</div>
            <div style={{ fontSize:".72rem", color:"var(--muted)", marginTop:2 }}>
              {nextPrayer.name} at {nextPrayer.time}
            </div>
            <div className="db-prayer-list">
              {PRAYER_TIMES.map(p => (
                <div key={p.name}
                  className={`db-prayer-row${p.name === nextPrayer.name ? " next-prayer" : ""}`}>
                  <span className="db-prayer-name">
                    <span>{p.icon}</span> {p.name}
                  </span>
                  <span className="db-prayer-time">{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: Mood tracker + Ramadan timeline ── */}
        <div className="db-row db-row-2" style={{ marginBottom:18 }}>

          {/* Mood tracker — unique feature */}
          <div className="db-mood">
            <div className="db-sec-hdr">
              <div className="db-qs-icon" style={{ background:"rgba(244,63,94,0.12)", color:"#f43f5e", width:32, height:32, borderRadius:9 }}>
                <IcoHeart/>
              </div>
              <span className="db-sec-title">How do you feel today?</span>
            </div>
            <div style={{ fontSize:".8rem", color:"var(--muted)" }}>Track your spiritual mood daily</div>
            <div className="db-mood-btns">
              {MOODS.map(m => (
                <button key={m.label}
                  className={`db-mood-btn${mood === m.label ? " active" : ""}`}
                  onClick={() => saveMood(m.label)}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
            {moodSaved && (
              <div className="db-mood-saved">
                <IcoCheck/> Mood saved for Day {dayNum}
              </div>
            )}
          </div>

          {/* Ramadan timeline */}
          <div className="db-timeline">
            <div className="db-sec-hdr">
              <div className="db-qs-icon" style={{ background:"rgba(99,102,241,0.12)", color:"#6366f1", width:32, height:32, borderRadius:9 }}>
                <IcoCalendar/>
              </div>
              <span className="db-sec-title">30-Day Journey</span>
              <span style={{ marginLeft:"auto", fontSize:".72rem", color:"var(--muted)" }}>{dayNum}/30 days</span>
            </div>
            <div className="db-prog-track">
              <div className="db-prog-fill" style={{ width:`${ramadanPct}%` }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:".65rem", color:"var(--muted)" }}>
              <span>Mercy (1-10)</span>
              <span>Forgiveness (11-20)</span>
              <span>Salvation (21-30)</span>
            </div>
            <div className="db-timeline-dots">
              {Array.from({length:30},(_,i)=>i+1).map(d => (
                <div key={d}
                  className={`db-tl-dot ${d < dayNum ? "done" : d === dayNum ? "today" : "future"}`}
                  title={`Day ${d}`}>
                  {d === dayNum ? "★" : d < dayNum ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, fontSize:".75rem", color:"var(--muted)", display:"flex", gap:14 }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:10, borderRadius:3, background:"rgba(245,158,11,0.25)", display:"inline-block" }}/> Completed
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:10, borderRadius:3, background:"var(--gold)", display:"inline-block" }}/> Today
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:10, borderRadius:3, border:"1px solid var(--border)", display:"inline-block" }}/> Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* ── Row 4: Sunnah spotlight ── */}
        <div className="db-sunnah" style={{ marginBottom:18 }}>
          <div className="db-sec-hdr">
            <div className="db-qs-icon" style={{ background:"rgba(99,102,241,0.12)", color:"#6366f1", width:32, height:32, borderRadius:9 }}>
              <IcoStar/>
            </div>
            <span className="db-sec-title">Sunnah Spotlight</span>
            <span className="badge badge-indigo" style={{ marginLeft:"auto" }}>Daily Practice</span>
          </div>
          <div style={{ fontFamily:"'Scheherazade New',serif", fontSize:"1.7rem", direction:"rtl", textAlign:"right", color:"var(--gold2)", margin:"12px 0", lineHeight:1.8 }}>
            قَالَ رَسُولُ اللَّهِ ﷺ: «تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً»
          </div>
          <div style={{ fontStyle:"italic", opacity:.88, fontSize:".95rem", lineHeight:1.7, borderLeft:"2px solid rgba(99,102,241,0.4)", paddingLeft:14 }}>
            Prophet Muhammad ﷺ said: <strong>"Take Suhoor, for in Suhoor there is blessing."</strong>
          </div>
          <div style={{ marginTop:10, opacity:.65, fontSize:".88rem", lineHeight:1.7 }}>
            Use this blessed time not just for food — but for Tahajjud, Istighfar, and making dua before Fajr.
          </div>
        </div>

      </div>
    </>
  );
}