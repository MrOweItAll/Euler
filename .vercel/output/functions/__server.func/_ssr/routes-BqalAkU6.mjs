import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as Play, r as Pause } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BqalAkU6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var CYCLES = 2.15;
function zExtent() {
	return {
		zMin: -253.7,
		zMax: CYCLES * 236 / 2
	};
}
/** Electric (Ex, Ey) and magnetic (Bx, By) at a cycle angle. Travel is +Z. */
function fieldsAt(phase, shape, tilt, relPhase = 0) {
	const a = 118;
	const b = 118 * shape;
	const e1 = a * Math.cos(phase);
	const e2 = b * Math.sin(phase + relPhase);
	const c = Math.cos(tilt);
	const s = Math.sin(tilt);
	const Ex = c * e1 - s * e2;
	const Ey = s * e1 + c * e2;
	return {
		Ex,
		Ey,
		Bx: -Ey,
		By: Ex
	};
}
var VIEW_PRESETS = {
	orbit: {
		azimuth: .95,
		elevation: .38,
		distance: 780,
		label: "Orbit"
	},
	endon: {
		azimuth: 0,
		elevation: 0,
		distance: 500,
		label: "End-on"
	},
	side: {
		azimuth: Math.PI / 2,
		elevation: .08,
		distance: 720,
		label: "Side"
	},
	top: {
		azimuth: .06,
		elevation: 1.18,
		distance: 720,
		label: "Top"
	}
};
var DEFAULT_CAMERA = VIEW_PRESETS.orbit;
var EL_MIN = -1.42;
var EL_MAX = 1.42;
var DIST_MIN = 280;
var DIST_MAX = 1600;
function clamp(n, lo, hi) {
	return Math.max(lo, Math.min(hi, n));
}
function wrapAngle(a) {
	const tau = Math.PI * 2;
	return (a % tau + tau) % tau;
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function lerpAngle(a, b, t) {
	const tau = Math.PI * 2;
	let d = (b - a) % tau + tau;
	d = (d + Math.PI) % tau - Math.PI;
	return wrapAngle(a + d * t);
}
var useEulerStore = create((set, get) => ({
	phase: 0,
	relPhase: 0,
	playing: true,
	speed: .85,
	shape: .55,
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
	setSpeed: (speed) => set({ speed: clamp(speed, .15, 2.4) }),
	setShape: (shape) => set({ shape: clamp(shape, 0, 1) }),
	setTilt: (tilt) => set({ tilt: clamp(tilt, 0, Math.PI) }),
	setLock: (lock) => {
		const next = clamp(lock, 0, 1);
		set({
			lock: next,
			relPhase: next > .97 ? 0 : get().relPhase
		});
	},
	setCamera: (partial) => {
		const azimuth = partial.azimuth !== void 0 ? wrapAngle(partial.azimuth) : get().azimuth;
		const elevation = partial.elevation !== void 0 ? clamp(partial.elevation, EL_MIN, EL_MAX) : get().elevation;
		const distance = partial.distance !== void 0 ? clamp(partial.distance, DIST_MIN, DIST_MAX) : get().distance;
		set({
			azimuth,
			elevation,
			distance,
			targetAzimuth: azimuth,
			targetElevation: elevation,
			targetDistance: distance
		});
	},
	orbitBy: (dx, dy) => {
		const azimuth = wrapAngle(get().azimuth - dx * .0055);
		const elevation = clamp(get().elevation + dy * .0045, EL_MIN, EL_MAX);
		set({
			azimuth,
			elevation,
			targetAzimuth: azimuth,
			targetElevation: elevation
		});
	},
	zoomBy: (factor) => {
		const distance = clamp(get().distance * factor, DIST_MIN, DIST_MAX);
		set({
			distance,
			targetDistance: distance
		});
	},
	applyPreset: (id) => {
		const preset = VIEW_PRESETS[id];
		set({
			targetAzimuth: preset.azimuth,
			targetElevation: preset.elevation,
			targetDistance: preset.distance
		});
	},
	resetCamera: () => set({
		targetAzimuth: DEFAULT_CAMERA.azimuth,
		targetElevation: DEFAULT_CAMERA.elevation,
		targetDistance: DEFAULT_CAMERA.distance
	}),
	setShowE: (showE) => set({ showE }),
	setShowB: (showB) => set({ showB }),
	setShowArrows: (showArrows) => set({ showArrows }),
	setShowSlice: (showSlice) => set({ showSlice }),
	setViewport: (width, height) => set({
		width,
		height
	}),
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
		if (wander > .02) {
			relPhase += (Math.random() - .5) * wander * wander * 2.8 * dt;
			relPhase *= 1 - dt * .15;
		} else relPhase *= 1 - dt * 4;
		set({
			azimuth,
			elevation,
			distance,
			phase,
			relPhase
		});
	}
}));
var p5Import = typeof window !== "undefined" ? import("../_libs/p5.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())) : null;
function EulerCanvas() {
	const hostRef = (0, import_react.useRef)(null);
	const pointers = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const pinch = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		let sketch = null;
		let cancelled = false;
		const applySize = () => {
			const rect = host.getBoundingClientRect();
			useEulerStore.getState().setViewport(Math.max(2, rect.width), Math.max(2, rect.height));
		};
		applySize();
		const ro = new ResizeObserver(applySize);
		ro.observe(host);
		(async () => {
			const [p5Mod, { createEulerSketch }] = await Promise.all([p5Import ?? import("../_libs/p5.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("./euler-sketch-CrqZxLI1.mjs")]);
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
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		const onWheel = (event) => {
			event.preventDefault();
			const factor = Math.exp(event.deltaY * .0012);
			useEulerStore.getState().zoomBy(factor);
		};
		host.addEventListener("wheel", onWheel, { passive: false });
		return () => host.removeEventListener("wheel", onWheel);
	}, []);
	function onPointerDown(event) {
		if (event.button !== 0 && event.pointerType === "mouse") return;
		event.currentTarget.setPointerCapture(event.pointerId);
		pointers.current.set(event.pointerId, {
			x: event.clientX,
			y: event.clientY
		});
		if (pointers.current.size === 2) {
			const pts = [...pointers.current.values()];
			const first = pts[0];
			const second = pts[1];
			if (first && second) pinch.current = Math.hypot(second.x - first.x, second.y - first.y);
		}
	}
	function onPointerMove(event) {
		const prev = pointers.current.get(event.pointerId);
		if (!prev) return;
		pointers.current.set(event.pointerId, {
			x: event.clientX,
			y: event.clientY
		});
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
	function onPointerUp(event) {
		pointers.current.delete(event.pointerId);
		if (pointers.current.size < 2) pinch.current = null;
	}
	function onDoubleClick() {
		useEulerStore.getState().resetCamera();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "absolute inset-0 touch-none",
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
		onDoubleClick,
		role: "img",
		"aria-label": "Three-dimensional electric and magnetic field wiggles. Drag to orbit.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			className: "pointer-events-none absolute size-px opacity-0",
			"aria-hidden": true
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg hover:bg-surface-2/80",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[0_0_0_1px_rgb(236_234_228/0.12)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" })]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-4 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-accent-fg" })
	});
}
function ControlsForm() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const speed = useEulerStore((s) => s.speed);
	const shape = useEulerStore((s) => s.shape);
	const showE = useEulerStore((s) => s.showE);
	const showB = useEulerStore((s) => s.showB);
	const playing = useEulerStore((s) => s.playing);
	const togglePlaying = useEulerStore((s) => s.togglePlaying);
	const setSpeed = useEulerStore((s) => s.setSpeed);
	const setShape = useEulerStore((s) => s.setShape);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-base text-fg",
			children: "Field Wiggles"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "Polarization is which way light’s electric shake aims across its path."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-base leading-tight text-fg",
					children: "Field Wiggles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-pretty text-xs leading-snug text-muted sm:text-sm",
					children: "Polarization is which way light’s electric shake aims across its path — a line, an oval, or a circle. Nature does this on its own: blue sky, glare off water, some starlight. In the lab we choose the aim on purpose to cut glare, measure surfaces, and send a clean signal. A polarizer does not change the color. It keeps the shake that lines up and dumps the rest. Gold is electric, blue is magnetic; they stay partners at right angles."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					size: "icon",
					"aria-label": playing ? "Pause" : "Play",
					onClick: togglePlaying,
					className: "shrink-0",
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "speed",
							children: "Wiggle speed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs tabular-nums text-muted",
							children: speed.toFixed(2)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "speed",
						min: .15,
						max: 2.4,
						step: .05,
						value: [speed],
						onValueChange: ([v]) => setSpeed(v ?? speed)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "shape",
					children: "How flat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tabular-nums text-muted",
					children: shape < .08 ? "line" : shape > .92 ? "circle" : "ellipse"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				id: "shape",
				min: 0,
				max: 1,
				step: .01,
				value: [shape],
				onValueChange: ([v]) => setShape(v ?? shape)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-10 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "gold",
						checked: showE,
						onCheckedChange: useEulerStore.getState().setShowE
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "gold",
						className: "text-real",
						children: "Gold"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-10 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "blue",
						checked: showB,
						onCheckedChange: useEulerStore.getState().setShowB
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "blue",
						className: "text-imag",
						children: "Blue"
					})]
				})]
			})
		]
	});
}
function TooltipProvider({ delayDuration = 200, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
function AppShell() {
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) useEulerStore.getState().setPlaying(false);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
			const store = useEulerStore.getState();
			if (event.code === "Space") {
				event.preventDefault();
				store.togglePlaying();
			} else if (event.key === "r" || event.key === "R") store.resetCamera();
			else if (event.key === "1") store.applyPreset("orbit");
			else if (event.key === "2") store.applyPreset("endon");
			else if (event.key === "3") store.applyPreset("side");
			else if (event.key === "4") store.applyPreset("top");
			else if (event.key === "ArrowLeft") store.orbitBy(-24, 0);
			else if (event.key === "ArrowRight") store.orbitBy(24, 0);
			else if (event.key === "ArrowUp") store.orbitBy(0, -24);
			else if (event.key === "ArrowDown") store.orbitBy(0, 24);
			else if (event.key === "=" || event.key === "+") store.zoomBy(.9);
			else if (event.key === "-" || event.key === "_") store.zoomBy(1.1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative min-h-0 flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EulerCanvas, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "pointer-events-auto z-10 shrink-0 border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsForm, {})
		})]
	}) });
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { zExtent as a, fieldsAt as i, useEulerStore as n, CYCLES as r, routes_exports as t };
