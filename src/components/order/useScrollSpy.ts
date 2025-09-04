import { MutableRefObject, useEffect, useState } from "react";

export default function useScrollSpy(
  sectionIds: string[],
  rootRef?: MutableRefObject<HTMLElement | null> | null,
  offset = 16
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    const root = rootRef?.current ?? null;
    const seen = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).id;
          if (!id) continue;
          if (e.isIntersecting) seen.set(id, e.boundingClientRect.top);
          else seen.delete(id);
        }
        if (seen.size) {
          const next = [...seen.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActiveId(next);
        }
      },
      {
        root,
        rootMargin: `-${offset}px 0px -70% 0px`,
        threshold: [0, 0.1, 0.6],
      }
    );

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as Element[];
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds.join(","), rootRef, offset]);

  return activeId;
}
