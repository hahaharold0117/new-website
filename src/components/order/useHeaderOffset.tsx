import { useEffect, useState } from "react";

export default function useHeaderOffset(extra = 8) {
  const [offset, setOffset] = useState(72);

  useEffect(() => {
    const calc = () => {
      const h =
        document.getElementById("site-header")?.getBoundingClientRect().height ??
        64;
      setOffset(Math.round(h + extra));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [extra]);

  return offset;
}
