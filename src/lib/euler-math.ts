export const AMP = 118;
export const WAVE_LEN = 236;
export const CYCLES = 2.15;
export const AXIS_PAD = 48;

export type Vec3 = { x: number; y: number; z: number };

export function wrapTau(theta: number): number {
  const tau = Math.PI * 2;
  return ((theta % tau) + tau) % tau;
}

export function zExtent(): { zMin: number; zMax: number } {
  const half = (CYCLES * WAVE_LEN) / 2;
  return { zMin: -half, zMax: half };
}

/** Electric (Ex, Ey) and magnetic (Bx, By) at a cycle angle. Travel is +Z. */
export function fieldsAt(
  phase: number,
  shape: number,
  tilt: number,
  relPhase = 0,
): { Ex: number; Ey: number; Bx: number; By: number } {
  const a = AMP;
  const b = AMP * shape;
  const e1 = a * Math.cos(phase);
  const e2 = b * Math.sin(phase + relPhase);
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  const Ex = c * e1 - s * e2;
  const Ey = s * e1 + c * e2;
  return { Ex, Ey, Bx: -Ey, By: Ex };
}

export function formatCycle(phase: number): string {
  const t = wrapTau(phase);
  const n = t / Math.PI;
  const nice: Array<[number, string]> = [
    [0, "0"],
    [0.5, "¼ turn"],
    [1, "½ turn"],
    [1.5, "¾ turn"],
    [2, "1 turn"],
  ];
  for (const [v, label] of nice) {
    if (Math.abs(n - v) < 0.04) return label;
  }
  return `${(t / (Math.PI * 2)).toFixed(2)} turn`;
}

export type ViewPresetId = "orbit" | "endon" | "side" | "top";

export const VIEW_PRESETS: Record<
  ViewPresetId,
  { azimuth: number; elevation: number; distance: number; label: string }
> = {
  orbit: { azimuth: 0.95, elevation: 0.38, distance: 780, label: "Orbit" },
  endon: { azimuth: 0, elevation: 0, distance: 500, label: "End-on" },
  side: { azimuth: Math.PI / 2, elevation: 0.08, distance: 720, label: "Side" },
  top: { azimuth: 0.06, elevation: 1.18, distance: 720, label: "Top" },
};

export const DEFAULT_CAMERA = VIEW_PRESETS.orbit;
