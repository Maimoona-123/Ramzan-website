// src/views/Calendar.jsx
import { useState, useEffect } from "react";

const GUIDANCE = {
  1:{type:"Quran",ar:"شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ",en:"The month of Ramadan in which the Quran was revealed."},
  2:{type:"Hadith",ar:"الصِّيَامُ جُنَّةٌ",en:"Fasting is a shield from hellfire and sins."},
  3:{type:"Quran",ar:"لَعَلَّكُمْ تَتَّقُونَ",en:"So that you may become mindful of Allah."},
  4:{type:"Hadith",ar:"مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ",en:"Whoever fasts Ramadan with faith, his sins are forgiven."},
  5:{type:"Quran",ar:"وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",en:"When My servants ask about Me, I am near."},
  6:{type:"Hadith",ar:"تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً",en:"Take Suhoor, for in it there is blessing."},
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

// Special nights
const SPECIAL = {
  1:  { label:"First Day",      color:"#f59e0b", icon:"🌙" },
  10: { label:"Last of Mercy",  color:"#10b981", icon:"💚" },
  11: { label:"Forgiveness Begins", color:"#6366f1", icon:"🤲" },
  15: { label:"Mid Ramadan",    color:"#6366f1", icon:"⭐" },
  20: { label:"Last of Forgiveness", color:"#6366f1", icon:"✨" },
  21: { label:"Laylatul Qadr?", color:"#f59e0b", icon:"🌟" },
  23: { label:"Laylatul Qadr?", color:"#f59e0b", icon:"🌟" },
  25: { label:"Laylatul Qadr?", color:"#f59e0b", icon:"🌟" },
  27: { label:"Laylatul Qadr ✨", color:"#fbbf24", icon:"💫" },
  29: { label:"Laylatul Qadr?", color:"#f59e0b", icon:"🌟" },
  30: { label:"Last Day 🎉",    color:"#f43f5e", icon:"🎊" },
};

const ASHRA_INFO = [
  { days:"1–10",  name:"Ashra of Mercy",       ar:"أيام الرحمة",      color:"#10b981", bg:"rgba(16,185,129,0.1)",   border:"rgba(16,185,129,0.25)" },
  { days:"11–20", name:"Ashra of Forgiveness",  ar:"أيام المغفرة",     color:"#6366f1", bg:"rgba(99,102,241,0.1)",  border:"rgba(99,102,241,0.25)" },
  { days:"21–30", name:"Ashra of Salvation",    ar:"أيام النجاة",      color:"#f43f5e", bg:"rgba(244,63,94,0.1)",   border:"rgba(244,63,94,0.25)" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const START   = new Date("2026-02-20");

function getDayNum() {
  const today = new Date();
  return Math.min(30, Math.max(1, Math.round((today - START) / 86400000) + 1));
}

function getDate(day) {
  const d = new Date(START);
  d.setDate(START.getDate() + day - 1);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function getAshra(day) {
  if (day <= 10)  return ASHRA_INFO[0];
  if (day <= 20)  return ASHRA_INFO[1];
  return ASHRA_INFO[2];
}

// ── SVG Icons ──
const IcoClose  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoNote   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoCheck  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoFilter = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

export default function Calendar() {
  const todayDay = getDayNum();
  const [modal, setModal]       = useState(null);
  const [note, setNote]         = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ramadan-notes") || "{}"); }
    catch { return {}; }
  });
  const [filter, setFilter] = useState("all"); // all | past | future | special
  const [viewMode, setViewMode] = useState("grid"); // grid | ashra

  // Load note when modal opens
  useEffect(() => {
    if (modal) setNote(savedNotes[modal] || "");
  }, [modal]);

  const saveNote = () => {
    const updated = { ...savedNotes, [modal]: note };
    setSavedNotes(updated);
    localStorage.setItem("ramadan-notes", JSON.stringify(updated));
  };

  const getDays = () => {
    let days = Array.from({ length: 30 }, (_, i) => i + 1);
    if (filter === "past")    return days.filter(d => d < todayDay);
    if (filter === "future")  return days.filter(d => d > todayDay);
    if (filter === "special") return days.filter(d => SPECIAL[d]);
    return days;
  };

  const notesCount  = Object.values(savedNotes).filter(Boolean).length;
  const pastDays    = todayDay - 1;
  const specialDays = Object.keys(SPECIAL).length;

  return (
    <>
      <style>{`
        .cal-root { width:100%; box-sizing:border-box; overflow-x:hidden; }

        /* ── Hero ── */
        .cal-hero {
          padding:26px 30px; border-radius:22px; margin-bottom:22px;
          background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.02));
          border:1px solid rgba(245,158,11,0.2);
          display:flex; align-items:center; justify-content:space-between; gap:20px;
          width:100%; box-sizing:border-box;
          animation: calFadeUp .5s ease both;
        }
        .cal-hero-title {
          font-family:'Cinzel',serif; font-size:1.7rem; font-weight:900;
          color:var(--gold); letter-spacing:2px;
        }
        .cal-hero-sub { font-size:.82rem; color:var(--muted); margin-top:4px; }
        .cal-stats-row { display:flex; gap:12px; flex-wrap:wrap; }
        .cal-stat-chip {
          padding:10px 16px; border-radius:14px; text-align:center;
          border:1px solid var(--border); background:var(--card-bg);
          min-width:80px;
        }
        .cal-stat-num { font-family:'Cinzel',serif; font-size:1.4rem; font-weight:900; color:var(--gold); }
        .cal-stat-lbl { font-size:.58rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); }

        /* ── Ashra strips ── */
        .cal-ashra-strips {
          display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px;
          animation: calFadeUp .5s .1s ease both;
        }
        .cal-ashra-strip {
          padding:14px 18px; border-radius:16px;
          border:1px solid; text-align:center;
          transition:transform .25s;
        }
        .cal-ashra-strip:hover { transform:translateY(-2px); }
        .cal-ashra-ar { font-family:'Scheherazade New',serif; font-size:1.1rem; }
        .cal-ashra-name { font-size:.7rem; font-weight:800; letter-spacing:2px; text-transform:uppercase; margin-top:4px; }
        .cal-ashra-days { font-size:.65rem; opacity:.65; margin-top:2px; }

        /* ── Toolbar ── */
        .cal-toolbar {
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; margin-bottom:16px; flex-wrap:wrap;
          animation: calFadeUp .5s .15s ease both;
        }
        .cal-filter-row { display:flex; gap:8px; flex-wrap:wrap; }
        .cal-filter-btn {
          padding:8px 16px; border-radius:20px;
          border:1px solid var(--border); background:transparent;
          color:var(--muted); font-size:.78rem; font-family:'Nunito',sans-serif;
          font-weight:700; cursor:pointer; transition:all .22s;
          display:flex; align-items:center; gap:6px;
        }
        .cal-filter-btn:hover { border-color:var(--gold); color:var(--text); }
        .cal-filter-btn.active {
          background:rgba(245,158,11,0.15); border-color:var(--gold);
          color:var(--gold2);
        }
        .cal-view-toggle {
          display:flex; gap:4px; background:rgba(0,0,0,0.2);
          padding:4px; border-radius:12px;
        }
        .cal-vbtn {
          padding:7px 14px; border-radius:9px; border:none;
          font-family:'Nunito',sans-serif; font-size:.75rem; font-weight:700;
          cursor:pointer; transition:all .22s; color:var(--muted); background:transparent;
        }
        .cal-vbtn.active { background:rgba(245,158,11,0.2); color:var(--gold2); }

        /* ── Grid ── */
        .cal-grid {
          display:grid;
          grid-template-columns:repeat(6,1fr);
          gap:10px; margin-bottom:20px;
          width:100%; box-sizing:border-box;
          animation: calFadeUp .5s .2s ease both;
        }

        /* ── Day card ── */
        .cal-card {
          border-radius:16px; padding:14px 10px;
          border:1px solid var(--card-border);
          background:var(--card-bg);
          cursor:pointer; transition:all .25s;
          display:flex; flex-direction:column;
          align-items:center; gap:5px;
          min-height:95px; position:relative;
          overflow:hidden;
        }
        .cal-card:hover { transform:translateY(-4px); border-color:var(--gold); box-shadow:0 8px 24px rgba(0,0,0,0.2); }
        .cal-card.is-today {
          border:2px solid var(--gold);
          background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.03));
          box-shadow:0 0 20px rgba(245,158,11,0.2);
          animation:calGlow 2.5s ease-in-out infinite alternate;
        }
        .cal-card.is-past { opacity:.75; }
        .cal-card.has-note::after {
          content:''; position:absolute; top:6px; right:6px;
          width:6px; height:6px; border-radius:50%;
          background:var(--teal);
        }
        @keyframes calGlow {
          from{box-shadow:0 0 12px rgba(245,158,11,0.2)}
          to  {box-shadow:0 0 28px rgba(245,158,11,0.45)}
        }

        .cal-card-date { font-size:.55rem; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
        .cal-card-num  {
          font-family:'Cinzel',serif; font-size:1.6rem; font-weight:900;
          color:var(--gold); line-height:1;
        }
        .cal-card.is-today .cal-card-num { text-shadow:0 0 14px rgba(245,158,11,0.6); }
        .cal-card-special { font-size:.6rem; text-align:center; line-height:1.3; }
        .cal-card-type {
          width:6px; height:6px; border-radius:50%;
          margin-top:2px;
        }
        .cal-today-badge {
          position:absolute; top:5px; left:5px;
          font-size:.45rem; letter-spacing:1.5px; text-transform:uppercase;
          background:var(--gold); color:#06040f;
          padding:2px 6px; border-radius:6px; font-weight:900;
        }

        /* ── Ashra view ── */
        .cal-ashra-view { display:flex; flex-direction:column; gap:18px; margin-bottom:20px; }
        .cal-ashra-section { border-radius:18px; padding:20px; border:1px solid; }
        .cal-ashra-section-title {
          font-family:'Cinzel',serif; font-size:1rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;
          display:flex; align-items:center; gap:10px;
        }
        .cal-ashra-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:8px; }

        /* ── Modal ── */
        .cal-modal-inner {
          max-width:560px; width:100%;
          animation:calModalIn .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes calModalIn {
          from{opacity:0;transform:scale(.88) translateY(20px)}
          to  {opacity:1;transform:scale(1)   translateY(0)}
        }
        .cal-modal-card {
          background:var(--card-bg); border:1px solid var(--card-border);
          border-radius:24px; padding:32px 34px;
          backdrop-filter:blur(20px);
        }
        .cal-modal-day-num {
          font-family:'Cinzel',serif; font-size:3rem; font-weight:900;
          color:var(--gold); text-shadow:0 0 24px rgba(245,158,11,.4);
          line-height:1;
        }
        .cal-modal-arabic {
          font-family:'Scheherazade New',serif; font-size:1.9rem;
          direction:rtl; text-align:right; line-height:1.9;
          color:var(--gold2); margin:18px 0 12px;
        }
        .cal-modal-en {
          font-style:italic; font-size:.95rem; line-height:1.7;
          border-left:3px solid rgba(245,158,11,0.4); padding-left:14px;
          color:var(--text); opacity:.88;
        }
        .cal-note-area {
          width:100%; margin-top:18px; padding:12px 14px;
          background:var(--inp-bg); border:1px solid var(--border);
          border-radius:13px; color:var(--inp-text);
          font-family:'Nunito',sans-serif; font-size:.88rem;
          resize:none; outline:none; min-height:80px;
          transition:border-color .25s;
          box-sizing:border-box;
        }
        .cal-note-area:focus { border-color:var(--gold); }
        .cal-note-area::placeholder { color:var(--inp-placeholder); }
        .cal-save-btn {
          padding:10px 20px; border-radius:12px; border:none;
          background:linear-gradient(135deg,#d97706,#f59e0b);
          color:#06040f; font-weight:800; font-size:.82rem;
          font-family:'Nunito',sans-serif; cursor:pointer;
          display:flex; align-items:center; gap:7px;
          transition:all .25s; letter-spacing:1px; text-transform:uppercase;
        }
        .cal-save-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(245,158,11,.3); }
        .cal-close-btn {
          width:36px; height:36px; border-radius:10px; border:1px solid var(--border);
          background:transparent; color:var(--muted); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all .22s;
        }
        .cal-close-btn:hover { border-color:var(--rose); color:var(--rose); }

        /* ── Legend ── */
        .cal-legend {
          display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px;
          padding:14px 18px; border-radius:14px;
          background:var(--card-bg); border:1px solid var(--card-border);
          animation: calFadeUp .5s .25s ease both;
        }
        .cal-legend-item { display:flex; align-items:center; gap:6px; font-size:.75rem; color:var(--muted); }
        .cal-legend-dot { width:10px; height:10px; border-radius:3px; flex-shrink:0; }

        @keyframes calFadeUp {
          from{opacity:0;transform:translateY(16px)}
          to  {opacity:1;transform:translateY(0)}
        }

        @media(max-width:900px){
          .cal-grid { grid-template-columns:repeat(4,1fr); }
          .cal-ashra-grid { grid-template-columns:repeat(5,1fr); }
          .cal-ashra-strips { grid-template-columns:1fr; }
          .cal-hero { flex-direction:column; align-items:flex-start; }
        }
        @media(max-width:600px){
          .cal-grid { grid-template-columns:repeat(3,1fr); }
        }
      `}</style>

      <div className="cal-root" style={{width:"100%", minWidth:0, boxSizing:"border-box"}}>

        {/* ── Hero ── */}
        <div className="cal-hero">
          <div>
            <div className="cal-hero-title">30-Day Roadmap</div>
            <div style={{ fontFamily:"'Scheherazade New',serif", fontSize:"1.3rem", color:"rgba(245,158,11,0.6)", marginTop:2 }}>
              رَمَضَان ١٤٤٧
            </div>
            <div className="cal-hero-sub">Click any day to read its ayah & add your personal reflection</div>
          </div>
          <div className="cal-stats-row">
            {[
              { num: pastDays,   lbl:"Completed" },
              { num: todayDay,   lbl:"Today" },
              { num: 30-todayDay, lbl:"Remaining" },
              { num: notesCount, lbl:"Notes" },
            ].map((s,i) => (
              <div className="cal-stat-chip" key={i}>
                <div className="cal-stat-num">{s.num}</div>
                <div className="cal-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ashra strips ── */}
        <div className="cal-ashra-strips">
          {ASHRA_INFO.map((a,i) => (
            <div key={i} className="cal-ashra-strip"
              style={{ background:a.bg, borderColor:a.border, color:a.color }}>
              <div className="cal-ashra-ar">{a.ar}</div>
              <div className="cal-ashra-name">{a.name}</div>
              <div className="cal-ashra-days">Days {a.days}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="cal-toolbar">
          <div className="cal-filter-row">
            {[
              { key:"all",     label:"All 30 Days" },
              { key:"past",    label:"Completed" },
              { key:"future",  label:"Upcoming" },
              { key:"special", label:"✨ Special Nights" },
            ].map(f => (
              <button key={f.key}
                className={`cal-filter-btn${filter===f.key?" active":""}`}
                onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="cal-view-toggle">
            <button className={`cal-vbtn${viewMode==="grid"?" active":""}`} onClick={() => setViewMode("grid")}>Grid</button>
            <button className={`cal-vbtn${viewMode==="ashra"?" active":""}`} onClick={() => setViewMode("ashra")}>By Ashra</button>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="cal-legend">
          {[
            { color:"rgba(245,158,11,0.5)", label:"Today" },
            { color:"rgba(255,255,255,0.15)", label:"Past days" },
            { color:"var(--teal)", label:"Has your note" },
            { color:"rgba(251,191,36,0.8)", label:"Special night" },
          ].map((l,i) => (
            <div className="cal-legend-item" key={i}>
              <div className="cal-legend-dot" style={{ background:l.color }}/>
              {l.label}
            </div>
          ))}
        </div>

        {/* ── Grid view ── */}
        {viewMode === "grid" && (
          <div className="cal-grid">
            {getDays().map(day => {
              const ashra  = getAshra(day);
              const sp     = SPECIAL[day];
              const hasNote = !!savedNotes[day];
              const isPast = day < todayDay;
              const isToday = day === todayDay;
              const g = GUIDANCE[day];
              return (
                <div key={day}
                  className={`cal-card${isToday?" is-today":""}${isPast?" is-past":""}${hasNote?" has-note":""}`}
                  onClick={() => setModal(day)}>
                  {isToday && <div className="cal-today-badge">TODAY</div>}
                  <div className="cal-card-date">{getDate(day)}</div>
                  <div className="cal-card-num">{day}</div>
                  {sp && <div className="cal-card-special" style={{ color:sp.color }}>{sp.icon}</div>}
                  <div className="cal-card-type" style={{ background: g?.type==="Quran" ? "rgba(245,158,11,0.6)" : "rgba(13,148,136,0.6)" }}/>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Ashra view ── */}
        {viewMode === "ashra" && (
          <div className="cal-ashra-view">
            {ASHRA_INFO.map((a, ai) => (
              <div key={ai} className="cal-ashra-section" style={{ background:a.bg, borderColor:a.border }}>
                <div className="cal-ashra-section-title" style={{ color:a.color }}>
                  {a.name}
                  <span style={{ fontFamily:"'Scheherazade New',serif", fontSize:"1.1rem", fontWeight:400 }}>{a.ar}</span>
                  <span style={{ marginLeft:"auto", fontSize:".7rem", opacity:.7 }}>Days {a.days}</span>
                </div>
                <div className="cal-ashra-grid">
                  {Array.from({length:10},(_,i)=> ai*10+i+1).map(day => {
                    const isToday = day === todayDay;
                    const isPast  = day < todayDay;
                    const hasNote = !!savedNotes[day];
                    const sp = SPECIAL[day];
                    return (
                      <div key={day}
                        className={`cal-card${isToday?" is-today":""}${isPast?" is-past":""}${hasNote?" has-note":""}`}
                        style={{ minHeight:80 }}
                        onClick={() => setModal(day)}>
                        {isToday && <div className="cal-today-badge">NOW</div>}
                        <div className="cal-card-date">{getDate(day)}</div>
                        <div className="cal-card-num" style={{ fontSize:"1.3rem" }}>{day}</div>
                        {sp && <div style={{ fontSize:".7rem", color:sp.color }}>{sp.icon}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Modal ── */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="cal-modal-inner" onClick={e => e.stopPropagation()}>
              <div className="cal-modal-card">

                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:".6rem", letterSpacing:4, textTransform:"uppercase", color:"var(--muted)", marginBottom:4 }}>
                      {getDate(modal)} · {getAshra(modal).name}
                    </div>
                    <div className="cal-modal-day-num">Day {modal}</div>
                    <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                      <span className={`badge ${GUIDANCE[modal]?.type==="Quran"?"badge-gold":"badge-teal"}`}>
                        {GUIDANCE[modal]?.type}
                      </span>
                      {SPECIAL[modal] && (
                        <span className="badge badge-gold">{SPECIAL[modal].icon} {SPECIAL[modal].label}</span>
                      )}
                    </div>
                  </div>
                  <button className="cal-close-btn" onClick={() => setModal(null)}><IcoClose/></button>
                </div>

                {/* Ayah */}
                <div className="cal-modal-arabic">{GUIDANCE[modal]?.ar}</div>
                <div className="cal-modal-en">"{GUIDANCE[modal]?.en}"</div>

                {/* Note section */}
                <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--border)" }}>
                  <div style={{ fontSize:".7rem", letterSpacing:2, textTransform:"uppercase", color:"var(--muted)", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                    <IcoNote/> Your Reflection for Day {modal}
                  </div>
                  <textarea
                    className="cal-note-area"
                    placeholder="Write your thoughts, dua, or gratitude for this day..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
                    <button className="cal-save-btn" onClick={saveNote}>
                      <IcoCheck/> Save Note
                    </button>
                    {savedNotes[modal] && (
                      <span style={{ fontSize:".75rem", color:"var(--emerald)", display:"flex", alignItems:"center", gap:5 }}>
                        <IcoCheck/> Saved!
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}