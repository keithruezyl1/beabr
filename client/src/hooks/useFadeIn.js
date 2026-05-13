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

  const offsets = { up: "translateY(20px)", left: "translateX(-24px)", right: "translateX(24px)" };

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : (offsets[direction] ?? offsets.up),
      filter: visible ? "blur(0px)" : "blur(3px)",
      transition: [
        `opacity 520ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
        `transform 520ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
        `filter 520ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
      ].join(", "),
    },
  };
}