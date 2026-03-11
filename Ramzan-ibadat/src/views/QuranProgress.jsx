// src/views/QuranProgress.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import CircleProgress from "../components/CircleProgress";
import Toast from "../components/Toast";

const JUZ_NAMES = [
  "Alif Lam Mim","Sayaqul","Tilkar Rusul","Lan Tana Lu","Wal Muhsanat",
  "La Yuhibbullah","Wa Iza Samiu","Wa Lau Annana","Qalal Mala","Wa A'lamu",
  "Ya'tadhirun","Wa Ma Min Dabbah","Wa Ma Ubari'u","Rubama","Subhanalladhi",
  "Qal Alam","Iqtaraba","Qad Aflaha","Wa Qalallathina","Amman Khalaqa",
  "Utlu Ma Uhiya","Wa Man Yaqnut","Wa Mali","Faman Azlamu","Ilayhi Yuraddu",
  "Ha Mim","Qala Fama Khatbukum","Qad Sami Allah","Tabarakallathi","Amma"
];

const SURAHS = [
  "Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am",
  "Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd",
  "Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara",
  "An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab",
  "Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat",
  "Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad",
  "Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar",
  "Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
  "As-Saf","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim",
  "Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil",
  "Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at",
  "Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj",
  "At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams",
  "Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah",
  "Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah",
  "Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad",
  "Al-Ikhlas","Al-Falaq","An-Nas"
];

const DAILY_GOALS = [
  { key:"half",  label:"Half Juz",  pages:10, icon:"📄" },
  { key:"one",   label:"1 Juz",     pages:20, icon:"📖" },
  { key:"two",   label:"2 Juz",     pages:40, icon:"🔥" },
  { key:"three", label:"3 Juz",     pages:60, icon:"⭐" },
];

const AYAHS = [
  { ar:"شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", en:"The month of Ramadan in which was revealed the Quran.", ref:"2:185" },
  { ar:"إِنَّ هَـٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", en:"Indeed this Quran guides to that which is most suitable.", ref:"17:9" },
  { ar:"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ", en:"And We have certainly made the Quran easy for remembrance.", ref:"54:17" },
];

const Save    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const Plus    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Minus   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Chk     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoBook  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoStar  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoTarget= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IcoMap   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const IcoLog   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IcoChart = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoMark  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const IcoSun   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

export default function QuranProgress() {
  const { user } = useAuth();

  const [juz,       setJuz]       = useState(0);
  const [pages,     setPages]     = useState(0);
  const [surah,     setSurah]     = useState("");
  const [ayah,      setAyah]      = useState("");
  const [notes,     setNotes]     = useState("");
  const [goal,      setGoal]      = useState("one");
  const [log,       setLog]       = useState([]);
  const [toast,     setToast]     = useState("");
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("progress"); // progress | log | goals

  const totalPages = juz * 20 + pages;
  const pct        = Math.min(Math.round((totalPages / 600) * 100), 100);
  const juzFull    = Math.floor(totalPages / 20);
  const pagesExtra = totalPages % 20;

  const goalObj    = DAILY_GOALS.find(g => g.key === goal);
  const todayLog   = log.find(l => l.date === new Date().toDateString());
  const todayPages = todayLog?.pages || 0;
  const goalPct    = Math.min(Math.round((todayPages / (goalObj?.pages||20)) * 100), 100);

  const motivation =
    pct >= 90 ? "MashaAllah! Almost at Khatm — may Allah accept! 🤲" :
    pct >= 60 ? "SubhanAllah! More than half done — keep going! 🌟" :
    pct >= 30 ? "Alhamdulillah — every page is noor in your heart 🌙" :
    pct >  0  ? "Barakallah feek — your journey has begun 📖" :
    "Begin your Quran journey — every letter is 10 rewards 📖";

  const ayahOfDay = AYAHS[juzFull % AYAHS.length];

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "quranProgress", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setJuz(d.juz || 0);
          setPages(d.pages || 0);
          setSurah(d.surah || "");
          setAyah(d.ayah || "");
          setNotes(d.notes || "");
          setGoal(d.goal || "one");
          setLog(d.log || []);
        }
      } catch(e) { console.warn(e); }
      setLoading(false);
    })();
  }, [user]);

  const save = async (overrides = {}) => {
    const data = { uid:user.uid, juz, pages, surah, ayah, notes, goal, pct, log,
      updatedAt: new Date().toISOString(), ...overrides };
    await setDoc(doc(db, "quranProgress", user.uid), data);
    setToast("Progress saved! May Allah bless your recitation 📖");
  };

  const logToday = async (p) => {
    const today = new Date().toDateString();
    const existing = log.findIndex(l => l.date === today);
    let newLog;
    if (existing >= 0) {
      newLog = log.map((l,i) => i===existing ? {...l, pages: Math.max(0, l.pages + p)} : l);
    } else {
      newLog = [...log, { date: today, pages: Math.max(0, p), surah }];
    }
    setLog(newLog);
    const newPages = Math.min(pages + p, 19);
    const newJuz   = p > 0 && pages + p >= 20 ? Math.min(juz + 1, 30) : juz;
    const np       = p > 0 && pages + p >= 20 ? 0 : newPages;
    setPages(np < 0 ? 0 : np);
    if (newJuz > juz) { setJuz(newJuz); setToast(`Juz ${newJuz} complete! MashaAllah! 🎉`); }
    await setDoc(doc(db, "quranProgress", user.uid), {
      uid:user.uid, juz:newJuz, pages:np<0?0:np, surah, ayah, notes, goal,
      pct: Math.min(Math.round(((newJuz*20+(np<0?0:np))/600)*100),100),
      log:newLog, updatedAt:new Date().toISOString()
    });
  };

  if (loading) return (
    <div className="view-wrap" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
      <div style={{color:"var(--muted)",fontSize:".9rem"}}>Loading your Quran journey…</div>
    </div>
  );

  return (
    <>
      <style>{`
        .qp { width:100%; box-sizing:border-box; }
        .qp-r2.full-card > .qp-card { min-height:400px; }

        /* Hero */
        .qp-hero {
          padding:24px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,var(--gold-dim),rgba(245,158,11,0.02));
          border:1px solid var(--card-border);
          display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
        }
        .qp-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; }
        .qp-sub   { font-size:.74rem; color:var(--muted); margin-top:3px; }
        .qp-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .qp-chip  { padding:9px 14px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:68px; }
        .qp-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--gold); }
        .qp-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .qp-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .qp-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .qp-tab.on { background:var(--gold-dim); color:var(--gold2); border:1px solid var(--card-border); }

        /* Grid */
        .qp-r2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
        .qp-r3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:16px; }

        /* Card */
        .qp-card {
          padding:22px 24px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .qp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--card-border),transparent); }
        .qp-card-hd { font-family:'Cinzel',serif; font-size:.76rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold2); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .qp-ico { width:27px; height:27px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:.9rem; color:var(--gold2); }

        /* Big circle area */
        .qp-circle-wrap { display:flex; flex-direction:column; align-items:center; gap:14px; }
        .qp-motivation {
          text-align:center; font-style:italic; font-size:.85rem; color:var(--teal2);
          padding:10px 18px; border-radius:14px;
          background:rgba(13,148,136,0.08); border:1px solid rgba(13,148,136,0.2);
          line-height:1.6;
        }

        /* Juz grid */
        .qp-juz-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:6px; }
        .qp-juz-cell {
          aspect-ratio:1; border-radius:8px; border:1px solid var(--border);
          background:var(--prayer-bg); display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:2px;
          cursor:pointer; transition:all .2s; font-size:.6rem;
        }
        .qp-juz-cell:hover { border-color:var(--gold); transform:scale(1.05); }
        .qp-juz-cell.done { background:linear-gradient(135deg,var(--gold-dim),rgba(245,158,11,0.05)); border-color:rgba(245,158,11,0.4); }
        .qp-juz-cell.current { border:2px solid var(--gold); background:var(--gold-dim); box-shadow:0 0 12px var(--gold-glow); }
        .qp-juz-num { font-family:'Cinzel',serif; font-size:.75rem; font-weight:900; color:var(--gold); }
        .qp-juz-chk { color:var(--gold); font-size:.6rem; }

        /* Page counter */
        .qp-page-counter { display:flex; align-items:center; gap:12px; justify-content:center; margin:14px 0; }
        .qp-cnt-btn {
          width:36px; height:36px; border-radius:10px; border:1px solid var(--border);
          background:var(--card-bg); color:var(--text); cursor:pointer; display:flex;
          align-items:center; justify-content:center; transition:all .22s; font-size:.9rem;
        }
        .qp-cnt-btn:hover { border-color:var(--gold); background:var(--gold-dim); }
        .qp-cnt-num { font-family:'Cinzel',serif; font-size:2rem; font-weight:900; color:var(--gold); min-width:60px; text-align:center; }
        .qp-cnt-lbl { font-size:.62rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); text-align:center; }

        /* Goal bar */
        .qp-goal-bar { height:8px; border-radius:8px; background:var(--glass2); overflow:hidden; margin:8px 0 4px; }
        .qp-goal-fill { height:100%; border-radius:8px; background:linear-gradient(90deg,var(--teal),var(--emerald)); transition:width .8s ease; }

        /* Goal buttons */
        .qp-goal-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-bottom:12px; }
        .qp-goal-btn {
          padding:11px 12px; border-radius:12px; border:1px solid var(--border);
          background:var(--card-bg); cursor:pointer; transition:all .22s;
          display:flex; align-items:center; gap:8px;
          font-family:'Nunito',sans-serif; font-size:.78rem; color:var(--muted); font-weight:600;
        }
        .qp-goal-btn:hover { border-color:var(--gold); color:var(--text); }
        .qp-goal-btn.on { background:var(--gold-dim); border-color:rgba(245,158,11,.5); color:var(--gold2); font-weight:700; }

        /* Log */
        .qp-log-list { max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:6px; }
        .qp-log-row {
          padding:10px 14px; border-radius:11px; font-size:.8rem;
          background:var(--prayer-bg); border:1px solid var(--border);
          display:flex; justify-content:space-between; align-items:center; color:var(--text);
        }

        /* Ayah card */
        .qp-ayah {
          padding:20px 24px; border-radius:18px; margin-bottom:16px;
          background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(99,102,241,0.02));
          border:1px solid rgba(99,102,241,0.25); text-align:center;
        }
        .qp-ayah-ar { font-family:'Scheherazade New',serif; font-size:1.6rem; color:var(--gold2); direction:rtl; line-height:1.9; margin-bottom:10px; }
        .qp-ayah-en { font-style:italic; font-size:.85rem; color:var(--muted); line-height:1.6; border-left:2px solid rgba(99,102,241,0.4); padding-left:12px; text-align:left; }
        .qp-ayah-ref { font-size:.65rem; letter-spacing:2px; color:var(--indigo); text-transform:uppercase; margin-top:8px; }

        /* Inputs */
        .qp-inp {
          width:100%; padding:10px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; box-sizing:border-box; transition:border-color .22s; margin-bottom:8px;
        }
        .qp-inp:focus { border-color:var(--gold); }
        .qp-inp::placeholder { color:var(--inp-placeholder); }
        .qp-ta { width:100%; padding:11px 13px; border-radius:10px; background:var(--inp-bg); border:1px solid var(--border); color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem; outline:none; box-sizing:border-box; resize:none; transition:border-color .22s; }
        .qp-ta:focus { border-color:var(--gold); }
        .qp-ta::placeholder { color:var(--inp-placeholder); }

        /* Button */
        .qp-btn {
          padding:10px 18px; border-radius:10px; border:none;
          background:linear-gradient(135deg,var(--amber),var(--gold));
          color:#06040f; font-weight:800; font-size:.8rem;
          font-family:'Nunito',sans-serif; cursor:pointer;
          display:inline-flex; align-items:center; gap:6px;
          transition:all .22s; letter-spacing:.5px;
        }
        .qp-btn:hover { transform:translateY(-1px); box-shadow:0 5px 14px var(--gold-glow); }
        .qp-btn.full { width:100%; justify-content:center; }

        .qp-lbl { display:block; font-size:.65rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
        .qp-empty { text-align:center; color:var(--muted); font-size:.82rem; padding:18px 0; }
        .qp-div { height:1px; background:var(--border); margin:14px 0; }

        @media(max-width:960px){ .qp-r2,.qp-r3 { grid-template-columns:1fr; } }
        @media(max-width:600px){ .qp-juz-grid { grid-template-columns:repeat(5,1fr); } }
      `}</style>

      <div className="qp view-wrap">

        {/* Hero */}
        <div className="qp-hero">
          <div>
            <div className="qp-title">Quran Progress</div>
            <div className="qp-sub">Track your Ramadan Khatm journey · {pct}% complete</div>
          </div>
          <div className="qp-chips">
            {[
              { n:`${juzFull}/30`,   l:"Juz Done"    },
              { n:`${totalPages}`,   l:"Pages"        },
              { n:`${pct}%`,         l:"Complete"     },
              { n:`${todayPages}`,   l:"Today Pages"  },
              { n:`${goalPct}%`,     l:"Daily Goal"   },
            ].map((c,i) => (
              <div className="qp-chip" key={i}>
                <div className="qp-chip-n">{c.n}</div>
                <div className="qp-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ayah of the day */}
        <div className="qp-ayah">
          <div className="qp-ayah-ar">{ayahOfDay.ar}</div>
          <div className="qp-ayah-en">"{ayahOfDay.en}"</div>
          <div className="qp-ayah-ref">Surah {ayahOfDay.ref}</div>
        </div>

        {/* Tabs */}
        <div className="qp-tabs">
          <button className={`qp-tab${tab==="progress"?" on":""}`} onClick={()=>setTab("progress")}>
            <IcoChart/> Progress
          </button>
          <button className={`qp-tab${tab==="juz"?" on":""}`} onClick={()=>setTab("juz")}>
            <IcoMap/> Juz Map
          </button>
          <button className={`qp-tab${tab==="log"?" on":""}`} onClick={()=>setTab("log")}>
            <IcoLog/> Daily Log
          </button>
        </div>

        {/* ── TAB: PROGRESS ── */}
        {tab === "progress" && (
          <div className="qp-r2">

            {/* Circle + motivation */}
            <div className="qp-card">
              <div className="qp-card-hd">
                <div className="qp-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoBook/></div>
                Overall Progress
              </div>
              <div className="qp-circle-wrap">
                <CircleProgress value={pct} max={100} size={180} color="#f59e0b">
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:"2.2rem",fontWeight:900,color:"var(--gold)",lineHeight:1}}>{pct}%</div>
                  <div style={{fontSize:".65rem",color:"var(--muted)",marginTop:4,letterSpacing:1}}>COMPLETE</div>
                </CircleProgress>
                <div className="qp-motivation">{motivation}</div>
              </div>

              {/* Page counter */}
              <div className="qp-div"/>
              <div style={{textAlign:"center"}}>
                <div className="qp-lbl" style={{textAlign:"center"}}>Log Today's Pages</div>
                <div className="qp-page-counter">
                  <button className="qp-cnt-btn" onClick={()=>logToday(-1)}><Minus/></button>
                  <div>
                    <div className="qp-cnt-num">{todayPages}</div>
                    <div className="qp-cnt-lbl">pages today</div>
                  </div>
                  <button className="qp-cnt-btn" onClick={()=>logToday(1)}><Plus/></button>
                </div>
                <div style={{fontSize:".7rem",color:"var(--muted)"}}>
                  Goal: {goalObj?.pages} pages/day ({goalObj?.label})
                </div>
                <div className="qp-goal-bar">
                  <div className="qp-goal-fill" style={{width:`${goalPct}%`}}/>
                </div>
                <div style={{fontSize:".65rem",color:"var(--teal2)",fontWeight:700}}>
                  {goalPct}% of daily goal
                </div>
              </div>
            </div>

            {/* Settings + notes */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* Daily Goal */}
              <div className="qp-card">
                <div className="qp-card-hd">
                  <div className="qp-ico" style={{background:"rgba(16,185,129,0.15)",color:"var(--emerald)"}}><IcoTarget/></div>
                  Daily Goal
                </div>
                <div className="qp-goal-grid">
                  {DAILY_GOALS.map(g => (
                    <button key={g.key} className={`qp-goal-btn${goal===g.key?" on":""}`}
                      onClick={async()=>{setGoal(g.key); await setDoc(doc(db,"quranProgress",user.uid),{uid:user.uid,juz,pages,surah,ayah,notes,goal:g.key,pct,log,updatedAt:new Date().toISOString()});}}>
                      <span>{g.icon}</span>{g.label}
                      {goal===g.key && <span style={{marginLeft:"auto",color:"var(--gold)"}}><Chk/></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmark */}
              <div className="qp-card">
                <div className="qp-card-hd">
                  <div className="qp-ico" style={{background:"rgba(99,102,241,0.15)",color:"var(--indigo)"}}><IcoMark/></div>
                  Bookmark
                </div>
                <label className="qp-lbl">Current Surah</label>
                <select className="qp-inp" value={surah} onChange={e=>setSurah(e.target.value)}>
                  <option value="">Select Surah…</option>
                  {SURAHS.map((s,i) => <option key={i} value={s}>{i+1}. {s}</option>)}
                </select>
                <label className="qp-lbl">Ayah Number</label>
                <input className="qp-inp" type="number" placeholder="e.g. 141"
                  value={ayah} onChange={e=>setAyah(e.target.value)}/>
                <label className="qp-lbl">Notes / Reflections</label>
                <textarea className="qp-ta" rows={3}
                  placeholder="Ayahs that touched your heart, duas, insights…"
                  value={notes} onChange={e=>setNotes(e.target.value)}/>
                <button className="qp-btn full" style={{marginTop:10}} onClick={()=>save()}>
                  <Save/> Save Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: JUZ MAP ── */}
        {tab === "juz" && (
          <div className="qp-card">
            <div className="qp-card-hd">
              <div className="qp-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoMap/></div>
              30-Juz Roadmap
              <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>
                {juzFull}/30 complete
              </span>
            </div>
            <div className="qp-juz-grid">
              {Array.from({length:30},(_,i)=>i+1).map(j => (
                <div key={j}
                  className={`qp-juz-cell${j<=juzFull?" done":""}${j===juzFull+1?" current":""}`}
                  onClick={async()=>{
                    const nj = j <= juzFull ? j-1 : j;
                    setJuz(nj); setPages(0);
                    await setDoc(doc(db,"quranProgress",user.uid),{uid:user.uid,juz:nj,pages:0,surah,ayah,notes,goal,pct:Math.round((nj/30)*100),log,updatedAt:new Date().toISOString()});
                    setToast(`Juz ${nj} marked! MashaAllah 🎉`);
                  }}>
                  <div className="qp-juz-num">{j}</div>
                  {j <= juzFull
                    ? <div className="qp-juz-chk"><Chk/></div>
                    : <div style={{fontSize:".5rem",color:"var(--muted)",textAlign:"center",lineHeight:1.2}}>
                        {JUZ_NAMES[j-1]?.split(" ")[0]}
                      </div>
                  }
                </div>
              ))}
            </div>
            <div style={{marginTop:16,display:"flex",gap:16,flexWrap:"wrap",fontSize:".72rem",color:"var(--muted)"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:12,height:12,borderRadius:3,background:"var(--gold-dim)",border:"1px solid rgba(245,158,11,0.4)"}}/>
                Completed
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:12,height:12,borderRadius:3,border:"2px solid var(--gold)",background:"var(--gold-dim)"}}/>
                Current
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:12,height:12,borderRadius:3,background:"var(--prayer-bg)",border:"1px solid var(--border)"}}/>
                Remaining
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: DAILY LOG ── */}
        {tab === "log" && (
          <div className="qp-r2">
            <div className="qp-card">
              <div className="qp-card-hd">
                <div className="qp-ico" style={{background:"rgba(99,102,241,0.15)",color:"var(--indigo)"}}><IcoLog/></div>
                Reading Log
              </div>
              <div className="qp-log-list">
                {[...log].reverse().map((l,i) => (
                  <div key={i} className="qp-log-row">
                    <div>
                      <div style={{fontWeight:700,fontSize:".82rem",color:"var(--text)"}}>{l.date}</div>
                      {l.surah && <div style={{fontSize:".7rem",color:"var(--muted)"}}>{l.surah}</div>}
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:"var(--gold)",fontWeight:800,fontFamily:"'Cinzel',serif"}}>{l.pages}</div>
                      <div style={{fontSize:".6rem",color:"var(--muted)"}}>pages</div>
                    </div>
                  </div>
                ))}
                {log.length===0 && <div className="qp-empty">No pages logged yet — start reading! 📖</div>}
              </div>
            </div>
            <div className="qp-card">
              <div className="qp-card-hd">
                <div className="qp-ico" style={{background:"rgba(16,185,129,0.15)",color:"var(--emerald)"}}><IcoChart/></div>
                Stats
              </div>
              {[
                { label:"Total Pages Read",   val: totalPages },
                { label:"Total Juz Complete", val: `${juzFull}/30` },
                { label:"Days Logged",        val: log.length },
                { label:"Avg Pages / Day",    val: log.length ? Math.round(log.reduce((a,l)=>a+(l.pages||0),0)/log.length) : 0 },
                { label:"Best Day",           val: log.length ? Math.max(...log.map(l=>l.pages||0))+" pages" : "—" },
                { label:"Current Surah",      val: surah || "Not set" },
              ].map((s,i) => (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:".8rem",color:"var(--muted)"}}>{s.label}</span>
                  <span style={{fontSize:".85rem",fontWeight:700,color:"var(--text)"}}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
    </>
  );
}