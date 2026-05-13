import { useEffect, useRef, useState } from "react";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useFadeIn({ delay = 0, direction = "up", threshold = 0.12 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(REDUCED);

  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const offsets = { up: "translateY(24px)", left: "translateX(-28px)", right: "translateX(28px)" };

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : (offsets[direction] ?? offsets.up),
      transition: `opacity 280ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 280ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
    },
  };
}
