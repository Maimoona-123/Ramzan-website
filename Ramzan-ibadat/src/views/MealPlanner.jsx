// src/views/MealPlanner.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const START = new Date("2026-02-20");
function getTodayDay() {
  return Math.min(30, Math.max(1, Math.round((new Date() - START) / 86400000) + 1));
}

// Quick-add presets
const SUHOOR_PRESETS = ["Dates","Eggs","Oats","Yogurt","Banana","Whole bread","Milk","Honey","Nuts","Cheese","Paratha","Fruits"];
const IFTAR_PRESETS  = ["Dates","Water","Pakoras","Samosas","Fruit chaat","Daal","Rice","Chicken","Soup","Salad","Jalebi","Lassi","Sheer khurma"];

const NUTRITION_TIPS = [
  { icon:"💧", tip:"Drink 8 glasses between Iftar & Suhoor to stay hydrated." },
  { icon:"🥗", tip:"Include fiber-rich foods in Suhoor to feel full longer." },
  { icon:"🍌", tip:"Bananas & complex carbs give steady energy all day." },
  { icon:"🧂", tip:"Avoid overly salty foods — they increase thirst." },
  { icon:"🥛", tip:"Dairy provides protein & calcium for sustained fasting." },
  { icon:"🚫", tip:"Avoid fried & spicy foods right at Iftar — ease into eating." },
];

const SUNNAH_FOODS = [
  { name:"Dates",  ar:"تمر", benefit:"Sunnah of Prophet ﷺ — breaks fast instantly", color:"var(--amber)"  },
  { name:"Honey",  ar:"عسل", benefit:"Shifa for every illness (Quran 16:69)",        color:"var(--gold)"   },
  { name:"Olive",  ar:"زيتون",benefit:"Blessed tree — mentioned in the Quran",        color:"#65a30d"       },
  { name:"Milk",   ar:"لبن", benefit:"Prophet ﷺ loved milk — good for Suhoor",       color:"var(--teal2)"  },
  { name:"Barley", ar:"شعير",benefit:"Light & blessed grain for Suhoor",              color:"#92400e"       },
  { name:"Zamzam", ar:"زمزم",benefit:"Blessed water — nourishes body & soul",         color:"#0ea5e9"       },
];

// SVG Icons
const IcoPlus   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoX      = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoSave   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IcoClock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoSun    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>;
const IcoMoon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcoLeaf   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.46 1.28C7.94 18.4 12 15 17 15c4.42 0 7-2.24 7-5s-4-6-7-6z"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoChk    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoBook   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;

export default function MealPlanner() {
  const { user }  = useAuth();
  const todayStr  = new Date().toDateString();
  const todayDay  = getTodayDay();

  const [tab,     setTab]   = useState("planner");
  const [suhoor,  setSuhoor]= useState([]);
  const [iftar,   setIftar] = useState([]);
  const [sNew,    setSNew]  = useState("");
  const [iNew,    setINew]  = useState("");
  const [water,   setWater] = useState(0);
  const [history, setHistory]= useState([]);
  const [toast,   setToast] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "meals", `${user.uid}_${todayStr}`));
        if (snap.exists()) {
          const d = snap.data();
          setSuhoor(d.suhoor || []);
          setIftar(d.iftar || []);
          setWater(d.water || 0);
        }
        const hist = [];
        for (let i=1;i<=5;i++){
          const d2 = new Date(); d2.setDate(d2.getDate()-i);
          const k  = `${user.uid}_${d2.toDateString()}`;
          const s  = await getDoc(doc(db,"meals",k));
          if (s.exists()) hist.push({ date:d2.toDateString(), ...s.data() });
        }
        setHistory(hist);
      } catch(e){ console.warn(e); }
    })();
  }, [user]);

  const addItem = (type, val, setVal) => {
    const v = val.trim();
    if (!v) return;
    if (type==="suhoor") setSuhoor(s => [...s, v]);
    else                 setIftar(s  => [...s, v]);
    setVal("");
  };

  const removeItem = (type, i) => {
    if (type==="suhoor") setSuhoor(s => s.filter((_,idx)=>idx!==i));
    else                 setIftar(s  => s.filter((_,idx)=>idx!==i));
  };

  const addPreset = (type, item) => {
    if (type==="suhoor" && !suhoor.includes(item)) setSuhoor(s=>[...s,item]);
    if (type==="iftar"  && !iftar.includes(item))  setIftar(s=>[...s,item]);
  };

  const save = async () => {
    await setDoc(doc(db, "meals", `${user.uid}_${todayStr}`), {
      uid:user.uid, date:todayStr, suhoor, iftar, water, savedAt:new Date().toISOString()
    });
    setToast("Menu saved! Barakallahu feek 🍲");
  };

  const waterPct = Math.min(Math.round((water/8)*100),100);

  return (
    <>
      <style>{`
        .mp { width:100%; box-sizing:border-box; }

        /* Hero */
        .mp-hero {
          padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(13,148,136,0.05));
          border:1px solid rgba(245,158,11,0.25);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .mp-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; }
        .mp-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .mp-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .mp-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:66px; }
        .mp-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--gold); }
        .mp-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .mp-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .mp-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .mp-tab:hover { color:var(--text); }
        .mp-tab.on { background:var(--gold-dim); color:var(--gold2); border:1px solid rgba(245,158,11,.35); }

        /* Grid */
        .mp-r2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }

        /* Card */
        .mp-card {
          padding:22px 24px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .mp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--card-border),transparent); }
        .mp-card-hd { font-family:'Cinzel',serif; font-size:.76rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .mp-ico { width:27px; height:27px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        /* Meal section */
        .mp-sec-hd {
          display:flex; align-items:center; gap:10px; margin-bottom:14px;
          padding-bottom:10px; border-bottom:1px solid var(--border);
        }
        .mp-sec-icon { width:34px; height:34px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .mp-sec-label { font-family:'Cinzel',serif; font-size:.92rem; font-weight:700; }
        .mp-sec-count { margin-left:auto; font-size:.7rem; color:var(--muted); }

        /* Tags */
        .mp-tags { display:flex; flex-wrap:wrap; gap:7px; min-height:44px; margin-bottom:12px; }
        .mp-tag {
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 12px; border-radius:50px; font-size:.8rem; font-weight:600;
          border:1px solid; transition:all .2s; font-family:'Nunito',sans-serif;
        }
        .mp-tag-del {
          width:16px; height:16px; border-radius:50%; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s; flex-shrink:0;
        }

        /* Presets */
        .mp-presets { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px; }
        .mp-preset {
          padding:5px 11px; border-radius:50px; font-size:.72rem; font-weight:600;
          border:1px solid var(--border); background:var(--card-bg); color:var(--muted);
          cursor:pointer; transition:all .2s; font-family:'Nunito',sans-serif;
        }
        .mp-preset:hover { border-color:var(--gold); color:var(--gold2); background:var(--gold-dim); transform:translateY(-1px); }
        .mp-preset.used { opacity:.35; cursor:default; }

        /* Input row */
        .mp-inp-row { display:flex; gap:7px; }
        .mp-inp {
          flex:1; padding:10px 13px; border-radius:10px;
          background:var(--inp-bg); border:1px solid var(--border);
          color:var(--inp-text); font-family:'Nunito',sans-serif; font-size:.86rem;
          outline:none; transition:border-color .22s;
        }
        .mp-inp:focus { border-color:var(--gold); }
        .mp-inp::placeholder { color:var(--inp-placeholder); }
        .mp-btn {
          padding:10px 16px; border-radius:10px; border:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-weight:800; font-size:.8rem;
          display:inline-flex; align-items:center; gap:6px; transition:all .22s;
        }
        .mp-btn.gold { background:linear-gradient(135deg,var(--amber),var(--gold)); color:#06040f; }
        .mp-btn.gold:hover { transform:translateY(-1px); box-shadow:0 4px 12px var(--gold-glow); }
        .mp-btn.teal { background:linear-gradient(135deg,#0f766e,var(--teal)); color:#fff; }
        .mp-btn.teal:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(13,148,136,.3); }
        .mp-btn.full { width:100%; justify-content:center; }
        .mp-btn.lg   { padding:13px 20px; font-size:.88rem; }

        /* Empty */
        .mp-empty { color:var(--muted); font-size:.8rem; font-style:italic; padding:8px 0; }

        /* Water tracker */
        .mp-water { display:flex; gap:8px; flex-wrap:wrap; }
        .mp-glass {
          width:36px; height:36px; border-radius:10px; border:1.5px solid var(--border);
          background:var(--prayer-bg); cursor:pointer; transition:all .2s;
          display:flex; align-items:center; justify-content:center; font-size:1rem;
        }
        .mp-glass.filled { background:rgba(14,165,233,0.15); border-color:rgba(14,165,233,0.5); }
        .mp-glass:hover  { transform:scale(1.1); border-color:rgba(14,165,233,0.6); }

        /* Sunnah grid */
        .mp-sunnah { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .mp-sunnah-item {
          padding:14px 14px; border-radius:14px; border:1px solid var(--border);
          background:var(--prayer-bg); text-align:center;
        }
        .mp-sunnah-ar { font-family:'Scheherazade New',serif; font-size:1.4rem; direction:rtl; line-height:1.5; margin-bottom:4px; }
        .mp-sunnah-name { font-size:.78rem; font-weight:700; margin-bottom:3px; }
        .mp-sunnah-ben  { font-size:.68rem; color:var(--muted); line-height:1.4; }

        /* History */
        .mp-hist-row {
          padding:14px 16px; border-radius:13px; margin-bottom:8px;
          background:var(--prayer-bg); border:1px solid var(--border);
        }
        .mp-hist-date { font-size:.65rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
        .mp-hist-sections { display:flex; gap:16px; flex-wrap:wrap; }
        .mp-hist-sec { flex:1; min-width:140px; }
        .mp-hist-lbl { font-size:.65rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:5px; }
        .mp-hist-items { display:flex; flex-wrap:wrap; gap:5px; }
        .mp-hist-pill { padding:3px 9px; border-radius:50px; font-size:.7rem; font-weight:600; border:1px solid; }

        .mp-div { height:1px; background:var(--border); margin:14px 0; }
        .mp-lbl { display:block; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }

        @media(max-width:960px){ .mp-r2 { grid-template-columns:1fr; } }
        @media(max-width:600px){ .mp-sunnah { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="mp view-wrap">

        {/* Hero */}
        <div className="mp-hero">
          <div>
            <div className="mp-title">Meal Planner</div>
            <div className="mp-sub">Suhoor & Iftar · Day {todayDay} of Ramadan</div>
          </div>
          <div className="mp-chips">
            {[
              { n:suhoor.length, l:"Suhoor Items" },
              { n:iftar.length,  l:"Iftar Items"  },
              { n:`${water}/8`,  l:"Water (cups)" },
              { n:`${waterPct}%`,l:"Hydration"    },
            ].map((c,i)=>(
              <div className="mp-chip" key={i}>
                <div className="mp-chip-n">{c.n}</div>
                <div className="mp-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mp-tabs">
          <button className={`mp-tab${tab==="planner"?" on":""}`} onClick={()=>setTab("planner")}>
            <IcoSun/> Planner
          </button>
          <button className={`mp-tab${tab==="sunnah"?" on":""}`} onClick={()=>setTab("sunnah")}>
            <IcoStar/> Sunnah Foods
          </button>
          <button className={`mp-tab${tab==="tips"?" on":""}`} onClick={()=>setTab("tips")}>
            <IcoLeaf/> Nutrition Tips
          </button>
          <button className={`mp-tab${tab==="history"?" on":""}`} onClick={()=>setTab("history")}>
            <IcoClock/> History
          </button>
        </div>

        {/* ── PLANNER ── */}
        {tab==="planner" && (
          <>
            <div className="mp-r2">
              {/* Suhoor */}
              <div className="mp-card">
                <div className="mp-sec-hd">
                  <div className="mp-sec-icon" style={{background:"rgba(20,184,166,0.15)",border:"1px solid rgba(20,184,166,0.3)",color:"var(--teal2)"}}>
                    <IcoMoon/>
                  </div>
                  <div>
                    <div className="mp-sec-label" style={{color:"var(--teal2)"}}>Suhoor Plan</div>
                    <div style={{fontSize:".68rem",color:"var(--muted)"}}>Pre-dawn meal</div>
                  </div>
                  <div className="mp-sec-count">{suhoor.length} items</div>
                </div>

                <div className="mp-lbl">Quick Add</div>
                <div className="mp-presets">
                  {SUHOOR_PRESETS.map(p=>(
                    <button key={p} className={`mp-preset${suhoor.includes(p)?" used":""}`}
                      onClick={()=>addPreset("suhoor",p)}>{p}</button>
                  ))}
                </div>

                <div className="mp-tags">
                  {suhoor.length===0
                    ? <div className="mp-empty">No items yet — add below or tap presets ↑</div>
                    : suhoor.map((item,i)=>(
                        <div key={i} className="mp-tag"
                          style={{color:"var(--teal2)",borderColor:"rgba(20,184,166,0.35)",background:"rgba(20,184,166,0.08)"}}>
                          {item}
                          <button className="mp-tag-del"
                            style={{background:"rgba(20,184,166,0.15)",color:"var(--teal2)"}}
                            onClick={()=>removeItem("suhoor",i)}><IcoX/></button>
                        </div>
                    ))
                  }
                </div>

                <div className="mp-inp-row">
                  <input className="mp-inp" placeholder="Add suhoor item…"
                    value={sNew} onChange={e=>setSNew(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addItem("suhoor",sNew,setSNew)}/>
                  <button className="mp-btn teal" onClick={()=>addItem("suhoor",sNew,setSNew)}><IcoPlus/></button>
                </div>
              </div>

              {/* Iftar */}
              <div className="mp-card">
                <div className="mp-sec-hd">
                  <div className="mp-sec-icon" style={{background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"var(--gold)"}}>
                    <IcoSun/>
                  </div>
                  <div>
                    <div className="mp-sec-label" style={{color:"var(--gold)"}}>Iftar Plan</div>
                    <div style={{fontSize:".68rem",color:"var(--muted)"}}>Break-fast meal</div>
                  </div>
                  <div className="mp-sec-count">{iftar.length} items</div>
                </div>

                <div className="mp-lbl">Quick Add</div>
                <div className="mp-presets">
                  {IFTAR_PRESETS.map(p=>(
                    <button key={p} className={`mp-preset${iftar.includes(p)?" used":""}`}
                      onClick={()=>addPreset("iftar",p)}>{p}</button>
                  ))}
                </div>

                <div className="mp-tags">
                  {iftar.length===0
                    ? <div className="mp-empty">No items yet — add below or tap presets ↑</div>
                    : iftar.map((item,i)=>(
                        <div key={i} className="mp-tag"
                          style={{color:"var(--gold2)",borderColor:"rgba(245,158,11,0.35)",background:"rgba(245,158,11,0.08)"}}>
                          {item}
                          <button className="mp-tag-del"
                            style={{background:"rgba(245,158,11,0.15)",color:"var(--amber)"}}
                            onClick={()=>removeItem("iftar",i)}><IcoX/></button>
                        </div>
                    ))
                  }
                </div>

                <div className="mp-inp-row">
                  <input className="mp-inp" placeholder="Add iftar item…"
                    value={iNew} onChange={e=>setINew(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addItem("iftar",iNew,setINew)}/>
                  <button className="mp-btn gold" onClick={()=>addItem("iftar",iNew,setINew)}><IcoPlus/></button>
                </div>
              </div>
            </div>

            {/* Water + Save */}
            <div className="mp-card" style={{marginBottom:16}}>
              <div className="mp-card-hd" style={{color:"#0ea5e9"}}>
                <div className="mp-ico" style={{background:"rgba(14,165,233,0.15)",color:"#0ea5e9",border:"1px solid rgba(14,165,233,0.3)"}}>
                  💧
                </div>
                Water Intake · {water}/8 glasses
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <div className="mp-water">
                  {Array.from({length:8},(_,i)=>(
                    <div key={i} className={`mp-glass${i<water?" filled":""}`}
                      onClick={()=>setWater(i<water?i:i+1)}>
                      💧
                    </div>
                  ))}
                </div>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{height:8,borderRadius:8,background:"var(--glass2)",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:8,background:"linear-gradient(90deg,#38bdf8,#0ea5e9)",width:`${waterPct}%`,transition:"width .5s"}}/>
                  </div>
                  <div style={{fontSize:".7rem",color:"#0ea5e9",marginTop:4,fontWeight:700}}>{waterPct}% hydrated</div>
                </div>
              </div>
            </div>

            <button className="mp-btn gold full lg" onClick={save}>
              <IcoSave/> Save Today's Menu
            </button>
          </>
        )}

        {/* ── SUNNAH FOODS ── */}
        {tab==="sunnah" && (
          <div className="mp-card" style={{marginBottom:16}}>
            <div className="mp-card-hd" style={{color:"var(--gold)"}}>
              <div className="mp-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoStar/></div>
              Sunnah & Blessed Foods
            </div>
            <div className="mp-sunnah">
              {SUNNAH_FOODS.map((f,i)=>(
                <div key={i} className="mp-sunnah-item">
                  <div className="mp-sunnah-ar" style={{color:f.color}}>{f.ar}</div>
                  <div className="mp-sunnah-name" style={{color:f.color}}>{f.name}</div>
                  <div className="mp-sunnah-ben">{f.benefit}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:18,padding:"14px 18px",borderRadius:14,background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.22)",textAlign:"center"}}>
              <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"1.4rem",color:"var(--gold2)",direction:"rtl",lineHeight:1.8}}>
                وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا
              </div>
              <div style={{fontSize:".8rem",color:"var(--muted)",fontStyle:"italic",marginTop:6}}>
                "Eat and drink, but be not excessive." — Quran 7:31
              </div>
            </div>
          </div>
        )}

        {/* ── NUTRITION TIPS ── */}
        {tab==="tips" && (
          <div className="mp-card">
            <div className="mp-card-hd" style={{color:"#65a30d"}}>
              <div className="mp-ico" style={{background:"rgba(101,163,13,0.15)",color:"#65a30d",border:"1px solid rgba(101,163,13,0.3)"}}><IcoLeaf/></div>
              Ramadan Nutrition Tips
            </div>
            {NUTRITION_TIPS.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
                <span style={{fontSize:"1.3rem",flexShrink:0}}>{t.icon}</span>
                <div style={{fontSize:".84rem",color:"var(--text)",lineHeight:1.6}}>{t.tip}</div>
              </div>
            ))}
            <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                { label:"Suhoor Goal",    val:"Complex carbs + protein",       color:"var(--teal2)"  },
                { label:"Iftar Start",    val:"Dates + water first",            color:"var(--gold)"   },
                { label:"Avoid",          val:"Fried & overly salty at iftar",  color:"var(--rose)"   },
                { label:"Hydration",      val:"8 glasses between meals",        color:"#0ea5e9"       },
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 13px",borderRadius:11,background:"var(--prayer-bg)",border:"1px solid var(--border)"}}>
                  <div style={{fontSize:".65rem",letterSpacing:1.5,textTransform:"uppercase",color:r.color,marginBottom:3}}>{r.label}</div>
                  <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history" && (
          <div className="mp-card">
            <div className="mp-card-hd" style={{color:"var(--gold)"}}>
              <div className="mp-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoClock/></div>
              Past Meals
            </div>
            {history.map((h,i)=>(
              <div key={i} className="mp-hist-row">
                <div className="mp-hist-date">{h.date}</div>
                <div className="mp-hist-sections">
                  {h.suhoor?.length>0 && (
                    <div className="mp-hist-sec">
                      <div className="mp-hist-lbl" style={{color:"var(--teal2)"}}>Suhoor</div>
                      <div className="mp-hist-items">
                        {h.suhoor.map((item,j)=>(
                          <div key={j} className="mp-hist-pill"
                            style={{color:"var(--teal2)",borderColor:"rgba(20,184,166,0.3)",background:"rgba(20,184,166,0.07)"}}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {h.iftar?.length>0 && (
                    <div className="mp-hist-sec">
                      <div className="mp-hist-lbl" style={{color:"var(--gold)"}}>Iftar</div>
                      <div className="mp-hist-items">
                        {h.iftar.map((item,j)=>(
                          <div key={j} className="mp-hist-pill"
                            style={{color:"var(--gold2)",borderColor:"rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.07)"}}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {h.water>0 && <div style={{marginTop:8,fontSize:".72rem",color:"#0ea5e9"}}>💧 {h.water}/8 glasses</div>}
              </div>
            ))}
            {history.length===0 && <div style={{textAlign:"center",color:"var(--muted)",padding:"24px 0",fontSize:".84rem"}}>No past meals yet — start planning! 🍲</div>}
          </div>
        )}

      </div>

      {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
    </>
  );
}