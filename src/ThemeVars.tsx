// src/components/ThemeVars.tsx
import { useEffect } from "react";

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex?.trim() || "");
  if (!m) return [63, 95, 47]; // fallback green
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export default function ThemeVars({ color }: { color?: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const fallback = "#3f5f2f";
    const c = color && /^#([A-Fa-f0-9]{6})$/.test(color) ? color : fallback;
    const [r, g, b] = hexToRgb(c);

    root.style.setProperty("--brand", c);               // full color
    root.style.setProperty("--brand-rgb", `${r},${g},${b}`); // for rgba()
    // handy tints
    root.style.setProperty("--brand-10", `rgba(${r},${g},${b},0.10)`);
    root.style.setProperty("--brand-20", `rgba(${r},${g},${b},0.20)`);
    root.style.setProperty("--brand-90", `rgba(${r},${g},${b},0.90)`);
  }, [color]);

  return null;
}
