// src/views/Journal.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const MOODS = [
  { emoji:"🌟", label:"Blessed"    },
  { emoji:"🤲", label:"Grateful"   },
  { emoji:"😌", label:"Peaceful"   },
  { emoji:"💪", label:"Strong"     },
  { emoji:"😔", label:"Low"        },
  { emoji:"🥺", label:"Emotional"  },
  { emoji:"✨", label:"Inspired"   },
  { emoji:"🌙", label:"Reflective" },
];

const PROMPTS = [
  "What blessing am I most grateful for today?",
  "How did Allah help me through a difficulty today?",
  "What deed did I do today that I hope Allah accepts?",
  "What ayah or hadith touched my heart this Ramadan?",
  "Who am I grateful for in my life right now?",
  "What is one change I want to make after Ramadan?",
  "Describe a moment today that felt like a sign from Allah.",
  "What am I asking Allah for with full hope?",
  "What makes this Ramadan different from last year?",
  "Write a letter to yourself to read after Eid.",
];

const EMOJIS = ["❤️","🤲","🌙","☀️","🙏","✨","💎","🌸","🤍","🕊️","🌿","⭐"];

// SVG Icons
const IcoPen    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoHeart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoTrash  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const IcoSave   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IcoSpark  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoBook   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoClock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoPray   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IcoFlag   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
const IcoChk    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const START = new Date("2026-02-20");
function getTodayDay() {
  return Math.min(30, Math.max(1, Math.round((new Date() - START) / 86400000) + 1));
}

export default function Journal() {
  const { user }  = useAuth();
  const todayStr  = new Date().toDateString();
  const todayDay  = getTodayDay();

  const [tab,        setTab]        = useState("journal"); // journal | duas | history
  const [text,       setText]       = useState("");
  const [mood,       setMood]       = useState("");
  const [savedToday, setSavedToday] = useState(null); // {text, mood, prompt}
  const [history,    setHistory]    = useState([]);
  const [duas,       setDuas]       = useState([]);
  const [newDua,     setNewDua]     = useState("");
  const [duaPriority,setDuaPriority]= useState("normal");
  const [prompt,     setPrompt]     = useState(PROMPTS[getTodayDay() % PROMPTS.length]);
  const [toast,      setToast]      = useState("");
  const [streak,     setStreak]     = useState(0);
  const [charCount,  setCharCount]  = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "gratitude", `${user.uid}_${todayStr}`));
        if (snap.exists()) {
          const d = snap.data();
          setSavedToday({ text: d.text||"", mood: d.mood||"", prompt: d.prompt||"" });
          setMood(d.mood || "");
        }
        const duaSnap = await getDoc(doc(db, "journalDuas", user.uid));
        if (duaSnap.exists()) setDuas(duaSnap.data().list || []);

        const past = [];
        let s = 0;
        for (let i = 1; i <= 14; i++) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const key = `${user.uid}_${d.toDateString()}`;
          const snap2 = await getDoc(doc(db, "gratitude", key));
          if (snap2.exists()) {
            past.push({ date: d.toDateString(), ...snap2.data() });
            if (i <= s + 1) s = i;
          }
        }
        setHistory(past);
        setStreak(s);
      } catch(e) { console.warn(e); }
    })();
  }, [user]);

  const saveGratitude = async () => {
    if (!text.trim()) return;
    const entry = { uid:user.uid, date:todayStr, text:text.trim(), mood, prompt, savedAt:new Date().toISOString() };
    await setDoc(doc(db, "gratitude", `${user.uid}_${todayStr}`), entry);
    setSavedToday(entry);
    setHistory(h => [{ date:todayStr, ...entry }, ...h.filter(x => x.date !== todayStr)]);
    setText(""); setCharCount(0);
    setToast("Gratitude saved! Alhamdulillah 🌙");
  };

  const addDua = async () => {
    if (!newDua.trim()) return;
    const next = [...duas, { text:newDua.trim(), priority:duaPriority, done:false, addedAt:new Date().toDateString() }];
    setDuas(next); setNewDua(""); setDuaPriority("normal");
    await setDoc(doc(db, "journalDuas", user.uid), { list:next, uid:user.uid });
  };

  const toggleDua = async (i) => {
    const next = duas.map((d,idx) => idx===i ? {...d, done:!d.done} : d);
    setDuas(next);
    await setDoc(doc(db, "journalDuas", user.uid), { list:next, uid:user.uid });
    if (!duas[i].done) setToast("Dua answered — Alhamdulillah! 🤲");
  };

  const removeDua = async (i) => {
    const next = duas.filter((_,idx) => idx!==i);
    setDuas(next);
    await setDoc(doc(db, "journalDuas", user.uid), { list:next, uid:user.uid });
  };

  const duasDone   = duas.filter(d => d.done).length;
  const highDuas   = duas.filter(d => d.priority==="high" && !d.done).length;

  return (
    <>
      <style>{`
        .jnl { width:100%; box-sizing:border-box; }

        /* Hero */
        .jnl-hero {
          padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(13,148,136,0.1),rgba(13,148,136,0.02));
          border:1px solid rgba(13,148,136,0.25);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .jnl-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--teal2); letter-spacing:2px; }
        .jnl-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .jnl-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .jnl-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:66px; }
        .jnl-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--teal2); }
        .jnl-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .jnl-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .jnl-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .jnl-tab:hover { color:var(--text); }
        .jnl-tab.on { background:rgba(13,148,136,0.15); color:var(--teal2); border:1px solid rgba(13,148,136,0.3); }

        /* Layout */
        .jnl-r2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }

        /* Card */
        .jnl-card {
          padding:22px 24px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .jnl-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(13,148,136,0.3),transparent); }
        .jnl-card-hd { font-family:'Cinzel',serif; font-size:.76rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--teal2); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .jnl-ico { width:27px; height:27px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        /* Mood selector */
        .jnl-moods { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
        .jnl-mood {
          padding:6px 11px; border-radius:10px; border:1px solid var(--border);
          background:var(--card-bg); cursor:pointer; transition:all .22s;
          font-family:'Nunito',sans-serif; font-size:.72rem; color:var(--muted);
          display:flex; align-items:center; gap:5px;
        }
        .jnl-mood:hover  { border-color:var(--teal); color:var(--text); }
        .jnl-mood.on { background:rgba(13,148,136,0.12); border-color:rgba(13,148,136,0.4); color:var(--teal2); font-weight:700; }

        /* Prompt box */
        .jnl-prompt {
          padding:12px 16px; border-radius:12px; margin-bottom:12px;
          background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2);
          font-size:.82rem; color:var(--muted); font-style:italic; line-height:1.6;
          display:flex; align-items:flex-start; gap:10px;
        }
        .jnl-prompt-icon { color:var(--indigo); flex-shrink:0; margin-top:2px; }

        /* Emoji picker */
        .jnl-emojis { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
        .jnl-emoji-btn {
          width:34px; height:34px; border-radius:9px; border:1px solid var(--border);
          background:var(--card-bg); cursor:pointer; font-size:1rem; transition:all .2s;
          display:flex; align-items:center; justify-content:center;
        }
        .jnl-emoji-btn:hover { border-color:var(--teal); transform:scale(1.12); background:rgba(13,148,136,0.1); }

        /* Textarea */
        .jnl-ta {
          width:100%; padding:13px 15px; border-radius:12px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.9rem;
          outline:none; box-sizing:border-box; resize:none; transition:border-color .22s;
          line-height:1.7;
        }
        .jnl-ta:focus { border-color:var(--teal); }
        .jnl-ta::placeholder { color:var(--inp-placeholder); }

        /* Char count */
        .jnl-charcount { text-align:right; font-size:.65rem; color:var(--muted); margin:4px 0 10px; }

        /* Saved today */
        .jnl-saved {
          margin-top:16px; padding:14px 18px; border-radius:14px;
          background:rgba(13,148,136,0.08); border:1px solid rgba(13,148,136,0.22);
        }
        .jnl-saved-lbl { font-size:.6rem; letter-spacing:2px; text-transform:uppercase; color:var(--teal2); margin-bottom:6px; display:flex; align-items:center; gap:6px; }
        .jnl-saved-text { font-size:.88rem; line-height:1.7; color:var(--text); opacity:.9; }

        /* History */
        .jnl-history { display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto; }
        .jnl-hist-row {
          padding:14px 16px; border-radius:13px;
          background:var(--prayer-bg); border:1px solid var(--border);
          transition:background .2s;
        }
        .jnl-hist-row:hover { background:var(--dua-row-hover); }
        .jnl-hist-meta { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
        .jnl-hist-date { font-size:.65rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); }
        .jnl-hist-mood { font-size:.9rem; }
        .jnl-hist-text { font-size:.84rem; line-height:1.6; color:var(--text); opacity:.85; }
        .jnl-hist-prompt { font-size:.72rem; color:var(--muted); font-style:italic; margin-top:5px; opacity:.7; }

        /* Duas */
        .jnl-dua-inp-row { display:flex; gap:7px; margin-bottom:10px; align-items:center; flex-wrap:wrap; }
        .jnl-inp {
          flex:1; min-width:160px; padding:10px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; transition:border-color .22s;
        }
        .jnl-inp:focus { border-color:var(--teal); }
        .jnl-inp::placeholder { color:var(--inp-placeholder); }
        .jnl-sel {
          padding:10px 11px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.82rem;
          outline:none; cursor:pointer;
        }
        .jnl-duas { display:flex; flex-direction:column; gap:7px; max-height:360px; overflow-y:auto; }
        .jnl-dua-row {
          display:flex; align-items:center; gap:10px;
          padding:11px 14px; border-radius:13px;
          background:var(--dua-row-bg); border:1px solid var(--border);
          transition:all .22s;
        }
        .jnl-dua-row:hover { background:var(--dua-row-hover); }
        .jnl-dua-row.high { background:rgba(244,63,94,0.05); border-color:rgba(244,63,94,0.2); }
        .jnl-dua-row.done-row { opacity:.5; }
        .jnl-dua-chk {
          width:20px; height:20px; border-radius:6px; border:2px solid var(--border);
          flex-shrink:0; display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s; color:transparent;
        }
        .jnl-dua-chk.on { background:var(--teal); border-color:var(--teal); color:#fff; }
        .jnl-dua-txt { flex:1; font-size:.84rem; color:var(--text); }
        .jnl-dua-txt.done { text-decoration:line-through; opacity:.5; }
        .jnl-dua-flag { flex-shrink:0; color:var(--rose); }
        .jnl-dua-del { background:none; border:none; cursor:pointer; color:var(--muted); padding:3px; border-radius:4px; display:flex; transition:color .2s; }
        .jnl-dua-del:hover { color:var(--rose); }

        /* Button */
        .jnl-btn {
          padding:10px 18px; border-radius:10px; border:none;
          background:linear-gradient(135deg,var(--teal),#0f766e);
          color:#fff; font-weight:800; font-size:.8rem;
          font-family:'Nunito',sans-serif; cursor:pointer;
          display:inline-flex; align-items:center; gap:6px;
          transition:all .22s; letter-spacing:.5px;
        }
        .jnl-btn:hover { transform:translateY(-1px); box-shadow:0 5px 14px rgba(13,148,136,.35); }
        .jnl-btn.full { width:100%; justify-content:center; }
        .jnl-btn.sm   { padding:9px 12px; }
        .jnl-btn.gold {
          background:linear-gradient(135deg,var(--amber),var(--gold));
          color:#06040f;
        }
        .jnl-btn.gold:hover { box-shadow:0 5px 14px var(--gold-glow); }

        /* Divider */
        .jnl-div { height:1px; background:var(--border); margin:14px 0; }
        .jnl-lbl { display:block; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
        .jnl-empty { text-align:center; color:var(--muted); font-size:.82rem; padding:20px 0; }

        @media(max-width:960px){ .jnl-r2 { grid-template-columns:1fr; } }
      `}</style>

      <div className="jnl view-wrap">

        {/* Hero */}
        <div className="jnl-hero">
          <div>
            <div className="jnl-title">Gratitude Journal</div>
            <div className="jnl-sub">Day {todayDay} of Ramadan · Soul & Heart</div>
          </div>
          <div className="jnl-chips">
            {[
              { n:streak>0?`${streak}🔥`:"—",   l:"Streak"    },
              { n:history.length,                l:"Entries"   },
              { n:duas.length,                   l:"Duas"      },
              { n:`${duasDone}`,                 l:"Answered"  },
              { n:highDuas>0?`${highDuas}🔴`:"0",l:"Urgent"   },
            ].map((c,i) => (
              <div className="jnl-chip" key={i}>
                <div className="jnl-chip-n">{c.n}</div>
                <div className="jnl-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="jnl-tabs">
          <button className={`jnl-tab${tab==="journal"?" on":""}`} onClick={()=>setTab("journal")}>
            <IcoPen/> Journal
          </button>
          <button className={`jnl-tab${tab==="duas"?" on":""}`} onClick={()=>setTab("duas")}>
            <IcoPray/> Duas
          </button>
          <button className={`jnl-tab${tab==="history"?" on":""}`} onClick={()=>setTab("history")}>
            <IcoClock/> History
          </button>
        </div>

        {/* ── TAB: JOURNAL ── */}
        {tab === "journal" && (
          <div className="jnl-r2">

            {/* Write Entry */}
            <div className="jnl-card">
              <div className="jnl-card-hd">
                <div className="jnl-ico" style={{background:"rgba(13,148,136,0.15)",color:"var(--teal2)"}}><IcoPen/></div>
                Today's Entry
                <span style={{marginLeft:"auto",fontSize:".65rem",color:"var(--muted)",fontFamily:"'Nunito',sans-serif"}}>{todayStr}</span>
              </div>

              {/* Mood */}
              <div className="jnl-lbl">How are you feeling?</div>
              <div className="jnl-moods">
                {MOODS.map(m => (
                  <button key={m.emoji} className={`jnl-mood${mood===m.emoji?" on":""}`}
                    onClick={()=>setMood(mood===m.emoji?"":m.emoji)}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>

              {/* Writing prompt */}
              <div className="jnl-prompt">
                <span className="jnl-prompt-icon"><IcoSpark/></span>
                <span>
                  <strong style={{color:"var(--indigo)",fontSize:".7rem",letterSpacing:1,textTransform:"uppercase"}}>Prompt · Day {todayDay}</strong>
                  <br/>{prompt}
                </span>
              </div>

              {/* Emoji picker */}
              <div className="jnl-lbl">Add to your entry</div>
              <div className="jnl-emojis">
                {EMOJIS.map(e => (
                  <button key={e} className="jnl-emoji-btn" onClick={()=>setText(t=>t+e)}>{e}</button>
                ))}
              </div>

              <textarea className="jnl-ta" rows={6}
                placeholder="Alhamdulillah for... Today I felt... I ask Allah for..."
                value={text}
                onChange={e=>{setText(e.target.value);setCharCount(e.target.value.length);}}
                maxLength={500}/>
              <div className="jnl-charcount">{charCount}/500</div>

              <button className="jnl-btn full" onClick={saveGratitude}>
                <IcoSave/> Save Today's Entry
              </button>

              {savedToday && (
                <div className="jnl-saved">
                  <div className="jnl-saved-lbl">
                    <IcoChk/> Saved Today {savedToday.mood && <span style={{marginLeft:4}}>{savedToday.mood}</span>}
                  </div>
                  <div className="jnl-saved-text">{savedToday.text}</div>
                </div>
              )}
            </div>

            {/* Prompt Explorer + Stats */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* All prompts */}
              <div className="jnl-card">
                <div className="jnl-card-hd">
                  <div className="jnl-ico" style={{background:"rgba(99,102,241,0.15)",color:"var(--indigo)"}}><IcoBook/></div>
                  Reflection Prompts
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto"}}>
                  {PROMPTS.map((p,i) => (
                    <div key={i}
                      style={{
                        padding:"9px 13px",borderRadius:11,cursor:"pointer",
                        background:prompt===p?"rgba(99,102,241,0.1)":"var(--prayer-bg)",
                        border:`1px solid ${prompt===p?"rgba(99,102,241,0.35)":"var(--border)"}`,
                        fontSize:".8rem",color:prompt===p?"var(--text)":"var(--muted)",
                        transition:"all .2s",lineHeight:1.5,
                      }}
                      onClick={()=>setPrompt(p)}>
                      {prompt===p && <span style={{color:"var(--indigo)",marginRight:6,fontSize:".7rem"}}>▶</span>}
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="jnl-card">
                <div className="jnl-card-hd">
                  <div className="jnl-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoStar/></div>
                  Journey Stats
                </div>
                {[
                  { label:"Days Journaled",    val:`${history.length} days` },
                  { label:"Writing Streak",    val:streak>0?`${streak} days 🔥`:"Start today!" },
                  { label:"Duas Made",         val:`${duas.length} total` },
                  { label:"Duas Answered",     val:`${duasDone} answered 🤲` },
                  { label:"Today's Mood",      val:mood||"Not set" },
                ].map((s,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                    <span style={{fontSize:".78rem",color:"var(--muted)"}}>{s.label}</span>
                    <span style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: DUAS ── */}
        {tab === "duas" && (
          <div className="jnl-r2">
            <div className="jnl-card">
              <div className="jnl-card-hd">
                <div className="jnl-ico" style={{background:"rgba(245,158,11,0.15)",color:"var(--gold)"}}><IcoHeart/></div>
                Personal Duas
                <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>
                  {duasDone}/{duas.length} answered
                </span>
              </div>

              <div className="jnl-dua-inp-row">
                <input className="jnl-inp" placeholder="A need, name, or wish for Allah…"
                  value={newDua} onChange={e=>setNewDua(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addDua()}/>
                <select className="jnl-sel" value={duaPriority} onChange={e=>setDuaPriority(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="high">🔴 Urgent</option>
                </select>
                <button className="jnl-btn sm gold" onClick={addDua}><IcoPlus/></button>
              </div>

              <div className="jnl-duas">
                {duas.filter(d=>!d.done).map((d,i) => (
                  <div key={i} className={`jnl-dua-row${d.priority==="high"?" high":""}`}>
                    <div className="jnl-dua-chk" onClick={()=>toggleDua(duas.indexOf(d))}>
                    </div>
                    {d.priority==="high" && <span className="jnl-dua-flag"><IcoFlag/></span>}
                    <span className="jnl-dua-txt">{d.text}</span>
                    <span style={{fontSize:".65rem",color:"var(--muted)"}}>{d.addedAt||""}</span>
                    <button className="jnl-dua-del" onClick={()=>removeDua(duas.indexOf(d))}><IcoTrash/></button>
                  </div>
                ))}
                {duas.filter(d=>d.done).length>0 && (
                  <>
                    <div className="jnl-div"/>
                    <div style={{fontSize:".62rem",letterSpacing:2,textTransform:"uppercase",color:"var(--teal2)",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                      <IcoChk/> Answered Duas — Alhamdulillah!
                    </div>
                    {duas.filter(d=>d.done).map((d,i) => (
                      <div key={i} className="jnl-dua-row done-row">
                        <div className="jnl-dua-chk on" onClick={()=>toggleDua(duas.indexOf(d))}><IcoChk/></div>
                        <span className="jnl-dua-txt done">{d.text}</span>
                        <button className="jnl-dua-del" onClick={()=>removeDua(duas.indexOf(d))}><IcoTrash/></button>
                      </div>
                    ))}
                  </>
                )}
                {duas.length===0 && <div className="jnl-empty">Your duas await — add them here 🌙<br/><span style={{fontSize:".75rem",opacity:.6}}>These will be in your sujood, inshaAllah 🤲</span></div>}
              </div>
            </div>

            {/* Duas tips */}
            <div className="jnl-card">
              <div className="jnl-card-hd">
                <div className="jnl-ico" style={{background:"rgba(13,148,136,0.15)",color:"var(--teal2)"}}><IcoSpark/></div>
                Best Times for Dua
              </div>
              {[
                { time:"Suhoor time",    tip:"Before Fajr — closest to Allah's descent",     icon:"🌄" },
                { time:"While fasting",  tip:"The dua of the fasting person is accepted",     icon:"🌙" },
                { time:"Before Iftaar",  tip:"Moments before breaking fast — a golden window", icon:"🌅" },
                { time:"In Sujood",      tip:"Closest position to Allah — pour your heart",    icon:"🤲" },
                { time:"Laylatul Qadr",  tip:"Better than 1000 months — use every moment",     icon:"✨" },
                { time:"Last 1/3 night", tip:"Allah descends — Who is calling Me?",            icon:"🌟" },
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
                  <span style={{fontSize:"1.1rem",flexShrink:0}}>{t.icon}</span>
                  <div>
                    <div style={{fontSize:".8rem",fontWeight:700,color:"var(--text)"}}>{t.time}</div>
                    <div style={{fontSize:".74rem",color:"var(--muted)",marginTop:2}}>{t.tip}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:14,padding:"12px 16px",borderRadius:12,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",textAlign:"center"}}>
                <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"1.3rem",color:"var(--gold2)",direction:"rtl",lineHeight:2}}>
                  اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                </div>
                <div style={{fontSize:".75rem",color:"var(--muted)",fontStyle:"italic",marginTop:4}}>
                  O Allah, You are Most Forgiving — forgive me.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HISTORY ── */}
        {tab === "history" && (
          <div className="jnl-r2">
            <div className="jnl-card" style={{gridColumn:"1/-1"}}>
              <div className="jnl-card-hd">
                <div className="jnl-ico" style={{background:"rgba(99,102,241,0.15)",color:"var(--indigo)"}}><IcoClock/></div>
                Past Entries
                <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--muted)",fontFamily:"'Nunito',sans-serif"}}>
                  {history.length} entries
                </span>
              </div>
              <div className="jnl-history">
                {history.map((h,i) => (
                  <div key={i} className="jnl-hist-row">
                    <div className="jnl-hist-meta">
                      <span className="jnl-hist-date">{h.date}</span>
                      {h.mood && <span className="jnl-hist-mood">{h.mood}</span>}
                    </div>
                    <div className="jnl-hist-text">{h.text}</div>
                    {h.prompt && <div className="jnl-hist-prompt">✦ {h.prompt}</div>}
                  </div>
                ))}
                {history.length===0 && <div className="jnl-empty">No past entries yet — start writing! 📖</div>}
              </div>
            </div>
          </div>
        )}

      </div>

      {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
    </>
  );
}