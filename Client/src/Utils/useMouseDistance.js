import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track mouse distance from the start of a component.
 * @param {React.RefObject} elementRef - Ref to the element to measure from
 * @returns {number} Distance in pixels from mouse to element's left edge
 */
export function useMouseDistance(elementRef) {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const distanceFromStart = mouseX - rect.left;

      setDistance(distanceFromStart);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [elementRef]);

  return distance;
}