import { create } from "zustand";
import {
  DEFAULT_CAMERA,
  VIEW_PRESETS,
  type ViewPresetId,
} from "./euler-math";

export type EulerState = {
  phase: number;
  relPhase: number;
  playing: boolean;
  speed: number;
  shape: number;
  tilt: number;
  lock: number;
  azimuth: number;
  elevation: number;
  distance: number;
  targetAzimuth: number;
  targetElevation: number;
  targetDistance: number;
  showE: boolean;
  showB: boolean;
  showArrows: boolean;
  showSlice: boolean;
  width: number;
  height: number;
  setPhase: (phase: number) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setSpeed: (speed: number) => void;
  setShape: (shape: number) => void;
  setTilt: (tilt: number) => void;
  setLock: (lock: number) => void;
  setCamera: (partial: {
    azimuth?: number;
    elevation?: number;
    distance?: number;
  }) => void;
  orbitBy: (dx: number, dy: number) => void;
  zoomBy: (factor: number) => void;
  applyPreset: (id: ViewPresetId) => void;
  resetCamera: () => void;
  setShowE: (v: boolean) => void;
  setShowB: (v: boolean) => void;
  setShowArrows: (v: boolean) => void;
  setShowSlice: (v: boolean) => void;
  setViewport: (width: number, height: number) => void;
  stepAnimation: (dt: number) => void;
};

const EL_MIN = -1.42;
const EL_MAX = 1.42;
const DIST_MIN = 280;
const DIST_MAX = 1600;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function wrapAngle(a: number) {
  const tau = Math.PI * 2;
  return ((a % tau) + tau) % tau;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number) {
  const tau = Math.PI * 2;
  let d = ((b - a) % tau) + tau;
  d = ((d + Math.PI) % tau) - Math.PI;
  return wrapAngle(a + d * t);
}

export const useEulerStore = create<EulerState>((set, get) => ({
  phase: 0,
  relPhase: 0,
  playing: true,
  speed: 0.85,
  shape: 0.55,
  tilt: 0,
  lock: 1,
  azimuth: DEFAULT_CAMERA.azimuth,
  elevation: DEFAULT_CAMERA.elevation,
  distance: DEFAULT_CAMERA.distance,
  targetAzimuth: DEFAULT_CAMERA.azimuth,
  targetElevation: DEFAULT_CAMERA.elevation,
  targetDistance: DEFAULT_CAMERA.distance,
  showE: true,
  showB: true,
  showArrows: false,
  showSlice: true,
  width: 800,
  height: 600,
  setPhase: (phase) => set({ phase: wrapAngle(phase) }),
  setPlaying: (playing) => set({ playing }),
  togglePlaying: () => set({ playing: !get().playing }),
  setSpeed: (speed) => set({ speed: clamp(speed, 0.15, 2.4) }),
  setShape: (shape) => set({ shape: clamp(shape, 0, 1) }),
  setTilt: (tilt) => set({ tilt: clamp(tilt, 0, Math.PI) }),
  setLock: (lock) => {
    const next = clamp(lock, 0, 1);
    set({ lock: next, relPhase: next > 0.97 ? 0 : get().relPhase });
  },
  setCamera: (partial) => {
    const azimuth =
      partial.azimuth !== undefined
        ? wrapAngle(partial.azimuth)
        : get().azimuth;
    const elevation =
      partial.elevation !== undefined
        ? clamp(partial.elevation, EL_MIN, EL_MAX)
        : get().elevation;
    const distance =
      partial.distance !== undefined
        ? clamp(partial.distance, DIST_MIN, DIST_MAX)
        : get().distance;
    set({
      azimuth,
      elevation,
      distance,
      targetAzimuth: azimuth,
      targetElevation: elevation,
      targetDistance: distance,
    });
  },
  orbitBy: (dx, dy) => {
    const azimuth = wrapAngle(get().azimuth - dx * 0.0055);
    const elevation = clamp(get().elevation + dy * 0.0045, EL_MIN, EL_MAX);
    set({
      azimuth,
      elevation,
      targetAzimuth: azimuth,
      targetElevation: elevation,
    });
  },
  zoomBy: (factor) => {
    const distance = clamp(get().distance * factor, DIST_MIN, DIST_MAX);
    set({ distance, targetDistance: distance });
  },
  applyPreset: (id) => {
    const preset = VIEW_PRESETS[id];
    set({
      targetAzimuth: preset.azimuth,
      targetElevation: preset.elevation,
      targetDistance: preset.distance,
    });
  },
  resetCamera: () =>
    set({
      targetAzimuth: DEFAULT_CAMERA.azimuth,
      targetElevation: DEFAULT_CAMERA.elevation,
      targetDistance: DEFAULT_CAMERA.distance,
    }),
  setShowE: (showE) => set({ showE }),
  setShowB: (showB) => set({ showB }),
  setShowArrows: (showArrows) => set({ showArrows }),
  setShowSlice: (showSlice) => set({ showSlice }),
  setViewport: (width, height) => set({ width, height }),
  stepAnimation: (dt) => {
    const state = get();
    const k = 1 - Math.exp(-dt * 4.8);
    const azimuth = lerpAngle(state.azimuth, state.targetAzimuth, k);
    const elevation = lerp(state.elevation, state.targetElevation, k);
    const distance = lerp(state.distance, state.targetDistance, k);

    let phase = state.phase;
    if (state.playing) phase = wrapAngle(phase + state.speed * dt * 1.15);

    let relPhase = state.relPhase;
    const wander = 1 - state.lock;
    if (wander > 0.02) {
      relPhase += (Math.random() - 0.5) * wander * wander * 2.8 * dt;
      relPhase *= 1 - dt * 0.15;
    } else {
      relPhase *= 1 - dt * 4;
    }

    set({ azimuth, elevation, distance, phase, relPhase });
  },
}));
