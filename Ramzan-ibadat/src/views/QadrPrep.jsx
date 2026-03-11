// src/views/QadrPrep.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const START = new Date("2026-02-20");
function getTodayDay() {
  return Math.min(30, Math.max(1, Math.round((new Date() - START) / 86400000) + 1));
}

const ODD_NIGHTS = [
  { day:21, label:"21st Night", desc:"First blessed odd night — begin with full intention",    likely:3 },
  { day:23, label:"23rd Night", desc:"Increase in dua and long qiyam tonight",                  likely:3 },
  { day:25, label:"25th Night", desc:"Many scholars hold this night in high regard",             likely:4 },
  { day:27, label:"27th Night", desc:"Widely believed to be the most likely night",              likely:5 },
  { day:29, label:"29th Night", desc:"Final opportunity — do not miss this night",               likely:4 },
];

const CHECKLIST = [
  { key:"quran",     label:"Recite Quran with reflection & tarteel",              icon:"📖", pts:15 },
  { key:"tahajjud",  label:"Pray Tahajjud & long Qiyam al-Layl",                  icon:"🕌", pts:20 },
  { key:"qadr-dua",  label:"Repeat the Laylatul Qadr dua in every sujood",        icon:"🤲", pts:20 },
  { key:"sadaqah",   label:"Give your most generous sadaqah tonight",              icon:"💎", pts:15 },
  { key:"dua",       label:"Make long, sincere, personal duas with full presence", icon:"✨", pts:15 },
  { key:"family",    label:"Wake your family for ibadah",                          icon:"👨‍👩‍👧", pts:10 },
  { key:"istighfar", label:"Make abundant istighfar — seek forgiveness deeply",    icon:"💧", pts:10 },
  { key:"dhikr",     label:"Fill every idle moment with dhikr",                   icon:"📿", pts:10 },
  { key:"ghusl",     label:"Perform ghusl before beginning ibadah",               icon:"🚿", pts:5  },
  { key:"clean",     label:"Wear clean clothes & apply perfume (sunnah)",          icon:"🌸", pts:5  },
];

const NIGHT_AMAAL = [
  { time:"After Maghrib",  act:"Make intention, perform ghusl, wear clean clothes",       icon:"🌅" },
  { time:"After Isha",     act:"Pray Tarawih with full focus — do not rush",              icon:"🌙" },
  { time:"Late night",     act:"Pray Tahajjud — at least 8 rakaat + witr",               icon:"⭐" },
  { time:"In Sujood",      act:"Stay long — pour your heart, make personal duas",        icon:"🤲" },
  { time:"Before Fajr",    act:"Final intense dua — this is the golden window",          icon:"✨" },
  { time:"After Fajr",     act:"Stay in mosque for morning dhikr if possible",           icon:"🌄" },
];

// SVG Icons
const IcoChk    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoMoon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcoZap    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoClock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoHeart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoSave   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

export default function QadrPrep() {
  const { user }  = useAuth();
  const todayDay  = getTodayDay();
  const todayStr  = new Date().toDateString();

  const [tab,     setTab]    = useState("checklist");
  const [checked, setChecked]= useState({});
  const [toast,   setToast]  = useState("");
  const [saved,   setSaved]  = useState(false);

  const done    = Object.values(checked).filter(Boolean).length;
  const pts     = CHECKLIST.filter(c=>checked[c.key]).reduce((a,c)=>a+c.pts,0);
  const maxPts  = CHECKLIST.reduce((a,c)=>a+c.pts,0);
  const pct     = Math.round((pts/maxPts)*100);

  const curNight  = ODD_NIGHTS.find(n => n.day === todayDay);
  const nextNight = ODD_NIGHTS.find(n => n.day > todayDay);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "qadrPrep", `${user.uid}_${todayStr}`));
        if (snap.exists()) { setChecked(snap.data().checked||{}); setSaved(true); }
      } catch(e){ console.warn(e); }
    })();
  }, [user]);

  const toggle = (key) => { setChecked(c=>({...c,[key]:!c[key]})); setSaved(false); };

  const save = async () => {
    await setDoc(doc(db, "qadrPrep", `${user.uid}_${todayStr}`), {
      uid:user.uid, date:todayStr, checked, pts, pct, updatedAt:new Date().toISOString()
    });
    setSaved(true);
    setToast("Ibadah saved! May Allah accept 🌙");
  };

  const statusMsg =
    pct===100 ? "SubhanAllah! Complete ibadah — may Allah accept every moment! 🌟" :
    pct >= 70 ? "MashaAllah! A beautiful night of worship 🌙" :
    pct >= 40 ? "Alhamdulillah — keep going, the night is still young ✨" :
    done > 0  ? "Barakallah — each deed is multiplied 1000x tonight 💎" :
    "Begin your ibadah — this night is worth 83 years of worship 🤲";

  return (
    <>
      <style>{`
        .qdr { width:100%; box-sizing:border-box; }

        /* Hero */
        .qdr-hero {
          padding:24px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(245,158,11,0.05));
          border:1px solid rgba(167,139,250,0.3);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .qdr-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:#a78bfa; letter-spacing:2px; }
        .qdr-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .qdr-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .qdr-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:66px; }
        .qdr-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:#a78bfa; }
        .qdr-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Tabs */
        .qdr-tabs { display:flex; gap:4px; background:var(--card-bg); padding:4px; border-radius:14px; border:1px solid var(--card-border); margin-bottom:18px; width:fit-content; }
        .qdr-tab  { padding:8px 20px; border-radius:11px; border:none; background:transparent; color:var(--muted); font-family:'Nunito',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:6px; }
        .qdr-tab:hover { color:var(--text); }
        .qdr-tab.on { background:rgba(167,139,250,0.12); color:#a78bfa; border:1px solid rgba(167,139,250,0.35); }

        /* Grid */
        .qdr-r2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }

        /* Card */
        .qdr-card {
          padding:22px 24px; border-radius:18px; box-sizing:border-box;
          background:var(--card-bg); border:1px solid var(--card-border);
          position:relative; overflow:hidden;
        }
        .qdr-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent); }
        .qdr-card-hd { font-family:'Cinzel',serif; font-size:.76rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#a78bfa; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .qdr-ico { width:27px; height:27px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        /* Ayah banner */
        .qdr-ayah {
          padding:22px 26px; border-radius:18px; margin-bottom:18px; text-align:center;
          background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(167,139,250,0.03));
          border:1px solid rgba(167,139,250,0.3);
        }
        .qdr-ayah-ar { font-family:'Scheherazade New',serif; font-size:2rem; color:#a78bfa; direction:rtl; line-height:1.9; margin-bottom:10px; }
        .qdr-ayah-en { font-style:italic; font-size:.9rem; color:var(--muted); line-height:1.7; border-left:3px solid rgba(167,139,250,0.5); padding-left:14px; text-align:left; }
        .qdr-ayah-ref { font-size:.65rem; letter-spacing:2px; color:#a78bfa; text-transform:uppercase; margin-top:8px; }

        /* Score bar */
        .qdr-score-bar { height:10px; border-radius:10px; background:var(--glass2); overflow:hidden; margin:10px 0 4px; }
        .qdr-score-fill { height:100%; border-radius:10px; background:linear-gradient(90deg,#7c3aed,#a78bfa); transition:width .8s ease; }

        /* Checklist */
        .qdr-check-list { display:flex; flex-direction:column; gap:8px; }
        .qdr-item {
          display:flex; align-items:center; gap:12px;
          padding:12px 16px; border-radius:13px;
          border:1px solid var(--border); background:var(--prayer-bg);
          cursor:pointer; transition:all .22s; position:relative; overflow:hidden;
        }
        .qdr-item::before { content:''; position:absolute; top:0; left:0; bottom:0; width:3px; background:transparent; transition:background .2s; }
        .qdr-item:hover { background:var(--dua-row-hover); }
        .qdr-item.on { background:rgba(167,139,250,0.08); border-color:rgba(167,139,250,0.35); }
        .qdr-item.on::before { background:#a78bfa; }
        .qdr-chk {
          width:22px; height:22px; border-radius:7px; flex-shrink:0;
          border:2px solid var(--border); background:transparent;
          display:flex; align-items:center; justify-content:center;
          color:transparent; transition:all .22s;
        }
        .qdr-chk.on { background:#a78bfa; border-color:#a78bfa; color:#fff; }
        .qdr-item-ico { font-size:1rem; flex-shrink:0; }
        .qdr-item-txt { flex:1; font-size:.86rem; color:var(--text); line-height:1.4; }
        .qdr-item-txt.done { text-decoration:line-through; opacity:.45; }
        .qdr-item-pts { font-size:.65rem; font-weight:800; color:#a78bfa; font-family:'Cinzel',serif; flex-shrink:0; }

        /* Status */
        .qdr-status {
          text-align:center; font-style:italic; font-size:.84rem; color:#a78bfa;
          padding:12px 18px; border-radius:14px;
          background:rgba(167,139,250,0.07); border:1px solid rgba(167,139,250,0.2);
          line-height:1.6; margin-bottom:14px;
        }

        /* Nights grid */
        .qdr-nights { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
        .qdr-night {
          padding:14px 10px; border-radius:14px; text-align:center;
          border:1px solid var(--border); background:var(--prayer-bg); transition:all .2s;
        }
        .qdr-night.tonight { background:rgba(167,139,250,0.1); border:2px solid #a78bfa; box-shadow:0 0 16px rgba(167,139,250,0.25); }
        .qdr-night.past    { opacity:.35; }
        .qdr-night-day  { font-family:'Cinzel',serif; font-size:1.4rem; font-weight:900; }
        .qdr-night-lbl  { font-size:.65rem; font-weight:700; letter-spacing:1px; margin-top:3px; }
        .qdr-night-desc { font-size:.6rem; color:var(--muted); margin-top:5px; line-height:1.4; }
        .qdr-likely { display:flex; justify-content:center; gap:2px; margin-top:6px; }
        .qdr-star { font-size:.55rem; }

        /* Schedule */
        .qdr-sched { display:flex; flex-direction:column; gap:0; }
        .qdr-sched-row {
          display:flex; gap:14px; align-items:flex-start; padding:12px 0;
          border-bottom:1px solid var(--border);
        }
        .qdr-sched-ico { font-size:1.2rem; flex-shrink:0; width:28px; text-align:center; margin-top:2px; }
        .qdr-sched-time { font-size:.7rem; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#a78bfa; min-width:90px; padding-top:2px; }
        .qdr-sched-act  { font-size:.83rem; color:var(--text); line-height:1.5; }

        /* Dua card */
        .qdr-dua {
          padding:20px 24px; border-radius:16px; text-align:center; margin-bottom:14px;
          background:rgba(245,158,11,0.07); border:1px solid rgba(245,158,11,0.25);
        }
        .qdr-dua-ar { font-family:'Scheherazade New',serif; font-size:1.7rem; color:var(--gold2); direction:rtl; line-height:1.9; margin-bottom:8px; }
        .qdr-dua-en { font-style:italic; font-size:.84rem; color:var(--muted); line-height:1.6; }
        .qdr-dua-src { font-size:.65rem; color:var(--gold); letter-spacing:1.5px; text-transform:uppercase; margin-top:8px; }

        .qdr-btn {
          padding:12px 22px; border-radius:12px; border:none; cursor:pointer;
          font-family:'Nunito',sans-serif; font-weight:800; font-size:.85rem;
          display:inline-flex; align-items:center; gap:7px; transition:all .22s;
          background:linear-gradient(135deg,#7c3aed,#a78bfa); color:#fff; width:100%; justify-content:center;
        }
        .qdr-btn:hover { transform:translateY(-1px); box-shadow:0 5px 16px rgba(167,139,250,.35); }
        .qdr-btn.saved { background:linear-gradient(135deg,var(--teal),#0f766e); }

        .qdr-div { height:1px; background:var(--border); margin:14px 0; }
        .qdr-lbl { display:block; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }

        @media(max-width:960px){ .qdr-r2 { grid-template-columns:1fr; } }
        @media(max-width:700px){ .qdr-nights { grid-template-columns:repeat(3,1fr); } }
      `}</style>

      <div className="qdr view-wrap">

        {/* Hero */}
        <div className="qdr-hero">
          <div>
            <div className="qdr-title">Laylatul Qadr</div>
            <div className="qdr-sub">The Night of Power · Better than 1000 months</div>
          </div>
          <div className="qdr-chips">
            {[
              { n:curNight?"Tonight!":nextNight?`Night ${nextNight.day}`:"—", l:"Next Odd Night" },
              { n:`${done}/${CHECKLIST.length}`,                               l:"Deeds Done"    },
              { n:`${pts}pts`,                                                  l:"Tonight Score" },
              { n:`${pct}%`,                                                    l:"Progress"      },
            ].map((c,i)=>(
              <div className="qdr-chip" key={i}>
                <div className="qdr-chip-n">{c.n}</div>
                <div className="qdr-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Ayah */}
        <div className="qdr-ayah">
          <div className="qdr-ayah-ar">لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ</div>
          <div className="qdr-ayah-en">
            "The Night of Decree is <strong style={{color:"#a78bfa"}}>better than a thousand months</strong> — over 83 years of unbroken worship. One night, one intention, one sincere tear in sujood."
          </div>
          <div className="qdr-ayah-ref">Surah Al-Qadr 97:3</div>
        </div>

        {/* Tabs */}
        <div className="qdr-tabs">
          <button className={`qdr-tab${tab==="checklist"?" on":""}`} onClick={()=>setTab("checklist")}>
            <IcoZap/> Checklist
          </button>
          <button className={`qdr-tab${tab==="nights"?" on":""}`} onClick={()=>setTab("nights")}>
            <IcoMoon/> Odd Nights
          </button>
          <button className={`qdr-tab${tab==="schedule"?" on":""}`} onClick={()=>setTab("schedule")}>
            <IcoClock/> Schedule
          </button>
          <button className={`qdr-tab${tab==="dua"?" on":""}`} onClick={()=>setTab("dua")}>
            <IcoHeart/> Dua
          </button>
        </div>

        {/* ── CHECKLIST ── */}
        {tab==="checklist" && (
          <div className="qdr-r2">
            <div className="qdr-card">
              <div className="qdr-card-hd">
                <div className="qdr-ico" style={{background:"rgba(167,139,250,0.15)",color:"#a78bfa"}}><IcoZap/></div>
                Tonight's Ibadah
                <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--teal2)",fontFamily:"'Nunito',sans-serif"}}>
                  {done}/{CHECKLIST.length} complete
                </span>
              </div>

              <div className="qdr-status">{statusMsg}</div>

              {/* Score */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",color:"var(--muted)"}}>
                  <span>Ibadah score</span>
                  <span style={{color:"#a78bfa",fontWeight:800}}>{pts}/{maxPts} pts</span>
                </div>
                <div className="qdr-score-bar">
                  <div className="qdr-score-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>

              <div className="qdr-check-list">
                {CHECKLIST.map(item=>(
                  <div key={item.key}
                    className={`qdr-item${checked[item.key]?" on":""}`}
                    onClick={()=>toggle(item.key)}>
                    <div className={`qdr-chk${checked[item.key]?" on":""}`}><IcoChk/></div>
                    <span className="qdr-item-ico">{item.icon}</span>
                    <span className={`qdr-item-txt${checked[item.key]?" done":""}`}>{item.label}</span>
                    <span className="qdr-item-pts">+{item.pts}</span>
                  </div>
                ))}
              </div>

              <div style={{marginTop:14}}>
                <button className={`qdr-btn${saved?" saved":""}`} onClick={save}>
                  <IcoSave/> {saved?"Saved to Cloud ✓":"Save Tonight's Ibadah"}
                </button>
              </div>
            </div>

            {/* Side panel */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Laylatul Qadr dua */}
              <div className="qdr-dua">
                <div className="qdr-lbl" style={{textAlign:"center"}}>Dua of the Night</div>
                <div className="qdr-dua-ar">اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي</div>
                <div className="qdr-dua-en">"O Allah, You are Most Forgiving, You love to forgive, so forgive me."</div>
                <div className="qdr-dua-src">Tirmidhi 3513 · Repeat in every sujood</div>
              </div>

              {/* Signs of Laylatul Qadr */}
              <div className="qdr-card">
                <div className="qdr-card-hd">
                  <div className="qdr-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoStar/></div>
                  Signs of the Night
                </div>
                {[
                  { sign:"Peaceful, calm night with mild temperature",   icon:"🌙" },
                  { sign:"Heart feels softened, tears come easily",       icon:"💧" },
                  { sign:"Moon may appear bright & round",                icon:"🌕" },
                  { sign:"Next morning's sun rises white without rays",   icon:"☀️" },
                  { sign:"Feeling of peace & lightness after worship",    icon:"✨" },
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
                    <span style={{flexShrink:0,fontSize:"1rem"}}>{s.icon}</span>
                    <span style={{fontSize:".82rem",color:"var(--text)",lineHeight:1.5}}>{s.sign}</span>
                  </div>
                ))}
              </div>

              {/* Virtues */}
              <div className="qdr-card">
                <div className="qdr-card-hd">
                  <div className="qdr-ico" style={{background:"rgba(167,139,250,0.15)",color:"#a78bfa"}}><IcoShield/></div>
                  Why This Night Matters
                </div>
                {[
                  "Quran was revealed on this night",
                  "Worth 83+ years of worship",
                  "Angels descend with peace until Fajr",
                  "Past sins are forgiven with sincere worship",
                  "Decrees for the coming year are set",
                ].map((v,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                    <span style={{color:"#a78bfa",flexShrink:0,fontSize:".8rem"}}>✦</span>
                    <span style={{fontSize:".82rem",color:"var(--text)",lineHeight:1.5}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ODD NIGHTS ── */}
        {tab==="nights" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="qdr-card">
              <div className="qdr-card-hd">
                <div className="qdr-ico" style={{background:"rgba(167,139,250,0.15)",color:"#a78bfa"}}><IcoMoon/></div>
                The Five Blessed Nights
                {curNight && <span style={{marginLeft:"auto",fontSize:".72rem",color:"#a78bfa",fontFamily:"'Nunito',sans-serif",background:"rgba(167,139,250,0.1)",padding:"3px 10px",borderRadius:50,border:"1px solid rgba(167,139,250,0.3)"}}>Tonight is Night {curNight.day}!</span>}
              </div>
              <div className="qdr-nights">
                {ODD_NIGHTS.map((n,i)=>{
                  const isPast    = todayDay > n.day;
                  const isTonight = todayDay === n.day;
                  return (
                    <div key={i} className={`qdr-night${isTonight?" tonight":isPast?" past":""}`}>
                      <div className="qdr-night-day" style={{color:isTonight?"#a78bfa":isPast?"var(--muted)":"var(--text)"}}>{n.day}</div>
                      <div className="qdr-night-lbl" style={{color:isTonight?"#a78bfa":"var(--muted)"}}>{n.label}</div>
                      <div className="qdr-likely">
                        {Array.from({length:5},(_,j)=>(
                          <span key={j} className="qdr-star" style={{color:j<n.likely?"#f59e0b":"var(--border)"}}>★</span>
                        ))}
                      </div>
                      <div className="qdr-night-desc">{n.desc}</div>
                      {isTonight && <div style={{marginTop:6,fontSize:".7rem",color:"#a78bfa",fontWeight:800}}>Seek it tonight ✦</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:16,padding:"12px 16px",borderRadius:12,background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.2)",fontSize:".8rem",color:"var(--muted)",textAlign:"center",fontStyle:"italic"}}>
                "Seek Laylatul Qadr in the odd nights of the last ten days of Ramadan." — Bukhari
              </div>
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {tab==="schedule" && (
          <div className="qdr-r2">
            <div className="qdr-card">
              <div className="qdr-card-hd">
                <div className="qdr-ico" style={{background:"rgba(167,139,250,0.15)",color:"#a78bfa"}}><IcoClock/></div>
                Night of Qadr Schedule
              </div>
              <div className="qdr-sched">
                {NIGHT_AMAAL.map((a,i)=>(
                  <div key={i} className="qdr-sched-row">
                    <span className="qdr-sched-ico">{a.icon}</span>
                    <span className="qdr-sched-time">{a.time}</span>
                    <span className="qdr-sched-act">{a.act}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="qdr-card">
                <div className="qdr-card-hd">
                  <div className="qdr-ico" style={{background:"var(--gold-dim)",color:"var(--gold)"}}><IcoStar/></div>
                  Maximize Every Moment
                </div>
                {[
                  { act:"Between Isha & Tahajjud",  tip:"Quran recitation with reflection — read slowly" },
                  { act:"Every spare moment",         tip:"Repeat the Qadr dua silently even while sitting" },
                  { act:"When tired",                 tip:"Make dua — even lying down counts as ibadah" },
                  { act:"Before sleeping",            tip:"Make intention to wake for Tahajjud" },
                ].map((r,i)=>(
                  <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{fontSize:".75rem",fontWeight:700,color:"#a78bfa",marginBottom:3}}>{r.act}</div>
                    <div style={{fontSize:".8rem",color:"var(--muted)",lineHeight:1.5}}>{r.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DUA ── */}
        {tab==="dua" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="qdr-card">
              <div className="qdr-card-hd">
                <div className="qdr-ico" style={{background:"rgba(167,139,250,0.15)",color:"#a78bfa"}}><IcoHeart/></div>
                Dua of Laylatul Qadr
              </div>
              <div style={{textAlign:"center",padding:"10px 0 20px"}}>
                <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"2.2rem",color:"#a78bfa",direction:"rtl",lineHeight:1.9,marginBottom:14}}>
                  اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                </div>
                <div style={{fontStyle:"italic",fontSize:".92rem",color:"var(--muted)",lineHeight:1.7,borderLeft:"3px solid rgba(167,139,250,0.5)",paddingLeft:16,textAlign:"left",maxWidth:480,margin:"0 auto 14px"}}>
                  "O Allah, You are Most Forgiving, and You love to forgive, so forgive me."
                </div>
                <div style={{fontSize:".72rem",color:"#a78bfa",letterSpacing:1.5,textTransform:"uppercase"}}>Tirmidhi 3513 · Taught by Prophet ﷺ for this night</div>
              </div>
              <div className="qdr-div"/>
              <div style={{fontSize:".82rem",color:"var(--muted)",lineHeight:1.8,textAlign:"center",padding:"0 10px"}}>
                Repeat this dua in <strong style={{color:"#a78bfa"}}>every sujood</strong> on the odd nights.<br/>
                Make it the last thing you say before Fajr. Let there be tears.<br/>
                Even if you don't feel them — your Lord sees the sincerity. 🌙
              </div>
            </div>

            {/* More duas for the night */}
            {[
              { label:"For the Whole Ummah",  ar:"اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ", en:"O Allah, forgive all Muslim men and women.", color:"var(--teal2)" },
              { label:"For Jannah",            ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ",              en:"O Allah, I ask You for Paradise.",            color:"var(--gold)"   },
              { label:"For Protection",        ar:"اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",                  en:"O Allah, protect me from the Fire.",          color:"var(--rose)"   },
            ].map((d,i)=>(
              <div key={i} className="qdr-card">
                <div className="qdr-card-hd" style={{color:d.color}}>
                  <div className="qdr-ico" style={{background:`${d.color}18`,color:d.color,border:`1px solid ${d.color}30`}}><IcoHeart/></div>
                  {d.label}
                </div>
                <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"1.5rem",direction:"rtl",textAlign:"right",color:d.color,lineHeight:1.8,marginBottom:8}}>{d.ar}</div>
                <div style={{fontStyle:"italic",fontSize:".84rem",color:"var(--muted)",borderLeft:`2px solid ${d.color}55`,paddingLeft:12,lineHeight:1.7}}>"{d.en}"</div>
              </div>
            ))}
          </div>
        )}

      </div>

      {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
    </>
  );
}