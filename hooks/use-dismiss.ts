import { useEffect, useRef } from "react";

/** Closes `onClose` on outside click or Escape while `active`. */
export const useDismiss = <T extends HTMLElement>(active: boolean, onClose: () => void) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);
  return ref;
}