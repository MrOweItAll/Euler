import { useEffect, useRef } from "react";
import { useEulerStore } from "@/lib/euler-store";

const p5Import = typeof window !== "undefined" ? import("p5") : null;

export function EulerCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let sketch: { remove: () => void } | null = null;
    let cancelled = false;

    const applySize = () => {
      const rect = host.getBoundingClientRect();
      useEulerStore
        .getState()
        .setViewport(Math.max(2, rect.width), Math.max(2, rect.height));
    };
    applySize();
    const ro = new ResizeObserver(applySize);
    ro.observe(host);

    void (async () => {
      const [p5Mod, { createEulerSketch }] = await Promise.all([
        p5Import ?? import("p5"),
        import("@/lib/euler-sketch"),
      ]);
      if (cancelled || !hostRef.current) return;
      applySize();
      const P5 = p5Mod.default;
      sketch = new P5(createEulerSketch(), hostRef.current);
    })();

    return () => {
      cancelled = true;
      ro.disconnect();
      sketch?.remove();
      sketch = null;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(event.deltaY * 0.0012);
      useEulerStore.getState().zoomBy(factor);
    };
    host.addEventListener("wheel", onWheel, { passive: false });
    return () => host.removeEventListener("wheel", onWheel);
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const first = pts[0];
      const second = pts[1];
      if (first && second) {
        pinch.current = Math.hypot(second.x - first.x, second.y - first.y);
      }
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(event.pointerId);
    if (!prev) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const pts = [...pointers.current.values()];
      const first = pts[0];
      const second = pts[1];
      if (!first || !second) return;
      const dist = Math.hypot(second.x - first.x, second.y - first.y);
      if (dist > 4) {
        useEulerStore.getState().zoomBy(pinch.current / dist);
        pinch.current = dist;
      }
      return;
    }

    const dx = event.clientX - prev.x;
    const dy = event.clientY - prev.y;
    if (dx === 0 && dy === 0) return;
    useEulerStore.getState().orbitBy(dx, dy);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  }

  function onDoubleClick() {
    useEulerStore.getState().resetCamera();
  }

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      role="img"
      aria-label="Three-dimensional electric and magnetic field wiggles. Drag to orbit."
    >
      <canvas className="pointer-events-none absolute size-px opacity-0" aria-hidden />
    </div>
  );
}
