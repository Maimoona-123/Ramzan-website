// src/views/Tracker.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import CircleProgress from "../components/CircleProgress";
import Toast from "../components/Toast";

const PRAYERS = [
  { name:"Fajr",     time:"05:12", icon:"🌄" },
  { name:"Dhuhr",    time:"12:30", icon:"☀️"  },
  { name:"Asr",      time:"16:05", icon:"🌤️" },
  { name:"Maghrib",  time:"18:42", icon:"🌅" },
  { name:"Isha",     time:"20:08", icon:"🌙" },
  { name:"Taraweeh", time:"21:00", icon:"✨" },
];

const DEEDS = [
  { key:"quran",     label:"Quran Tilawat",   icon:"📖", pts:3 },
  { key:"fast",      label:"Kept Fast",       icon:"🌙", pts:5 },
  { key:"dhikr",     label:"Dhikr / Tasbih",  icon:"📿", pts:2 },
  { key:"tahajjud",  label:"Tahajjud",        icon:"🌟", pts:4 },
  { key:"kindness",  label:"Act of Kindness", icon:"🤝", pts:2 },
  { key:"istighfar", label:"Istighfar",       icon:"🤲", pts:2 },
];

const MOODS = [
  { emoji:"😌", label:"Peaceful"  },
  { emoji:"🤲", label:"Grateful"  },
  { emoji:"💪", label:"Strong"    },
  { emoji:"😔", label:"Low"       },
  { emoji:"✨", label:"Inspired"  },
  { emoji:"🥺", label:"Emotional" },
];

const START = new Date("2026-02-20");
function getTodayDay() {
  return Math.min(30, Math.max(1, Math.round((new Date() - START) / 86400000) + 1));
}

const Chk = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Plus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Trash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const Save = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

export default function Tracker() {
  const { user } = useAuth();
  const todayStr = new Date().toDateString();
  const docId    = `${user?.uid}_${todayStr}`;
  const todayDay = getTodayDay();

  const [prayers,     setPrayers]     = useState({});
  const [deeds,       setDeeds]       = useState({});
  const [sadaqah,     setSadaqah]     = useState({ amount:"", note:"" });
  const [sadaqahLog,  setSadaqahLog]  = useState([]);
  const [duas,        setDuas]        = useState([]);
  const [newDua,      setNewDua]      = useState("");
  const [mood,        setMood]        = useState("");
  const [niyyah,      setNiyyah]      = useState("");
  const [savedNiyyah, setSavedNiyyah] = useState("");
  const [saving,      setSaving]      = useState(false);
  const [justSaved,   setJustSaved]   = useState(false);
  const [toast,       setToast]       = useState("");
  const [streak,      setStreak]      = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "trackers", docId));
        if (snap.exists()) {
          const d = snap.data();
          setPrayers(d.prayers || {});
          setDeeds(d.deeds || {});
          setSadaqahLog(d.sadaqahLog || []);
          setMood(d.mood || "");
          setNiyyah(d.niyyah || "");
          setSavedNiyyah(d.niyyah || "");
        }
        const ds = await getDoc(doc(db, "duas", user.uid));
        if (ds.exists()) setDuas(ds.data().list || []);

        let s = 0;
        for (let i = todayDay; i >= 1; i--) {
          const d2 = new Date(START);
          d2.setDate(START.getDate() + i - 1);
          try {
            const ss = await getDoc(doc(db, "trackers", `${user.uid}_${d2.toDateString()}`));
            if (ss.exists() && Object.values(ss.data().prayers||{}).some(Boolean)) s++;
            else break;
          } catch { break; }
        }
        setStreak(s);
      } catch(e) { console.warn(e); }
    })();
  }, [user]);

  const save = async (ov = {}) => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "trackers", docId), {
        uid:user.uid, date:todayStr,
        prayers, deeds, sadaqahLog, mood, niyyah, ...ov
      }, { merge:true });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } catch(e) { console.warn(e); }
    setSaving(false);
  };

  const togglePrayer = async (name) => {
    const next = { ...prayers, [name]: !prayers[name] };
    setPrayers(next);
    await save({ prayers: next });
    if (!prayers[name]) setToast(`${name} prayed! MashaAllah 🌟`);
  };

  const toggleDeed = async (key) => {
    const next = { ...deeds, [key]: !deeds[key] };
    setDeeds(next);
    await save({ deeds: next });
    const d = DEEDS.find(x => x.key===key);
    if (!deeds[key]) setToast(`+${d.pts} pts — ${d.label} ✨`);
  };

  const saveSadaqah = async () => {
    if (!sadaqah.amount || Number(sadaqah.amount) <= 0) return;
    const entry = { ...sadaqah, time: new Date().toLocaleTimeString("en-PK",{hour:"2-digit",minute:"2-digit"}) };
    const next  = [...sadaqahLog, entry];
    setSadaqahLog(next); setSadaqah({ amount:"", note:"" });
    await save({ sadaqahLog: next });
    setToast("Sadaqah recorded! MashaAllah 🤲");
  };

  const saveNiyyah = async () => {
    setSavedNiyyah(niyyah);
    await save({ niyyah });
    setToast("Niyyah saved ✨");
  };

  const addDua = async () => {
    if (!newDua.trim()) return;
    const next = [...duas, { text: newDua.trim(), done: false }];
    setDuas(next); setNewDua("");
    await setDoc(doc(db, "duas", user.uid), { list:next, uid:user.uid });
  };
  const toggleDua = async (i) => {
    const next = duas.map((d,idx) => idx===i ? {...d,done:!d.done} : d);
    setDuas(next);
    await setDoc(doc(db, "duas", user.uid), { list:next, uid:user.uid });
  };
  const removeDua = async (i) => {
    const next = duas.filter((_,idx) => idx!==i);
    setDuas(next);
    await setDoc(doc(db, "duas", user.uid), { list:next, uid:user.uid });
  };

  const prayersDone  = PRAYERS.slice(0,5).filter(p => prayers[p.name]).length;
  const allP         = PRAYERS.filter(p => prayers[p.name]).length;
  const deedsDone    = DEEDS.filter(d => deeds[d.key]).length;
  const pts          = DEEDS.filter(d => deeds[d.key]).reduce((a,d)=>a+d.pts,0) + allP*2;
  const maxPts       = DEEDS.reduce((a,d)=>a+d.pts,0) + PRAYERS.length*2;
  const pct          = Math.round((pts/maxPts)*100);
  const duasDone     = duas.filter(d=>d.done).length;
  const totalSadaqah = sadaqahLog.reduce((a,s)=>a+Number(s.amount||0),0);

  return (
    <>
      <style>{`
        .tr { width:100%; box-sizing:border-box; }

        /* ── HERO ── */
        .tr-hero {
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:18px; padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg, var(--gold-dim), rgba(245,158,11,0.03));
          border:1px solid var(--card-border);
        }
        .tr-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; }
        .tr-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .tr-bar-wrap { margin-top:9px; min-width:210px; }
        .tr-bar-top  { display:flex; justify-content:space-between; font-size:.61rem; color:var(--muted); margin-bottom:3px; }
        .tr-bar      { height:7px; border-radius:8px; background:var(--glass2); overflow:hidden; }
        .tr-bar-fill { height:100%; border-radius:8px; background:linear-gradient(90deg,var(--amber),var(--gold),var(--emerald)); transition:width 1s ease; }
        .tr-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .tr-chip  {
          padding:9px 13px; border-radius:11px; text-align:center;
          background:var(--card-bg); border:1px solid var(--card-border); min-width:64px;
        }
        .tr-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--gold); }
        .tr-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* ── LAYOUTS ── */
        .tr-r2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
        .tr-r3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }

        /* ── CARD ── */
        .tr-card {
          padding:20px 22px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .tr-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,var(--card-border),transparent);
        }
        .tr-card-hd {
          font-family:'Cinzel',serif; font-size:.76rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; color:var(--gold2);
          margin-bottom:14px; display:flex; align-items:center; gap:8px;
        }
        .tr-ico {
          width:27px; height:27px; border-radius:8px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center; font-size:.9rem;
        }

        /* ── PRAYERS ── */
        .tr-pgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        .tr-p {
          padding:13px 8px; border-radius:12px;
          background:var(--prayer-bg); border:1px solid var(--border);
          cursor:pointer; transition:all .22s;
          display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center;
        }
        .tr-p:hover { border-color:var(--gold); background:var(--glass2); transform:translateY(-2px); }
        .tr-p.on {
          background:linear-gradient(135deg, var(--gold-dim), rgba(245,158,11,0.04));
          border-color:rgba(245,158,11,0.5);
        }
        .tr-p-e { font-size:1.25rem; }
        .tr-p-n { font-size:.7rem; font-weight:700; color:var(--text); }
        .tr-p-t { font-size:.58rem; color:var(--muted); }
        .tr-p-c {
          width:19px; height:19px; border-radius:5px;
          border:2px solid var(--border);
          display:flex; align-items:center; justify-content:center;
          color:transparent; transition:all .22s; margin-top:2px;
        }
        .tr-p.on .tr-p-c { background:var(--gold); border-color:var(--gold); color:#06040f; }

        /* ── DEEDS ── */
        .tr-dgrid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
        .tr-d {
          padding:10px 12px; border-radius:11px;
          background:var(--card-bg); border:1px solid var(--border);
          cursor:pointer; transition:all .22s;
          display:flex; align-items:center; gap:7px;
          font-family:'Nunito',sans-serif; font-size:.78rem;
          color:var(--muted); font-weight:600; text-align:left;
        }
        .tr-d:hover { border-color:var(--gold); color:var(--text); background:var(--glass2); }
        .tr-d.on {
          background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.4);
          color:var(--teal2); font-weight:700;
        }
        .tr-d-pts { margin-left:auto; font-size:.6rem; opacity:.55; }

        /* ── MOOD ── */
        .tr-moods { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
        .tr-mood {
          padding:6px 10px; border-radius:10px;
          background:var(--card-bg); border:1px solid var(--border);
          cursor:pointer; transition:all .22s;
          font-family:'Nunito',sans-serif; font-size:.72rem; color:var(--muted);
          display:flex; align-items:center; gap:5px;
        }
        .tr-mood:hover  { border-color:var(--gold); color:var(--text); }
        .tr-mood.on { background:var(--gold-dim); border-color:var(--gold); color:var(--text); }

        /* ── DIVIDER ── */
        .tr-div { height:1px; background:var(--border); margin:13px 0; }

        /* ── INPUTS ── */
        .tr-inp {
          width:100%; padding:10px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; box-sizing:border-box; transition:border-color .22s; margin-bottom:8px;
        }
        .tr-inp:focus { border-color:var(--gold); }
        .tr-inp::placeholder { color:var(--inp-placeholder); }

        .tr-ta {
          width:100%; padding:11px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; box-sizing:border-box; resize:none; transition:border-color .22s;
        }
        .tr-ta:focus { border-color:var(--gold); }
        .tr-ta::placeholder { color:var(--inp-placeholder); }

        /* ── BUTTONS ── */
        .tr-btn {
          padding:10px 16px; border-radius:10px; border:none;
          background:linear-gradient(135deg,var(--amber),var(--gold));
          color:#06040f; font-weight:800; font-size:.8rem;
          font-family:'Nunito',sans-serif; cursor:pointer;
          display:inline-flex; align-items:center; gap:6px;
          transition:all .22s; letter-spacing:.5px;
        }
        .tr-btn:hover { transform:translateY(-1px); box-shadow:0 5px 14px var(--gold-glow); }
        .tr-btn.full { width:100%; justify-content:center; }
        .tr-btn.sm   { padding:9px 12px; }

        /* ── SADAQAH LOG ── */
        .tr-slog { margin-top:10px; max-height:130px; overflow-y:auto; display:flex; flex-direction:column; gap:5px; }
        .tr-se {
          padding:8px 11px; border-radius:9px; font-size:.76rem;
          background:var(--gold-dim); border:1px solid rgba(245,158,11,0.2);
          display:flex; justify-content:space-between; align-items:center; color:var(--text);
        }

        /* ── DUA LIST ── */
        .tr-dua-inp-row { display:flex; gap:7px; margin-bottom:9px; }
        .tr-dua-inp {
          flex:1; padding:10px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; transition:border-color .22s;
        }
        .tr-dua-inp:focus { border-color:var(--gold); }
        .tr-dua-inp::placeholder { color:var(--inp-placeholder); }

        .tr-duas { max-height:195px; overflow-y:auto; display:flex; flex-direction:column; gap:6px; }
        .tr-dr {
          display:flex; align-items:center; gap:9px;
          padding:9px 12px; border-radius:11px;
          background:var(--dua-row-bg); border:1px solid var(--border);
          transition:background .2s;
        }
        .tr-dr:hover { background:var(--dua-row-hover); }
        .tr-dc {
          width:18px; height:18px; border-radius:5px;
          border:2px solid var(--border); flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s; color:transparent;
        }
        .tr-dc.on { background:var(--teal); border-color:var(--teal); color:#fff; }
        .tr-dt { flex:1; font-size:.82rem; color:var(--text); }
        .tr-dt.done { text-decoration:line-through; opacity:.4; }
        .tr-dd {
          background:none; border:none; cursor:pointer; color:var(--muted);
          padding:3px; border-radius:4px; display:flex; transition:color .2s;
        }
        .tr-dd:hover { color:var(--rose); }

        /* ── NIYYAH SAVED ── */
        .tr-niyyah-saved {
          margin-top:10px; font-style:italic; font-size:.8rem; color:var(--muted);
          border-left:2px solid var(--card-border); padding-left:10px; line-height:1.6;
        }

        /* ── EMPTY ── */
        .tr-empty { text-align:center; color:var(--muted); font-size:.8rem; padding:14px 0; }

        @media(max-width:960px){ .tr-r2,.tr-r3 { grid-template-columns:1fr; } }
        @media(max-width:600px){ .tr-pgrid { grid-template-columns:repeat(2,1fr); } .tr-dgrid { grid-template-columns:1fr; } }
      `}</style>

      <div className="tr view-wrap">

        {/* ── HERO ── */}
        <div className="tr-hero">
          <div>
            <div className="tr-title">Prayer Tracker</div>
            <div className="tr-sub">
              {todayStr} · Day {todayDay} of Ramadan · {saving ? "Saving…" : justSaved ? "✓ Saved" : "Auto-saved"}
            </div>
            <div className="tr-bar-wrap">
              <div className="tr-bar-top">
                <span>Ibadah Score</span>
                <span style={{color:"var(--gold)", fontWeight:700}}>{pts}/{maxPts} pts · {pct}%</span>
              </div>
              <div className="tr-bar"><div className="tr-bar-fill" style={{width:`${pct}%`}}/></div>
            </div>
          </div>
          <div className="tr-chips">
            {[
              {n:`${prayersDone}/5`, l:"Prayers"},
              {n:`${deedsDone}/6`,   l:"Deeds"},
              {n:`${streak}🔥`,      l:"Streak"},
              {n:`${duasDone}/${duas.length||0}`, l:"Duas"},
              {n:totalSadaqah>0?`₨${totalSadaqah}`:"—", l:"Sadaqah"},
            ].map((c,i) => (
              <div className="tr-chip" key={i}>
                <div className="tr-chip-n">{c.n}</div>
                <div className="tr-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 1: Prayers + Deeds & Mood ── */}
        <div className="tr-r2">

          <div className="tr-card">
            <div className="tr-card-hd">
              <div className="tr-ico" style={{background:"var(--gold-dim)"}}>🕌</div>
              Daily Prayers
              <span style={{marginLeft:"auto"}}>
                <CircleProgress value={allP} max={6} size={44} color="#f59e0b">
                  <span style={{fontSize:".78rem",fontWeight:900,color:"var(--gold)"}}>{allP}</span>
                </CircleProgress>
              </span>
            </div>
            <div className="tr-pgrid">
              {PRAYERS.map(p => (
                <div key={p.name} className={`tr-p${prayers[p.name]?" on":""}`} onClick={()=>togglePrayer(p.name)}>
                  <div className="tr-p-e">{p.icon}</div>
                  <div className="tr-p-n">{p.name}</div>
                  <div className="tr-p-t">{p.time}</div>
                  <div className="tr-p-c">{prayers[p.name]&&<Chk/>}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tr-card">
            <div className="tr-card-hd">
              <div className="tr-ico" style={{background:"rgba(16,185,129,0.15)"}}>⭐</div>
              Good Deeds
              <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>
                {pts} pts earned
              </span>
            </div>
            <div className="tr-dgrid">
              {DEEDS.map(d => (
                <button key={d.key} className={`tr-d${deeds[d.key]?" on":""}`} onClick={()=>toggleDeed(d.key)}>
                  <span style={{fontSize:".95rem"}}>{d.icon}</span>
                  {d.label}
                  <span className="tr-d-pts">+{d.pts}</span>
                  {deeds[d.key]&&<span style={{color:"var(--teal2)",marginLeft:2}}><Chk/></span>}
                </button>
              ))}
            </div>
            <div className="tr-div"/>
            <div style={{fontSize:".62rem",letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>
              How are you feeling?
            </div>
            <div className="tr-moods">
              {MOODS.map(m => (
                <button key={m.emoji} className={`tr-mood${mood===m.emoji?" on":""}`}
                  onClick={async()=>{setMood(m.emoji); await save({mood:m.emoji});}}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 2: Niyyah + Sadaqah + Duas ── */}
        <div className="tr-r3">

          <div className="tr-card">
            <div className="tr-card-hd">
              <div className="tr-ico" style={{background:"rgba(99,102,241,0.15)"}}>💜</div>
              Today's Niyyah
            </div>
            <textarea className="tr-ta" rows={4}
              placeholder="Set your intention for today's ibadah…"
              value={niyyah} onChange={e=>setNiyyah(e.target.value)}/>
            <button className="tr-btn full" style={{marginTop:8}} onClick={saveNiyyah}>
              <Save/> Save Niyyah
            </button>
            {savedNiyyah && <div className="tr-niyyah-saved">"{savedNiyyah}"</div>}
          </div>

          <div className="tr-card">
            <div className="tr-card-hd">
              <div className="tr-ico" style={{background:"rgba(251,191,36,0.15)"}}>💰</div>
              Sadaqah Log
              {totalSadaqah>0 && (
                <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--gold2)",fontFamily:"'Nunito',sans-serif"}}>
                  Total ₨{totalSadaqah}
                </span>
              )}
            </div>
            <input className="tr-inp" type="number" placeholder="Amount (PKR)"
              value={sadaqah.amount} onChange={e=>setSadaqah({...sadaqah,amount:e.target.value})}/>
            <input className="tr-inp" placeholder="For whom / purpose…"
              value={sadaqah.note} onChange={e=>setSadaqah({...sadaqah,note:e.target.value})}
              onKeyDown={e=>e.key==="Enter"&&saveSadaqah()}/>
            <button className="tr-btn full" onClick={saveSadaqah}><Plus/> Record Sadaqah</button>
            <div className="tr-slog">
              {sadaqahLog.map((s,i) => (
                <div key={i} className="tr-se">
                  <span><strong style={{color:"var(--gold)"}}>₨{s.amount}</strong> — {s.note||"No note"}</span>
                  <span style={{color:"var(--muted)",fontSize:".7rem"}}>{s.time}</span>
                </div>
              ))}
              {sadaqahLog.length===0 && <div className="tr-empty">No sadaqah logged yet 💝</div>}
            </div>
          </div>

          <div className="tr-card">
            <div className="tr-card-hd">
              <div className="tr-ico" style={{background:"rgba(13,148,136,0.15)"}}>🤲</div>
              Dua List
              {duas.length>0 && (
                <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>
                  {duasDone}/{duas.length} answered
                </span>
              )}
            </div>
            <div className="tr-dua-inp-row">
              <input className="tr-dua-inp" placeholder="Add a dua / name / need…"
                value={newDua} onChange={e=>setNewDua(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addDua()}/>
              <button className="tr-btn sm" onClick={addDua}><Plus/></button>
            </div>
            <div className="tr-duas">
              {duas.map((d,i) => (
                <div key={i} className="tr-dr">
                  <div className={`tr-dc${d.done?" on":""}`} onClick={()=>toggleDua(i)}>
                    {d.done&&<Chk/>}
                  </div>
                  <span className={`tr-dt${d.done?" done":""}`}>{d.text||d}</span>
                  <button className="tr-dd" onClick={()=>removeDua(i)}><Trash/></button>
                </div>
              ))}
              {duas.length===0 && <div className="tr-empty">Add duas to remember in sujood 🌙</div>}
            </div>
          </div>

        </div>
      </div>

      {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
    </>
  );
}