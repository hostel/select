import React, { useRef, useState, useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";

/**
 * Hook for tracking size, position element
 *
 * @returns {[React.RefObject<any>, DOMRectReadOnly]} array with ref link and rect
 */
export const useMeasure = (): [any, DOMRectReadOnly] => {
  const ref = useRef<any>();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  useEffect((): React.EffectCallback => {
    if (ref.current) ro.observe(ref.current);
    return (): void => {
      ro.disconnect();
    };
  }, []);
  return [{ ref }, bounds];
};
