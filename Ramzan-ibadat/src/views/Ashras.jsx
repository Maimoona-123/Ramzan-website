// src/views/Ashras.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const START = new Date("2026-02-20");
function getTodayDay() {
  return Math.min(30, Math.max(1, Math.round((new Date() - START) / 86400000) + 1));
}

const ASHRAS = [
  {
    num:1, days:"Days 1–10", label:"Mercy", ar:"رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
    en:"O Lord, forgive and have mercy, for You are the Best of those who show mercy.",
    arabic:"رحمة", color:"#10b981", glow:"rgba(16,185,129,0.25)",
    grad:"135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03)",
    border:"rgba(16,185,129,0.3)",
    desc:"Ask Allah for His vast mercy. Open your heart to compassion — for yourself and others. These days set the tone for your entire Ramadan.",
    deeds:[
      "Pray all 5 prayers on time with khushu",
      "Read at least 1 juz of Quran daily",
      "Feed someone iftaar — even a date",
      "Call a family member you've been distant from",
      "Make dua for the entire Ummah",
      "Give sadaqah every single day",
    ],
    hadith:"'Whoever does not show mercy will not be shown mercy.' — Bukhari",
    days_range:[1,10],
  },
  {
    num:2, days:"Days 11–20", label:"Forgiveness", ar:"أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ",
    en:"I seek forgiveness from Allah, my Lord, from every sin and I repent to Him.",
    arabic:"مغفرة", color:"#6366f1", glow:"rgba(99,102,241,0.25)",
    grad:"135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.03)",
    border:"rgba(99,102,241,0.3)",
    desc:"Increase in istighfar. Allah loves those who constantly repent. Cleanse your record before the final stretch begins.",
    deeds:[
      "Say Astaghfirullah 100 times after each salah",
      "Identify one bad habit to leave permanently",
      "Write a sincere tawbah in your journal",
      "Reconcile with anyone you've wronged",
      "Increase Tahajjud in these nights",
      "Complete Tasbih-e-Fatima daily",
    ],
    hadith:"'Allah is more pleased with the repentance of His servant than a man who finds his lost camel.' — Muslim",
    days_range:[11,20],
  },
  {
    num:3, days:"Days 21–30", label:"Salvation", ar:"اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    en:"O Allah, save me from the Fire.",
    arabic:"عتق", color:"#f43f5e", glow:"rgba(244,63,94,0.25)",
    grad:"135deg,rgba(244,63,94,0.12),rgba(244,63,94,0.03)",
    border:"rgba(244,63,94,0.3)",
    desc:"Intensify dua for protection from Hellfire. Focus on Laylatul Qadr — it falls in these blessed nights. These are the most precious days.",
    deeds:[
      "Stay up all odd nights (21, 23, 25, 27, 29)",
      "Read Surah Al-Qadr and Al-Ikhlas repeatedly",
      "Make itikaf even for a few hours",
      "Write your biggest duas for Laylatul Qadr",
      "Increase Quran recitation — finish your khatm",
      "Give your largest sadaqah of Ramadan",
    ],
    hadith:"'Whoever prays on Laylatul Qadr out of faith and hope, his past sins will be forgiven.' — Bukhari",
    days_range:[21,30],
  },
];

const SPECIAL_NIGHTS = [
  { day:21, name:"21st Night",  note:"First odd night of last 10" },
  { day:23, name:"23rd Night",  note:"Increased dhikr & qiyam"   },
  { day:25, name:"25th Night",  note:"Seek Laylatul Qadr"         },
  { day:27, name:"27th Night",  note:"Most likely Laylatul Qadr"  },
  { day:29, name:"29th Night",  note:"Final chance this Ramadan"  },
];

// SVG Icons
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoChk    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoHeart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoZap    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoClock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoLeaf   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.46 1.28C7.94 18.4 12 15 17 15c4.42 0 7-2.24 7-5s-4-6-7-6z"/></svg>;
const IcoDrop   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
const IcoFlame  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const IcoBook   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoMoon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const ASHRA_ICONS = [IcoLeaf, IcoDrop, IcoFlame];

export default function Ashras() {
  const { user }  = useAuth();
  const todayDay  = getTodayDay();
  const curAshra  = todayDay <= 10 ? 0 : todayDay <= 20 ? 1 : 2;

  const [tab,         setTab]         = useState("overview");
  const [expanded,    setExpanded]    = useState(curAshra);
  const [deedsDone,   setDeedsDone]   = useState({ 0:{}, 1:{}, 2:{} });
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "ashras", user.uid));
        if (snap.exists()) setDeedsDone(snap.data().deedsDone || {0:{},1:{},2:{}});
      } catch(e){ console.warn(e); }
      setLoading(false);
    })();
  }, [user]);

  const toggleDeed = async (ashraIdx, deedIdx) => {
    const cur = deedsDone[ashraIdx]?.[deedIdx];
    const next = {
      ...deedsDone,
      [ashraIdx]: { ...(deedsDone[ashraIdx]||{}), [deedIdx]: !cur }
    };
    setDeedsDone(next);
    await setDoc(doc(db, "ashras", user.uid), { deedsDone: next, uid: user.uid });
  };

  const totalDeeds = Object.values(deedsDone).reduce((a,v)=>a+Object.values(v).filter(Boolean).length,0);
  const totalPoss  = ASHRAS.reduce((a,as)=>a+as.deeds.length,0);

  // days remaining in current ashra
  const ashraDaysLeft = curAshra===0 ? 10-todayDay : curAshra===1 ? 20-todayDay : 30-todayDay;
  const nextSpecial   = SPECIAL_NIGHTS.find(n => n.day >= todayDay);

  return (
    <>
      <style>{`
        .ash { width:100%; box-sizing:border-box; }

        /* Hero */
        .ash-hero {
          padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.02));
          border:1px solid rgba(245,158,11,0.25);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .ash-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; }
        .ash-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .ash-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .ash-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:70px; }
        .ash-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--gold); }
        .ash-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .ash-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .ash-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .ash-tab:hover { color:var(--text); }
        .ash-tab.on { background:var(--gold-dim); color:var(--gold2); border:1px solid rgba(245,158,11,.35); }

        /* Current ashra banner */
        .ash-banner {
          padding:18px 22px; border-radius:16px; margin-bottom:18px;
          display:flex; align-items:center; gap:14px; flex-wrap:wrap;
        }
        .ash-banner-badge {
          width:48px; height:48px; border-radius:14px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem;
        }

        /* Ashra cards */
        .ash-card {
          border-radius:20px; overflow:hidden; margin-bottom:12px;
          border:1px solid var(--card-border); background:var(--card-bg);
          transition:box-shadow .25s;
        }
        .ash-card:hover { box-shadow:0 4px 24px rgba(0,0,0,0.12); }
        .ash-card.active { box-shadow:0 0 0 2px var(--gold-glow); }
        .ash-card-header {
          padding:20px 24px; cursor:pointer;
          display:flex; align-items:center; gap:16px;
          position:relative; overflow:hidden;
        }
        .ash-card-header::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; opacity:0; transition:opacity .2s; }
        .ash-card-header:hover::after { opacity:1; }
        .ash-num {
          width:44px; height:44px; border-radius:13px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900;
        }
        .ash-label-group { flex:1; min-width:0; }
        .ash-ashra-label { font-family:'Cinzel',serif; font-size:1rem; font-weight:700; margin-bottom:2px; }
        .ash-days-label  { font-size:.7rem; color:var(--muted); }
        .ash-ar-snippet  { font-family:'Scheherazade New',serif; font-size:1.2rem; direction:rtl; text-align:right; flex:1; }
        .ash-progress-mini { text-align:right; }
        .ash-prog-num { font-family:'Cinzel',serif; font-size:.85rem; font-weight:900; }
        .ash-chevron { font-size:.8rem; color:var(--muted); transition:transform .25s; }
        .ash-chevron.open { transform:rotate(180deg); }

        /* Card body */
        .ash-body { padding:0 24px 22px; }
        .ash-ar-full { font-family:'Scheherazade New',serif; font-size:1.9rem; direction:rtl; text-align:center; line-height:1.8; margin-bottom:12px; }
        .ash-en { font-style:italic; font-size:.88rem; color:var(--muted); line-height:1.7; border-left:3px solid; padding-left:14px; margin-bottom:14px; }
        .ash-desc { font-size:.86rem; line-height:1.75; color:var(--text); opacity:.85; margin-bottom:16px; }
        .ash-hadith { padding:12px 16px; border-radius:12px; font-size:.78rem; font-style:italic; color:var(--muted); line-height:1.6; }

        /* Deeds checklist */
        .ash-deeds { display:flex; flex-direction:column; gap:7px; margin-bottom:14px; }
        .ash-deed {
          display:flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:12px;
          border:1px solid var(--border); background:var(--prayer-bg);
          cursor:pointer; transition:all .2s;
        }
        .ash-deed:hover { background:var(--dua-row-hover); }
        .ash-deed-chk {
          width:20px; height:20px; border-radius:6px; border:2px solid var(--border);
          flex-shrink:0; display:flex; align-items:center; justify-content:center;
          color:transparent; transition:all .2s;
        }
        .ash-deed-chk.on { color:#fff; }
        .ash-deed-txt { flex:1; font-size:.83rem; color:var(--text); }
        .ash-deed-txt.done { text-decoration:line-through; opacity:.45; }

        /* Special nights */
        .ash-nights { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
        .ash-night {
          padding:14px 10px; border-radius:14px; text-align:center;
          border:1px solid var(--border); background:var(--prayer-bg);
          transition:all .2s; cursor:default;
        }
        .ash-night.current {
          background:rgba(245,158,11,0.1); border:2px solid var(--gold);
          box-shadow:0 0 14px var(--gold-glow);
        }
        .ash-night.past { opacity:.4; }
        .ash-night-num { font-family:'Cinzel',serif; font-size:1.3rem; font-weight:900; }
        .ash-night-name { font-size:.65rem; font-weight:700; letter-spacing:1px; margin-top:3px; }
        .ash-night-note { font-size:.6rem; color:var(--muted); margin-top:4px; line-height:1.4; }

        /* Progress bar */
        .ash-bar-wrap { margin-bottom:6px; }
        .ash-bar { height:6px; border-radius:6px; background:var(--glass2); overflow:hidden; }
        .ash-bar-fill { height:100%; border-radius:6px; transition:width .6s ease; }

        /* Timeline */
        .ash-timeline { display:flex; flex-direction:column; gap:0; position:relative; }
        .ash-timeline::before { content:''; position:absolute; left:18px; top:20px; bottom:20px; width:2px; background:var(--border); }
        .ash-tl-item { display:flex; gap:16px; padding:14px 0; align-items:flex-start; position:relative; }
        .ash-tl-dot { width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:2px solid; position:relative; z-index:1; }
        .ash-tl-content { flex:1; padding-top:6px; }
        .ash-tl-label { font-family:'Cinzel',serif; font-size:.82rem; font-weight:700; margin-bottom:4px; }
        .ash-tl-days { font-size:.7rem; color:var(--muted); margin-bottom:6px; }
        .ash-tl-bar { height:5px; border-radius:5px; background:var(--glass2); overflow:hidden; max-width:240px; }
        .ash-tl-fill { height:100%; border-radius:5px; transition:width .6s; }

        .ash-lbl { display:block; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
        .ash-div { height:1px; background:var(--border); margin:14px 0; }

        @media(max-width:700px){ .ash-nights { grid-template-columns:repeat(3,1fr); } .ash-ar-snippet { display:none; } }
      `}</style>

      <div className="ash view-wrap">

        {/* Hero */}
        <div className="ash-hero">
          <div>
            <div className="ash-title">Three Ashras</div>
            <div className="ash-sub">The Journey Within · Day {todayDay} of Ramadan</div>
          </div>
          <div className="ash-chips">
            {[
              { n:`Ashra ${curAshra+1}`,                                                     l:"Currently In"    },
              { n:`Day ${todayDay}`,                                                          l:"Ramadan Day"     },
              { n:ashraDaysLeft>0?`${ashraDaysLeft} left`:"Last Day",                        l:"This Ashra"      },
              { n:`${totalDeeds}/${totalPoss}`,                                               l:"Deeds Done"      },
              { n:nextSpecial?`Night ${nextSpecial.day}`:"Done!",                            l:"Next Special"    },
            ].map((c,i)=>(
              <div className="ash-chip" key={i}>
                <div className="ash-chip-n">{c.n}</div>
                <div className="ash-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="ash-tabs">
          <button className={`ash-tab${tab==="overview"?" on":""}`} onClick={()=>setTab("overview")}>
            <IcoBook/> Overview
          </button>
          <button className={`ash-tab${tab==="deeds"?" on":""}`} onClick={()=>setTab("deeds")}>
            <IcoChk/> Deeds
          </button>
          <button className={`ash-tab${tab==="nights"?" on":""}`} onClick={()=>setTab("nights")}>
            <IcoMoon/> Special Nights
          </button>
          <button className={`ash-tab${tab==="timeline"?" on":""}`} onClick={()=>setTab("timeline")}>
            <IcoClock/> Timeline
          </button>
        </div>

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <>
            {/* Current ashra banner */}
            <div className="ash-banner"
              style={{background:`linear-gradient(${ASHRAS[curAshra].grad})`,border:`1px solid ${ASHRAS[curAshra].border}`}}>
              <div className="ash-banner-badge"
                style={{background:`${ASHRAS[curAshra].color}20`,border:`2px solid ${ASHRAS[curAshra].color}55`,color:ASHRAS[curAshra].color}}>
                {curAshra===0?<IcoLeaf/>:curAshra===1?<IcoDrop/>:<IcoFlame/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:".62rem",letterSpacing:2,textTransform:"uppercase",color:ASHRAS[curAshra].color,marginBottom:3}}>You are currently in</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",fontWeight:900,color:ASHRAS[curAshra].color}}>
                  Ashra of {ASHRAS[curAshra].label} · {ASHRAS[curAshra].days}
                </div>
                <div style={{fontSize:".78rem",color:"var(--muted)",marginTop:3}}>{ASHRAS[curAshra].desc.slice(0,80)}…</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.6rem",fontWeight:900,color:ASHRAS[curAshra].color}}>{ashraDaysLeft}</div>
                <div style={{fontSize:".6rem",letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>days left</div>
              </div>
            </div>

            {/* Ashra accordion cards */}
            {ASHRAS.map((a,i)=>{
              const Icon = ASHRA_ICONS[i];
              const doneCount = Object.values(deedsDone[i]||{}).filter(Boolean).length;
              const totalCount = a.deeds.length;
              const deedPct = Math.round((doneCount/totalCount)*100);
              const isOpen = expanded===i;
              const isCur = curAshra===i;
              return (
                <div key={i} className={`ash-card${isCur?" active":""}`}>
                  <div className="ash-card-header"
                    style={{background:`linear-gradient(${a.grad})`}}
                    onClick={()=>setExpanded(isOpen?-1:i)}>
                    <div className="ash-num"
                      style={{background:`${a.color}20`,border:`2px solid ${a.color}55`,color:a.color}}>
                      <Icon/>
                    </div>
                    <div className="ash-label-group">
                      <div className="ash-ashra-label" style={{color:a.color}}>
                        Ashra {a.num} · {a.label}
                        {isCur && <span style={{marginLeft:8,fontSize:".6rem",background:`${a.color}20`,padding:"2px 8px",borderRadius:50,border:`1px solid ${a.color}55`}}>ACTIVE</span>}
                      </div>
                      <div className="ash-days-label">{a.days}</div>
                    </div>
                    <div className="ash-ar-snippet" style={{color:a.color}}>{a.ar.split(" ").slice(0,4).join(" ")}…</div>
                    <div className="ash-progress-mini" style={{minWidth:56}}>
                      <div className="ash-prog-num" style={{color:a.color}}>{doneCount}/{totalCount}</div>
                      <div style={{fontSize:".55rem",color:"var(--muted)",letterSpacing:1}}>DEEDS</div>
                      <div className="ash-bar" style={{width:50,marginTop:4}}>
                        <div className="ash-bar-fill" style={{width:`${deedPct}%`,background:a.color}}/>
                      </div>
                    </div>
                    <div className={`ash-chevron${isOpen?" open":""}`}>▼</div>
                  </div>

                  {isOpen && (
                    <div className="ash-body">
                      <div className="ash-ar-full" style={{color:a.color}}>{a.ar}</div>
                      <div className="ash-en" style={{borderColor:a.color}}>"{a.en}"</div>
                      <div className="ash-desc">{a.desc}</div>
                      <div className="ash-hadith"
                        style={{background:`${a.color}0a`,border:`1px solid ${a.color}22`}}>
                        <span style={{color:a.color,marginRight:6}}>✦</span>{a.hadith}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── DEEDS ── */}
        {tab==="deeds" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Overall progress */}
            <div style={{padding:"16px 22px",borderRadius:16,background:"var(--card-bg)",border:"1px solid var(--card-border)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:".75rem",color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Overall Deed Progress</div>
                <div className="ash-bar" style={{height:10}}>
                  <div className="ash-bar-fill" style={{width:`${Math.round((totalDeeds/totalPoss)*100)}%`,background:"linear-gradient(90deg,var(--teal),var(--gold))"}}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.4rem",fontWeight:900,color:"var(--gold)"}}>{totalDeeds}/{totalPoss}</div>
                <div style={{fontSize:".6rem",color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase"}}>Complete</div>
              </div>
            </div>

            {ASHRAS.map((a,i)=>{
              const Icon = ASHRA_ICONS[i];
              const doneCount = Object.values(deedsDone[i]||{}).filter(Boolean).length;
              const deedPct = Math.round((doneCount/a.deeds.length)*100);
              return (
                <div key={i} style={{padding:"20px 24px",borderRadius:18,background:"var(--card-bg)",border:`1px solid ${a.border}`,boxSizing:"border-box"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:32,height:32,borderRadius:10,background:`${a.color}18`,border:`1.5px solid ${a.color}44`,display:"flex",alignItems:"center",justifyContent:"center",color:a.color}}>
                      <Icon/>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:".82rem",fontWeight:700,color:a.color}}>Ashra {a.num} · {a.label}</div>
                      <div style={{fontSize:".65rem",color:"var(--muted)"}}>{a.days}</div>
                    </div>
                    <div style={{marginLeft:"auto",textAlign:"right"}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:a.color,fontSize:".9rem"}}>{doneCount}/{a.deeds.length}</div>
                      <div className="ash-bar" style={{width:60,marginTop:3}}>
                        <div className="ash-bar-fill" style={{width:`${deedPct}%`,background:a.color}}/>
                      </div>
                    </div>
                  </div>
                  <div className="ash-deeds">
                    {a.deeds.map((deed,j)=>{
                      const done = deedsDone[i]?.[j];
                      return (
                        <div key={j} className="ash-deed" onClick={()=>toggleDeed(i,j)}>
                          <div className="ash-deed-chk on" style={{
                            borderColor:done?a.color:"var(--border)",
                            background:done?a.color:"transparent",
                            color:done?"#fff":"transparent"
                          }}>
                            <IcoChk/>
                          </div>
                          <span className={`ash-deed-txt${done?" done":""}`}>{deed}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SPECIAL NIGHTS ── */}
        {tab==="nights" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Laylatul Qadr dua */}
            <div style={{padding:"20px 24px",borderRadius:18,background:"linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.02))",border:"1px solid rgba(245,158,11,0.3)",textAlign:"center"}}>
              <div style={{fontSize:".62rem",letterSpacing:2,color:"var(--gold)",textTransform:"uppercase",marginBottom:10}}>Dua for Laylatul Qadr</div>
              <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"2rem",color:"var(--gold2)",direction:"rtl",lineHeight:1.8,marginBottom:10}}>
                اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
              </div>
              <div style={{fontStyle:"italic",fontSize:".85rem",color:"var(--muted)"}}>
                "O Allah, You are Most Forgiving, and You love forgiveness, so forgive me."
              </div>
              <div style={{fontSize:".7rem",color:"var(--gold)",marginTop:6,letterSpacing:1}}>— Tirmidhi · Read in every sujood</div>
            </div>

            {/* Nights grid */}
            <div style={{padding:"20px 24px",borderRadius:18,background:"var(--card-bg)",border:"1px solid var(--card-border)"}}>
              <div className="ash-lbl"><IcoMoon/>&nbsp; The Five Odd Nights</div>
              <div className="ash-nights">
                {SPECIAL_NIGHTS.map((n,i)=>{
                  const isPast    = todayDay > n.day;
                  const isCurrent = todayDay >= n.day && todayDay < (SPECIAL_NIGHTS[i+1]?.day||31);
                  return (
                    <div key={i} className={`ash-night${isCurrent?" current":isPast?" past":""}`}>
                      <div className="ash-night-num"
                        style={{color:isCurrent?"var(--gold)":isPast?"var(--muted)":"var(--text)"}}>
                        {n.day}
                      </div>
                      <div className="ash-night-name"
                        style={{color:isCurrent?"var(--gold)":"var(--muted)"}}>
                        {n.name}
                      </div>
                      <div className="ash-night-note">{n.note}</div>
                      {isCurrent && <div style={{marginTop:6,fontSize:".7rem",color:"var(--gold)",fontWeight:700}}>Tonight ✦</div>}
                      {isPast && <div style={{marginTop:6,fontSize:".7rem",color:"var(--muted)"}}>Passed</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What to do guide */}
            <div style={{padding:"20px 24px",borderRadius:18,background:"var(--card-bg)",border:"1px solid var(--card-border)"}}>
              <div className="ash-lbl"><IcoZap/>&nbsp; What to do on odd nights</div>
              {[
                { act:"Qiyam al-Layl",   tip:"Pray long voluntary prayers after Tarawih", icon:<IcoStar/>,  color:"var(--gold)"   },
                { act:"Long Sujood",      tip:"Pour your heart in every prostration",       icon:<IcoHeart/>, color:"var(--rose)"   },
                { act:"Istighfar",        tip:"Seek forgiveness with sincerity & tears",    icon:<IcoDrop/>,  color:"#6366f1"       },
                { act:"Personal Duas",    tip:"Make a list and ask for every need",         icon:<IcoShield/>,color:"var(--teal)"   },
                { act:"Quran Recitation", tip:"Even one page is barakah in these nights",   icon:<IcoBook/>,  color:"#10b981"       },
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
                  <div style={{width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:`${r.color}18`,color:r.color,border:`1px solid ${r.color}30`}}>
                    {r.icon}
                  </div>
                  <div>
                    <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>{r.act}</div>
                    <div style={{fontSize:".74rem",color:"var(--muted)",marginTop:2}}>{r.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {tab==="timeline" && (
          <div style={{padding:"22px 24px",borderRadius:18,background:"var(--card-bg)",border:"1px solid var(--card-border)"}}>
            <div className="ash-lbl"><IcoClock/>&nbsp; Ramadan Journey</div>
            <div className="ash-timeline">
              {ASHRAS.map((a,i)=>{
                const Icon = ASHRA_ICONS[i];
                const doneCount = Object.values(deedsDone[i]||{}).filter(Boolean).length;
                const [start,end] = a.days_range;
                const isCur  = curAshra===i;
                const isPast = todayDay > end;
                const prog   = isPast ? 100 : isCur ? Math.round(((todayDay-start)/(end-start+1))*100) : 0;
                return (
                  <div key={i} className="ash-tl-item">
                    <div className="ash-tl-dot"
                      style={{borderColor:a.color,background:isPast?a.color:isCur?`${a.color}20`:"var(--card-bg)",color:isPast?"#fff":a.color}}>
                      {isPast ? <IcoChk/> : <Icon/>}
                    </div>
                    <div className="ash-tl-content">
                      <div className="ash-tl-label" style={{color:a.color}}>
                        Ashra of {a.label}
                        {isCur && <span style={{marginLeft:8,fontSize:".6rem",background:`${a.color}20`,padding:"2px 8px",borderRadius:50,border:`1px solid ${a.color}55`,color:a.color}}>NOW</span>}
                      </div>
                      <div className="ash-tl-days">{a.days} · {doneCount}/{a.deeds.length} deeds</div>
                      <div className="ash-tl-bar">
                        <div className="ash-tl-fill" style={{width:`${prog}%`,background:`linear-gradient(90deg,${a.color},${a.color}aa)`}}/>
                      </div>
                      <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:4,fontStyle:"italic"}}>{a.desc.slice(0,70)}…</div>
                    </div>
                    <div style={{textAlign:"right",paddingTop:6}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.2rem",fontWeight:900,color:a.color}}>{prog}%</div>
                      <div style={{fontSize:".55rem",color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>done</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full 30 day dots */}
            <div className="ash-div"/>
            <div className="ash-lbl">30-Day Overview</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {Array.from({length:30},(_,i)=>i+1).map(day=>{
                const ashra = day<=10?ASHRAS[0]:day<=20?ASHRAS[1]:ASHRAS[2];
                const isPast = day < todayDay;
                const isToday = day === todayDay;
                return (
                  <div key={day} title={`Day ${day}`}
                    style={{
                      width:26,height:26,borderRadius:8,
                      background:isPast?`${ashra.color}40`:isToday?ashra.color:"var(--prayer-bg)",
                      border:`1.5px solid ${isToday?ashra.color:isPast?`${ashra.color}50`:"var(--border)"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:".58rem",fontWeight:700,
                      color:isToday?"#fff":isPast?ashra.color:"var(--muted)",
                      boxShadow:isToday?`0 0 8px ${ashra.glow}`:"none",
                      transition:"all .2s",
                    }}>
                    {day}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:10,display:"flex",gap:14,flexWrap:"wrap",fontSize:".7rem",color:"var(--muted)"}}>
              {ASHRAS.map(a=>(
                <div key={a.num} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:10,height:10,borderRadius:3,background:a.color,opacity:.7}}/>
                  {a.days} · {a.label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}