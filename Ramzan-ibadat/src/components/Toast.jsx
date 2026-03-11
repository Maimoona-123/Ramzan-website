// src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);

  return <div className="toast">✓ {msg}</div>;
}
