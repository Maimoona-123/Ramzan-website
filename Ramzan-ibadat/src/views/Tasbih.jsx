// src/views/Tasbih.jsx
import { useState, useEffect, useRef } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import CircleProgress from "../components/CircleProgress";

const DHIKRS = [
  { key:"subhanallah",   label:"SubḥānAllāh",        ar:"سُبْحَانَ اللّٰهِ",        en:"Glory be to Allah",          target:33, color:"#f59e0b", grad:"135deg,#b45309,#f59e0b" },
  { key:"alhamdulillah", label:"Alḥamdulillāh",      ar:"اَلْحَمْدُ لِلّٰهِ",       en:"All praise is for Allah",    target:33, color:"#10b981", grad:"135deg,#047857,#10b981" },
  { key:"allahuakbar",   label:"Allāhu Akbar",        ar:"اَللّٰهُ أَكْبَرُ",        en:"Allah is the Greatest",      target:34, color:"#6366f1", grad:"135deg,#4338ca,#6366f1" },
  { key:"astaghfirullah",label:"Astaghfirullāh",      ar:"أَسْتَغْفِرُ اللّٰهَ",     en:"I seek Allah's forgiveness", target:100,color:"#ec4899", grad:"135deg,#be185d,#ec4899" },
  { key:"laIlaha",       label:"Lā ilāha illallāh",   ar:"لَا إِلٰهَ إِلَّا اللّٰهُ",en:"There is no god but Allah",  target:100,color:"#14b8a6", grad:"135deg,#0f766e,#14b8a6" },
  { key:"salawat",       label:"Ṣalāt ʿan-Nabī",      ar:"اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ",en:"Blessings on the Prophet", target:100,color:"#a78bfa", grad:"135deg,#7c3aed,#a78bfa" },
];

const PRESETS = [
  { name:"After Fajr",       keys:["subhanallah","alhamdulillah","allahuakbar"], icon:"🌄" },
  { name:"After Every Salah",keys:["subhanallah","alhamdulillah","allahuakbar"], icon:"🕌" },
  { name:"Istighfar 100",    keys:["astaghfirullah"],                            icon:"🤲" },
  { name:"Kalimah 100",      keys:["laIlaha"],                                   icon:"☪️" },
];

// SVG Icons
const IcoReset  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>;
const IcoTrash  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoChart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoHeart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoZap    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoChk    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function Tasbih() {
  const { user }   = useAuth();
  const todayStr   = new Date().toDateString();
  const tapBtnRef  = useRef(null);

  const [selIdx,   setSelIdx]   = useState(0);
  const [counts,   setCounts]   = useState({});
  const [total,    setTotal]    = useState(0);
  const [tab,      setTab]      = useState("counter"); // counter | all | history
  const [sessions, setSessions] = useState([]); // [{date, counts, total}]
  const [ripple,   setRipple]   = useState(false);
  const [milestone,setMilestone]= useState("");

  const d     = DHIKRS[selIdx];
  const count = counts[d.key] || 0;
  const round = Math.floor(count / d.target);
  const inRound = count % d.target;
  const pct   = d.target > 0 ? (inRound / d.target) * 100 : 0;

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "tasbih", `${user.uid}_${todayStr}`));
        if (snap.exists()) {
          const data = snap.data();
          setCounts(data.counts || {});
          setTotal(data.total || 0);
        }
        // load last 7 days for history
        const hist = [];
        for (let i=1;i<=7;i++){
          const d2 = new Date(); d2.setDate(d2.getDate()-i);
          const k  = `${user.uid}_${d2.toDateString()}`;
          const s  = await getDoc(doc(db,"tasbih",k));
          if (s.exists()) hist.push({ date:d2.toDateString(), ...s.data() });
        }
        setSessions(hist);
      } catch(e){ console.warn(e); }
    })();
  }, [user]);

  const save = async (newCounts, newTotal) => {
    await setDoc(doc(db, "tasbih", `${user.uid}_${todayStr}`), {
      uid:user.uid, date:todayStr, counts:newCounts, total:newTotal,
    });
  };

  const tap = async () => {
    const newCount  = (counts[d.key]||0) + 1;
    const newCounts = { ...counts, [d.key]: newCount };
    const newTotal  = total + 1;
    setCounts(newCounts);
    setTotal(newTotal);
    setRipple(true);
    setTimeout(()=>setRipple(false), 300);
    if (navigator.vibrate) navigator.vibrate(15);

    // milestone check
    if (newCount === d.target) setMilestone(`${d.target} ${d.label} ✓ MashaAllah! 🌟`);
    else if (newCount === d.target * 3) setMilestone(`Tasbih-e-Fatima complete! 💎`);
    else if (newCount % 100 === 0 && newCount > 0) setMilestone(`${newCount} counted! SubhanAllah! ✨`);
    else setMilestone("");

    await save(newCounts, newTotal);
  };

  const resetOne = async () => {
    const newCounts = { ...counts, [d.key]: 0 };
    setCounts(newCounts);
    await save(newCounts, total);
  };

  const clearAll = async () => {
    const empty = {};
    DHIKRS.forEach(dh => empty[dh.key]=0);
    setCounts(empty); setTotal(0);
    await save(empty, 0);
  };

  const statusMsg =
    count >= d.target * 3 ? "Tasbih-e-Fatima complete — SubhanAllah, Alhamdulillah, Allahu Akbar 💎" :
    count >= d.target * 2 ? `${round} rounds complete — your pen is not lifted! 🌙` :
    count >= d.target     ? `First round done — ${round} round(s) complete 🤲` :
    count > 0             ? `${d.target - inRound} more to complete this round ✨` :
    "Tap to begin — every dhikr is a tree in Jannah 🌿";

  const totalToday = Object.values(counts).reduce((a,v)=>a+(v||0),0);

  return (
    <>
      <style>{`
        .tsb { width:100%; box-sizing:border-box; }

        /* Hero */
        .tsb-hero {
          padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(99,102,241,0.02));
          border:1px solid rgba(99,102,241,0.25);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .tsb-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:#a78bfa; letter-spacing:2px; }
        .tsb-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .tsb-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .tsb-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:66px; }
        .tsb-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:#a78bfa; }
        .tsb-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .tsb-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .tsb-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .tsb-tab:hover { color:var(--text); }
        .tsb-tab.on { background:rgba(99,102,241,0.12); color:#a78bfa; border:1px solid rgba(99,102,241,0.3); }

        /* Layout */
        .tsb-r2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }

        /* Card */
        .tsb-card {
          padding:22px 24px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .tsb-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent); }
        .tsb-card-hd { font-family:'Cinzel',serif; font-size:.76rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#a78bfa; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .tsb-ico { width:27px; height:27px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        /* Dhikr selector chips */
        .tsb-dhikr-chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; justify-content:center; }
        .tsb-dhikr-chip {
          padding:8px 16px; border-radius:50px; border:1.5px solid var(--border);
          background:var(--card-bg); cursor:pointer; transition:all .22s;
          font-family:'Nunito',sans-serif; font-size:.78rem; color:var(--muted); font-weight:700;
        }
        .tsb-dhikr-chip:hover { color:var(--text); transform:translateY(-1px); }

        /* Counter center */
        .tsb-counter-center { display:flex; flex-direction:column; align-items:center; gap:16px; }
        .tsb-arabic { font-family:'Scheherazade New',serif; font-size:2.4rem; color:var(--gold2); direction:rtl; text-align:center; line-height:1.5; }
        .tsb-english { font-size:.82rem; color:var(--muted); font-style:italic; text-align:center; }

        /* TAP button */
        .tsb-tap-wrap { position:relative; display:inline-flex; align-items:center; justify-content:center; }
        .tsb-tap {
          width:160px; height:160px; border-radius:50%; border:none;
          cursor:pointer; transition:transform .12s, box-shadow .2s;
          font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900;
          letter-spacing:3px; color:#fff; position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
        }
        .tsb-tap:hover  { transform:scale(1.04); }
        .tsb-tap:active { transform:scale(0.95); }
        .tsb-tap.ripple::after {
          content:''; position:absolute; inset:0; border-radius:50%;
          background:rgba(255,255,255,0.25); animation:rippleAnim .3s ease-out;
        }
        @keyframes rippleAnim { from{opacity:1;transform:scale(0.3)} to{opacity:0;transform:scale(1.5)} }
        .tsb-tap-count { font-size:3.2rem; line-height:1; font-weight:900; }
        .tsb-tap-sub   { font-size:.6rem; letter-spacing:3px; opacity:.8; }

        /* Rounds pills */
        .tsb-rounds { display:flex; gap:6px; flex-wrap:wrap; justify-content:center; }
        .tsb-round-pill {
          padding:4px 12px; border-radius:50px; font-size:.7rem; font-weight:700;
          border:1px solid; font-family:'Nunito',sans-serif;
        }

        /* Status */
        .tsb-status {
          text-align:center; font-style:italic; font-size:.84rem; color:var(--teal2);
          padding:10px 18px; border-radius:14px; max-width:420px;
          background:rgba(13,148,136,0.07); border:1px solid rgba(13,148,136,0.18);
          line-height:1.6;
        }

        /* Milestone toast */
        .tsb-milestone {
          padding:10px 20px; border-radius:14px; text-align:center;
          background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05));
          border:1px solid rgba(245,158,11,0.35);
          font-size:.88rem; color:var(--gold2); font-weight:700;
          animation:fadeInUp .4s ease;
        }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* Action buttons */
        .tsb-actions { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
        .tsb-btn {
          padding:9px 16px; border-radius:10px; border:1px solid var(--border);
          background:var(--card-bg); color:var(--muted); font-family:'Nunito',sans-serif;
          font-size:.78rem; font-weight:700; cursor:pointer;
          display:inline-flex; align-items:center; gap:6px; transition:all .22s;
        }
        .tsb-btn:hover { border-color:var(--text); color:var(--text); }
        .tsb-btn.danger:hover { border-color:var(--rose); color:var(--rose); }

        /* All dhikr grid */
        .tsb-all-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .tsb-all-item {
          padding:16px 18px; border-radius:14px; border:1px solid var(--border);
          background:var(--prayer-bg); position:relative; overflow:hidden;
        }
        .tsb-all-ar { font-family:'Scheherazade New',serif; font-size:1.4rem; direction:rtl; text-align:right; margin-bottom:6px; line-height:1.5; }
        .tsb-all-label { font-size:.75rem; font-weight:700; margin-bottom:2px; }
        .tsb-all-en { font-size:.7rem; color:var(--muted); font-style:italic; margin-bottom:8px; }
        .tsb-all-bar { height:4px; border-radius:4px; background:var(--glass2); overflow:hidden; margin-bottom:6px; }
        .tsb-all-fill { height:100%; border-radius:4px; transition:width .5s ease; }
        .tsb-all-nums { display:flex; justify-content:space-between; font-size:.68rem; color:var(--muted); }

        /* History */
        .tsb-hist-list { display:flex; flex-direction:column; gap:8px; }
        .tsb-hist-row {
          padding:14px 16px; border-radius:13px;
          background:var(--prayer-bg); border:1px solid var(--border);
        }
        .tsb-hist-date { font-size:.65rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
        .tsb-hist-dhikrs { display:flex; gap:8px; flex-wrap:wrap; }
        .tsb-hist-pill { padding:4px 10px; border-radius:50px; font-size:.7rem; font-weight:700; border:1px solid; }

        /* Presets */
        .tsb-presets { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .tsb-preset {
          padding:12px 14px; border-radius:12px; border:1px solid var(--border);
          background:var(--card-bg); cursor:pointer; transition:all .22s;
          display:flex; align-items:center; gap:10px;
          font-family:'Nunito',sans-serif; font-size:.78rem; color:var(--muted); font-weight:600;
          text-align:left;
        }
        .tsb-preset:hover { border-color:#a78bfa; color:var(--text); background:rgba(99,102,241,0.05); }

        .tsb-div { height:1px; background:var(--border); margin:14px 0; }
        .tsb-lbl { display:block; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
        .tsb-empty { text-align:center; color:var(--muted); font-size:.82rem; padding:20px 0; }

        @media(max-width:960px){ .tsb-r2,.tsb-all-grid,.tsb-presets { grid-template-columns:1fr; } }
        @media(max-width:600px){ .tsb-tap { width:140px; height:140px; } .tsb-tap-count { font-size:2.6rem; } }
      `}</style>

      <div className="tsb view-wrap">

        {/* Hero */}
        <div className="tsb-hero">
          <div>
            <div className="tsb-title">Digital Tasbih</div>
            <div className="tsb-sub">Dhikr counter · {totalToday} total today</div>
          </div>
          <div className="tsb-chips">
            {[
              { n:totalToday,                         l:"Total Today"  },
              { n:counts["subhanallah"]||0,            l:"SubhānAllāh"  },
              { n:counts["alhamdulillah"]||0,          l:"Alhamdulillāh"},
              { n:counts["allahuakbar"]||0,            l:"Allāhu Akbar" },
              { n:counts["astaghfirullah"]||0,         l:"Istighfār"    },
            ].map((c,i) => (
              <div className="tsb-chip" key={i}>
                <div className="tsb-chip-n">{c.n}</div>
                <div className="tsb-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tsb-tabs">
          <button className={`tsb-tab${tab==="counter"?" on":""}`} onClick={()=>setTab("counter")}>
            <IcoZap/> Counter
          </button>
          <button className={`tsb-tab${tab==="all"?" on":""}`} onClick={()=>setTab("all")}>
            <IcoChart/> All Dhikr
          </button>
          <button className={`tsb-tab${tab==="history"?" on":""}`} onClick={()=>setTab("history")}>
            <IcoStar/> History
          </button>
        </div>

        {/* ── TAB: COUNTER ── */}
        {tab === "counter" && (
          <div className="tsb-r2">

            {/* Main counter */}
            <div className="tsb-card">
              <div className="tsb-card-hd">
                <div className="tsb-ico" style={{background:"rgba(99,102,241,0.15)",color:"#a78bfa"}}><IcoHeart/></div>
                Dhikr Counter
              </div>

              {/* Dhikr picker */}
              <div className="tsb-dhikr-chips">
                {DHIKRS.map((dh,i) => (
                  <button key={i}
                    className="tsb-dhikr-chip"
                    style={selIdx===i ? { borderColor:dh.color, color:dh.color, background:`${dh.color}18`, transform:"translateY(-2px)" } : {}}
                    onClick={()=>{ setSelIdx(i); setMilestone(""); }}>
                    {dh.label}
                  </button>
                ))}
              </div>

              {/* Circle + Tap */}
              <div className="tsb-counter-center">
                <div className="tsb-arabic">{d.ar}</div>
                <div className="tsb-english">{d.en}</div>

                <CircleProgress
                  value={inRound}
                  max={d.target}
                  size={200}
                  color={d.color}
                  strokeWidth={10}>
                  <button
                    ref={tapBtnRef}
                    className={`tsb-tap${ripple?" ripple":""}`}
                    style={{background:`linear-gradient(${d.grad})`}}
                    onClick={tap}>
                    <span className="tsb-tap-count">{count}</span>
                    <span className="tsb-tap-sub">TAP</span>
                  </button>
                </CircleProgress>

                {/* Rounds */}
                {round > 0 && (
                  <div className="tsb-rounds">
                    {Array.from({length:Math.min(round,10)},(_,i)=>(
                      <div key={i} className="tsb-round-pill"
                        style={{color:d.color,borderColor:`${d.color}55`,background:`${d.color}12`}}>
                        Round {i+1} ✓
                      </div>
                    ))}
                  </div>
                )}

                {milestone && <div className="tsb-milestone">{milestone}</div>}
                <div className="tsb-status">{statusMsg}</div>

                <div className="tsb-actions">
                  <button className="tsb-btn" onClick={resetOne}>
                    <IcoReset/> Reset {d.label.split(" ")[0]}
                  </button>
                  <button className="tsb-btn danger" onClick={clearAll}>
                    <IcoTrash/> Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Presets + info */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* Quick presets */}
              <div className="tsb-card">
                <div className="tsb-card-hd">
                  <div className="tsb-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoZap/></div>
                  Quick Presets
                </div>
                <div className="tsb-presets">
                  {PRESETS.map((p,i)=>(
                    <button key={i} className="tsb-preset"
                      onClick={()=>setSelIdx(DHIKRS.findIndex(dh=>dh.key===p.keys[0]))}>
                      <span style={{fontSize:"1.2rem"}}>{p.icon}</span>
                      <div>
                        <div style={{color:"var(--text)",fontWeight:700,fontSize:".8rem"}}>{p.name}</div>
                        <div style={{fontSize:".68rem",marginTop:2}}>{p.keys.map(k=>DHIKRS.find(d=>d.key===k)?.label).join(" · ")}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasbih-e-Fatima guide */}
              <div className="tsb-card">
                <div className="tsb-card-hd">
                  <div className="tsb-ico" style={{background:"rgba(13,148,136,0.15)",color:"var(--teal2)"}}><IcoChk/></div>
                  Tasbih-e-Fatima (33-33-34)
                </div>
                {DHIKRS.slice(0,3).map((dh,i)=>{
                  const c = counts[dh.key]||0;
                  const done = c >= dh.target;
                  return (
                    <div key={i} onClick={()=>setSelIdx(i)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",
                        borderBottom:"1px solid var(--border)",cursor:"pointer",
                        opacity:done?0.6:1,transition:"opacity .2s"}}>
                      <div style={{width:28,height:28,borderRadius:8,border:`2px solid ${done?dh.color:"var(--border)"}`,
                        background:done?`${dh.color}20`:"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",color:dh.color,flexShrink:0}}>
                        {done ? <IcoChk/> : <span style={{fontSize:".7rem",fontWeight:900,color:dh.color}}>{i+1}</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:".8rem",fontWeight:700,color:done?"var(--muted)":"var(--text)"}}>{dh.label}</div>
                        <div style={{height:4,borderRadius:4,background:"var(--glass2)",marginTop:4,overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:4,background:dh.color,width:`${Math.min((c/dh.target)*100,100)}%`,transition:"width .5s"}}/>
                        </div>
                      </div>
                      <div style={{fontSize:".85rem",fontWeight:900,color:dh.color,minWidth:36,textAlign:"right",fontFamily:"'Cinzel',serif"}}>{c}/{dh.target}</div>
                    </div>
                  );
                })}
                {DHIKRS.slice(0,3).every(dh=>(counts[dh.key]||0)>=dh.target) && (
                  <div style={{marginTop:12,padding:"10px",borderRadius:12,background:"var(--gold-dim)",border:"1px solid rgba(245,158,11,0.3)",textAlign:"center",fontSize:".82rem",color:"var(--gold2)",fontWeight:700}}>
                    Tasbih-e-Fatima Complete! MashaAllah! 🌟
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ALL DHIKR ── */}
        {tab === "all" && (
          <div className="tsb-card">
            <div className="tsb-card-hd">
              <div className="tsb-ico" style={{background:"rgba(99,102,241,0.15)",color:"#a78bfa"}}><IcoChart/></div>
              All Dhikr Today
              <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>{totalToday} total</span>
            </div>
            <div className="tsb-all-grid">
              {DHIKRS.map((dh,i)=>{
                const c = counts[dh.key]||0;
                const pct2 = Math.min((c / dh.target)*100,100);
                const rounds2 = Math.floor(c/dh.target);
                return (
                  <div key={i} className="tsb-all-item"
                    style={selIdx===i?{border:`1px solid ${dh.color}55`,background:`${dh.color}08`}:{}}
                    onClick={()=>{setSelIdx(i);setTab("counter");}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(${dh.grad})`,opacity:.6}}/>
                    <div className="tsb-all-ar" style={{color:dh.color}}>{dh.ar}</div>
                    <div className="tsb-all-label" style={{color:dh.color}}>{dh.label}</div>
                    <div className="tsb-all-en">{dh.en}</div>
                    <div className="tsb-all-bar">
                      <div className="tsb-all-fill" style={{width:`${pct2}%`,background:`linear-gradient(${dh.grad})`}}/>
                    </div>
                    <div className="tsb-all-nums">
                      <span>{c} counted</span>
                      <span>target {dh.target}</span>
                    </div>
                    {rounds2>0 && (
                      <div style={{marginTop:6,fontSize:".68rem",fontWeight:700,color:dh.color}}>
                        {rounds2} round{rounds2>1?"s":""} complete ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: HISTORY ── */}
        {tab === "history" && (
          <div className="tsb-r2">
            <div className="tsb-card" style={{gridColumn:"1/-1"}}>
              <div className="tsb-card-hd">
                <div className="tsb-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoStar/></div>
                Past 7 Days
              </div>
              <div className="tsb-hist-list">
                {sessions.map((s,i)=>(
                  <div key={i} className="tsb-hist-row">
                    <div className="tsb-hist-date">{s.date} · {s.total||0} total</div>
                    <div className="tsb-hist-dhikrs">
                      {DHIKRS.map(dh=>{
                        const c = (s.counts||{})[dh.key]||0;
                        if(!c) return null;
                        return (
                          <div key={dh.key} className="tsb-hist-pill"
                            style={{color:dh.color,borderColor:`${dh.color}55`,background:`${dh.color}12`}}>
                            {c} {dh.label.split(" ")[0]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {sessions.length===0 && <div className="tsb-empty">No past sessions yet — start counting! 📿</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}