import { fieldsAt, formatCycle } from "@/lib/euler-math";
import { useEulerStore } from "@/lib/euler-store";

export function EquationPanel() {
  const phase = useEulerStore((s) => s.phase);
  const shape = useEulerStore((s) => s.shape);
  const tilt = useEulerStore((s) => s.tilt);
  const relPhase = useEulerStore((s) => s.relPhase);
  const lock = useEulerStore((s) => s.lock);
  const f = fieldsAt(phase, shape, tilt, relPhase);
  const eMag = Math.hypot(f.Ex, f.Ey);
  const bMag = Math.hypot(f.Bx, f.By);
  const shapeWord =
    shape < 0.08 ? "a line" : shape > 0.92 ? "a circle" : "an ellipse";

  return (
    <section className="pointer-events-none max-w-[min(100%,24rem)] rounded-xl border border-border bg-surface/90 p-3 shadow-[0_0_0_1px_rgb(236_234_228/0.04)] sm:p-4">
      <p className="font-display text-lg leading-tight tracking-tight text-fg text-balance sm:text-xl">
        Field Wiggles
      </p>
      <p className="mt-1 text-sm text-muted text-pretty">
        Gold is the electric shake. Blue is the magnetic shake. They stay at
        right angles and rise together. Drag to look from any angle.
      </p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm tabular-nums">
        <dt className="text-muted">Cycle</dt>
        <dd className="text-fg">{formatCycle(phase)}</dd>
        <dt className="text-real">Electric</dt>
        <dd className="text-fg">{eMag.toFixed(0)}</dd>
        <dt className="text-imag">Magnetic</dt>
        <dd className="text-fg">{bMag.toFixed(0)}</dd>
      </dl>
      <p className="mt-3 rounded-md bg-surface-2 px-3 py-2 text-sm text-fg text-pretty">
        The sideways tip traces {shapeWord}
        {lock < 0.5 ? ", and the timing is wandering." : "."}
      </p>
    </section>
  );
}
