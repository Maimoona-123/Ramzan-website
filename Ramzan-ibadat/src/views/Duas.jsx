// src/views/Duas.jsx
import { useState } from "react";

const DUAS_DATA = [
  // ── Suhoor / Niyyah
  {
    category:"niyyah", label:"Suhoor Niyyah", badge:"Pre-Dawn",
    ar:"وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    en:"I intend to fast tomorrow from the month of Ramadan.",
    note:"Say before Fajr ends. Silent intention in the heart is also valid.",
    source:"Widely transmitted",
    color:"#f59e0b", grad:"135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.02)", border:"rgba(245,158,11,0.3)",
  },
  // ── Iftar duas
  {
    category:"iftar", label:"Iftar Dua (1)", badge:"At Iftar",
    ar:"اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ",
    en:"O Allah! For You I have fasted and with Your provision I break my fast.",
    note:"Say right when the adhan begins — a moment of guaranteed acceptance.",
    source:"Abu Dawud 2358",
    color:"#0d9488", grad:"135deg,rgba(13,148,136,0.12),rgba(13,148,136,0.02)", border:"rgba(13,148,136,0.3)",
  },
  {
    category:"iftar", label:"Iftar Dua (2)", badge:"At Iftar",
    ar:"ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّه",
    en:"The thirst is gone, the veins are moistened, and the reward is confirmed — if Allah wills.",
    note:"Narrated from the Prophet ﷺ — either dua is valid.",
    source:"Abu Dawud 2357 · Hasan",
    color:"#6366f1", grad:"135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.02)", border:"rgba(99,102,241,0.3)",
  },
  // ── Laylatul Qadr
  {
    category:"qadr", label:"Laylatul Qadr", badge:"Odd Nights",
    ar:"اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    en:"O Allah, You are Most Forgiving, and You love to forgive, so forgive me.",
    note:"Taught by Prophet ﷺ specifically for Laylatul Qadr — repeat in every sujood.",
    source:"Tirmidhi 3513 · Sahih",
    color:"#a78bfa", grad:"135deg,rgba(167,139,250,0.12),rgba(167,139,250,0.02)", border:"rgba(167,139,250,0.3)",
  },
  // ── Daily duas
  {
    category:"daily", label:"Dua at Suhoor Time", badge:"Suhoor",
    ar:"اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    en:"O Allah, by You we enter the morning, by You we enter the evening, by You we live and die, and to You is the resurrection.",
    note:"Say at the beginning of the day — connects your entire day to Allah.",
    source:"Tirmidhi 3391",
    color:"#f59e0b", grad:"135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.02)", border:"rgba(245,158,11,0.3)",
  },
  {
    category:"daily", label:"Dua for Parents", badge:"Any Time",
    ar:"رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    en:"My Lord, have mercy upon them as they brought me up when I was small.",
    note:"One of the most powerful duas — especially impactful in Ramadan.",
    source:"Quran 17:24",
    color:"#ec4899", grad:"135deg,rgba(236,72,153,0.12),rgba(236,72,153,0.02)", border:"rgba(236,72,153,0.3)",
  },
  {
    category:"daily", label:"Dua for Guidance", badge:"Any Time",
    ar:"رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    en:"Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy.",
    note:"Ask this daily — keeping the heart firm is the greatest blessing.",
    source:"Quran 3:8",
    color:"#10b981", grad:"135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.02)", border:"rgba(16,185,129,0.3)",
  },
  {
    category:"daily", label:"Dua for Ease", badge:"Any Time",
    ar:"اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    en:"O Allah, nothing is easy except what You make easy, and You make the difficult easy when You will.",
    note:"Say when facing any difficulty during the fast.",
    source:"Ibn Hibban",
    color:"#0ea5e9", grad:"135deg,rgba(14,165,233,0.12),rgba(14,165,233,0.02)", border:"rgba(14,165,233,0.3)",
  },
  {
    category:"sujood", label:"Dua in Sujood", badge:"In Prayer",
    ar:"سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي",
    en:"Glory be to You, O Allah, our Lord, and with Your praise — O Allah, forgive me.",
    note:"The Prophet ﷺ recited this frequently in ruku and sujood.",
    source:"Bukhari 794",
    color:"#f43f5e", grad:"135deg,rgba(244,63,94,0.12),rgba(244,63,94,0.02)", border:"rgba(244,63,94,0.3)",
  },
  {
    category:"sujood", label:"Best of Duas", badge:"Sujood / Any",
    ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    en:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    note:"The Prophet ﷺ made this dua more than any other.",
    source:"Bukhari 4522",
    color:"#f59e0b", grad:"135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.02)", border:"rgba(245,158,11,0.3)",
  },
];

const CATEGORIES = [
  { key:"all",     label:"All Duas"     },
  { key:"niyyah",  label:"Niyyah"       },
  { key:"iftar",   label:"Iftar"        },
  { key:"qadr",    label:"Laylatul Qadr"},
  { key:"daily",   label:"Daily"        },
  { key:"sujood",  label:"Sujood"       },
];

// SVG Icons
const IcoCopy   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IcoChk    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoBook   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoHeart  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoFilter = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IcoInfo   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

export default function Duas() {
  const [filter,   setFilter]  = useState("all");
  const [copied,   setCopied]  = useState(null);
  const [expanded, setExpanded]= useState(null);
  const [fav,      setFav]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("duaFavs")||"[]"); } catch{ return []; }
  });

  const filtered = filter === "all"
    ? DUAS_DATA
    : filter === "fav"
    ? DUAS_DATA.filter((_,i) => fav.includes(i))
    : DUAS_DATA.filter(d => d.category === filter);

  const copyDua = (d, i) => {
    const text = `${d.ar}\n\n${d.en}\n\n— ${d.source}`;
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(i);
    setTimeout(()=>setCopied(null), 2000);
  };

  const toggleFav = (i) => {
    const next = fav.includes(i) ? fav.filter(x=>x!==i) : [...fav,i];
    setFav(next);
    localStorage.setItem("duaFavs", JSON.stringify(next));
  };

  return (
    <>
      <style>{`
        .dua-pg { width:100%; box-sizing:border-box; }

        /* Hero */
        .dua-hero {
          padding:22px 28px; border-radius:20px; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(167,139,250,0.05));
          border:1px solid rgba(245,158,11,0.25);
          display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
        }
        .dua-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; }
        .dua-sub   { font-size:.73rem; color:var(--muted); margin-top:3px; }
        .dua-chips { display:flex; gap:9px; flex-wrap:wrap; }
        .dua-chip  { padding:9px 13px; border-radius:11px; text-align:center; background:var(--card-bg); border:1px solid var(--card-border); min-width:64px; }
        .dua-chip-n { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:900; color:var(--gold); }
        .dua-chip-l { font-size:.52rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:1px; }

        /* Filter bar */
        .dua-filters { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; align-items:center; }
        .dua-filter-btn {
          padding:7px 16px; border-radius:50px; border:1.5px solid var(--border);
          background:var(--card-bg); color:var(--muted); font-family:'Nunito',sans-serif;
          font-size:.78rem; font-weight:700; cursor:pointer; transition:all .22s;
          display:flex; align-items:center; gap:6px;
        }
        .dua-filter-btn:hover { color:var(--text); border-color:var(--gold); }
        .dua-filter-btn.on { background:var(--gold-dim); border-color:rgba(245,158,11,.5); color:var(--gold2); }

        /* Duas grid */
        .dua-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

        /* Dua card */
        .dua-card {
          border-radius:18px; border:1px solid var(--card-border); overflow:hidden;
          background:var(--card-bg); transition:box-shadow .22s, transform .22s;
        }
        .dua-card:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.1); }

        /* Card top stripe */
        .dua-stripe { height:3px; }

        /* Card header */
        .dua-card-hd {
          padding:16px 18px 0; display:flex; align-items:center; gap:10px;
        }
        .dua-badge {
          padding:3px 10px; border-radius:50px; font-size:.6rem; font-weight:800;
          letter-spacing:1.5px; text-transform:uppercase; border:1px solid;
        }
        .dua-label { font-family:'Cinzel',serif; font-size:.82rem; font-weight:700; flex:1; }
        .dua-fav-btn {
          width:28px; height:28px; border-radius:8px; border:1px solid var(--border);
          background:transparent; cursor:pointer; display:flex; align-items:center;
          justify-content:center; color:var(--muted); transition:all .2s; flex-shrink:0;
        }
        .dua-fav-btn.on { color:#ec4899; border-color:rgba(236,72,153,0.4); background:rgba(236,72,153,0.1); }
        .dua-fav-btn:hover { border-color:var(--gold); color:var(--gold); }

        /* Card body */
        .dua-card-body { padding:14px 18px 16px; }
        .dua-ar {
          font-family:'Scheherazade New',serif; font-size:1.65rem;
          direction:rtl; text-align:right; line-height:1.9; margin-bottom:10px;
        }
        .dua-en {
          font-style:italic; font-size:.83rem; line-height:1.7; color:var(--muted);
          border-left:2px solid; padding-left:12px; margin-bottom:10px;
        }

        /* Expand section */
        .dua-expand { overflow:hidden; transition:max-height .3s ease; }
        .dua-note {
          padding:9px 13px; border-radius:10px; font-size:.76rem;
          color:var(--muted); line-height:1.6; display:flex; gap:8px; align-items:flex-start;
          margin-bottom:8px;
        }
        .dua-source {
          font-size:.65rem; letter-spacing:1.5px; text-transform:uppercase;
          color:var(--muted); opacity:.7;
        }

        /* Actions */
        .dua-actions { display:flex; gap:6px; margin-top:10px; }
        .dua-act-btn {
          padding:6px 12px; border-radius:9px; border:1px solid var(--border);
          background:var(--card-bg); color:var(--muted); font-family:'Nunito',sans-serif;
          font-size:.72rem; font-weight:700; cursor:pointer;
          display:inline-flex; align-items:center; gap:5px; transition:all .2s;
        }
        .dua-act-btn:hover { border-color:var(--gold); color:var(--gold2); }
        .dua-act-btn.copied { border-color:var(--teal); color:var(--teal2); background:rgba(13,148,136,0.08); }
        .dua-expand-btn {
          margin-left:auto; font-size:.7rem; color:var(--muted); background:none;
          border:none; cursor:pointer; font-family:'Nunito',sans-serif; font-weight:700;
          transition:color .2s; display:flex; align-items:center; gap:4px;
        }
        .dua-expand-btn:hover { color:var(--text); }

        /* Acceptance banner */
        .dua-banner {
          padding:18px 22px; border-radius:16px; margin-bottom:20px;
          display:flex; align-items:center; gap:14px; flex-wrap:wrap;
          background:linear-gradient(135deg,rgba(167,139,250,0.1),rgba(167,139,250,0.03));
          border:1px solid rgba(167,139,250,0.3); text-align:center;
        }
        .dua-banner-ar {
          font-family:'Scheherazade New',serif; font-size:1.5rem;
          direction:rtl; color:#a78bfa; line-height:1.8; flex:1; text-align:center;
        }

        .dua-empty { text-align:center; color:var(--muted); padding:40px 0; font-size:.85rem; }

        @media(max-width:900px){ .dua-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="dua-pg view-wrap">

        {/* Hero */}
        <div className="dua-hero">
          <div>
            <div className="dua-title">Essential Duas</div>
            <div className="dua-sub">Sehri, Iftar & Ramadan Remembrance</div>
          </div>
          <div className="dua-chips">
            {[
              { n:DUAS_DATA.length,  l:"Total Duas"   },
              { n:fav.length,        l:"Favourites"   },
              { n:"5",               l:"Categories"   },
              { n:"10",              l:"Sources"       },
            ].map((c,i)=>(
              <div className="dua-chip" key={i}>
                <div className="dua-chip-n">{c.n}</div>
                <div className="dua-chip-l">{c.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance banner */}
        <div className="dua-banner">
          <div style={{flex:1}}>
            <div style={{fontSize:".6rem",letterSpacing:2,color:"#a78bfa",textTransform:"uppercase",marginBottom:6}}>Three Guaranteed Times of Acceptance</div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              {["While Fasting 🌙","At Iftar 🌅","In Sujood 🤲"].map((t,i)=>(
                <div key={i} style={{padding:"6px 14px",borderRadius:50,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.3)",fontSize:".78rem",color:"#a78bfa",fontWeight:700}}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dua-filters">
          <div style={{color:"var(--muted)",display:"flex",alignItems:"center",gap:5,fontSize:".75rem"}}><IcoFilter/> Filter:</div>
          {CATEGORIES.map(c=>(
            <button key={c.key} className={`dua-filter-btn${filter===c.key?" on":""}`} onClick={()=>setFilter(c.key)}>
              {c.label}
            </button>
          ))}
          <button className={`dua-filter-btn${filter==="fav"?" on":""}`} onClick={()=>setFilter("fav")}
            style={filter==="fav"?{background:"rgba(236,72,153,0.1)",borderColor:"rgba(236,72,153,0.4)",color:"#ec4899"}:{}}>
            <IcoHeart/> Saved {fav.length>0&&`(${fav.length})`}
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0
          ? <div className="dua-empty">No duas in this category yet 🌙<br/><span style={{fontSize:".75rem",opacity:.6}}>Save some with the heart button!</span></div>
          : (
            <div className="dua-grid">
              {filtered.map((d, idx) => {
                const realIdx = DUAS_DATA.indexOf(d);
                const isExpanded = expanded === realIdx;
                const isFav = fav.includes(realIdx);
                const isCopied = copied === realIdx;
                return (
                  <div key={realIdx} className="dua-card">
                    <div className="dua-stripe" style={{background:`linear-gradient(90deg,${d.color},transparent)`}}/>
                    <div className="dua-card-hd">
                      <div className="dua-badge"
                        style={{color:d.color,borderColor:`${d.color}55`,background:`${d.color}12`}}>
                        {d.badge}
                      </div>
                      <div className="dua-label" style={{color:d.color}}>{d.label}</div>
                      <button className={`dua-fav-btn${isFav?" on":""}`} onClick={()=>toggleFav(realIdx)}>
                        <IcoHeart/>
                      </button>
                    </div>
                    <div className="dua-card-body">
                      <div className="dua-ar" style={{color:d.color}}>{d.ar}</div>
                      <div className="dua-en" style={{borderColor:`${d.color}55`}}>"{d.en}"</div>

                      {isExpanded && (
                        <div className="dua-expand">
                          <div className="dua-note" style={{background:`${d.color}0a`,border:`1px solid ${d.color}20`}}>
                            <span style={{color:d.color,flexShrink:0,marginTop:1}}><IcoInfo/></span>
                            {d.note}
                          </div>
                          <div className="dua-source"><IcoBook/>&nbsp; {d.source}</div>
                        </div>
                      )}

                      <div className="dua-actions">
                        <button className={`dua-act-btn${isCopied?" copied":""}`} onClick={()=>copyDua(d,realIdx)}>
                          {isCopied ? <><IcoChk/> Copied</> : <><IcoCopy/> Copy</>}
                        </button>
                        <button className="dua-expand-btn" onClick={()=>setExpanded(isExpanded?null:realIdx)}>
                          {isExpanded ? "▲ Less" : "▼ Source & Notes"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }

        {/* Bottom reminder */}
        <div style={{marginTop:22,padding:"16px 22px",borderRadius:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",textAlign:"center"}}>
          <div style={{fontFamily:"'Scheherazade New',serif",fontSize:"1.5rem",color:"var(--gold2)",direction:"rtl",lineHeight:1.8}}>
            وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ
          </div>
          <div style={{fontSize:".82rem",color:"var(--muted)",fontStyle:"italic",marginTop:6}}>
            "And your Lord says: Call upon Me, I will respond to you." — Quran 40:60
          </div>
        </div>

      </div>
    </>
  );
}