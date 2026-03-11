// src/components/CircleProgress.jsx
export default function CircleProgress({ value, max, size=180, color="#f59e0b", strokeWidth=9, children }) {
  const r       = (size - strokeWidth * 2) / 2;
  const circ    = 2 * Math.PI * r;
  const pct     = Math.min(value / (max || 1), 1);
  const dash    = pct * circ;

  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{
            transition:"stroke-dasharray .6s ease",
            filter:`drop-shadow(0 0 7px ${color})`,
          }}/>
      </svg>
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        {children}
      </div>
    </div>
  );
}
