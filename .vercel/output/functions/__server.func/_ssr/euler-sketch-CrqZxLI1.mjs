import { a as zExtent, i as fieldsAt, n as useEulerStore, r as CYCLES } from "./routes-BqalAkU6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/euler-sketch-CrqZxLI1.js
var BG = [
	10,
	11,
	14
];
var CREAM = [
	236,
	234,
	228
];
var ELEC = [
	232,
	184,
	109
];
var MAG = [
	109,
	183,
	232
];
var AXIS = [
	154,
	154,
	148
];
function strokeRgb(p, c, a = 255) {
	p.stroke(c[0], c[1], c[2], a);
}
function fillRgb(p, c, a = 255) {
	p.fill(c[0], c[1], c[2], a);
}
function makeLabel(p, text, rgb) {
	const pg = p.createGraphics(180, 64);
	pg.pixelDensity(2);
	pg.clear();
	pg.fill(rgb[0], rgb[1], rgb[2], 230);
	pg.textAlign(p.CENTER, p.CENTER);
	pg.textFont("Source Sans 3, system-ui, sans-serif");
	pg.textSize(26);
	pg.text(text, 90, 32);
	return pg;
}
function cameraPos(azimuth, elevation, distance) {
	const ce = Math.cos(elevation);
	return {
		x: distance * ce * Math.sin(azimuth),
		y: distance * Math.sin(elevation),
		z: distance * ce * Math.cos(azimuth)
	};
}
function drawArrow(p, x1, y1, z1, x2, y2, z2, color, weight, tip = 5) {
	p.strokeWeight(weight);
	strokeRgb(p, color, 230);
	p.line(x1, y1, z1, x2, y2, z2);
	p.noStroke();
	fillRgb(p, color, 255);
	p.push();
	p.translate(x2, y2, z2);
	p.sphere(tip);
	p.pop();
}
function createEulerSketch() {
	return (p) => {
		const labels = {};
		p.setup = () => {
			const { width, height } = useEulerStore.getState();
			const w = Math.max(2, Math.floor(width));
			const h = Math.max(2, Math.floor(height));
			const canvas = p.createCanvas(w, h, p.WEBGL);
			canvas.elt.style.display = "block";
			canvas.elt.style.position = "absolute";
			canvas.elt.style.inset = "0";
			canvas.elt.style.touchAction = "none";
			const cells = w * h * Math.min(window.devicePixelRatio || 1, 2);
			p.pixelDensity(cells > 24e5 ? 1 : Math.min(2, window.devicePixelRatio || 1));
			p.disableFriendlyErrors = true;
			labels.e = makeLabel(p, "electric", ELEC);
			labels.b = makeLabel(p, "magnetic", MAG);
			labels.z = makeLabel(p, "travel", AXIS);
		};
		p.draw = () => {
			const state = useEulerStore.getState();
			const w = Math.max(2, Math.floor(state.width));
			const h = Math.max(2, Math.floor(state.height));
			if (p.width !== w || p.height !== h) p.resizeCanvas(w, h);
			const dt = Math.min((p.deltaTime || 16) / 1e3, .1);
			state.stepAnimation(dt);
			const { azimuth, elevation, distance, phase, shape, tilt, relPhase, showE, showB, showArrows, showSlice } = useEulerStore.getState();
			const cam = cameraPos(azimuth, elevation, distance);
			p.camera(cam.x, cam.y, cam.z, 0, 0, 0, 0, 1, 0);
			p.background(BG[0], BG[1], BG[2]);
			p.perspective(Math.PI / 3.2, w / h, 8, 6e3);
			p.ambientLight(40, 42, 48);
			p.directionalLight(210, 205, 196, -.4, -.7, -.35);
			p.pointLight(140, 136, 128, cam.x, cam.y, cam.z);
			const { zMin, zMax } = zExtent();
			p.strokeWeight(1.6);
			strokeRgb(p, AXIS, 160);
			p.line(0, 0, zMin - 48, 0, 0, zMax + 48);
			p.strokeWeight(1.1);
			strokeRgb(p, AXIS, 50);
			p.line(-166, 0, 0, 166, 0, 0);
			p.line(0, -166, 0, 0, 166, 0);
			const segs = Math.max(48, Math.round(CYCLES * 64));
			const k = Math.PI * 2 / 236;
			const ePts = [];
			const bPts = [];
			for (let i = 0; i <= segs; i++) {
				const z = zMin + i / segs * (zMax - zMin);
				const f = fieldsAt(phase - k * z, shape, tilt, relPhase);
				ePts.push({
					x: f.Ex,
					y: f.Ey,
					z
				});
				bPts.push({
					x: f.Bx,
					y: f.By,
					z
				});
			}
			p.noFill();
			if (showE) {
				p.strokeWeight(2.8);
				strokeRgb(p, ELEC, 235);
				p.beginShape();
				for (const pt of ePts) p.vertex(pt.x, pt.y, pt.z);
				p.endShape();
				p.strokeWeight(1.2);
				strokeRgb(p, ELEC, 50);
				p.beginShape();
				for (const pt of ePts) p.vertex(pt.x, pt.y, pt.z);
				p.endShape();
			}
			if (showB) {
				p.strokeWeight(2.8);
				strokeRgb(p, MAG, 235);
				p.beginShape();
				for (const pt of bPts) p.vertex(pt.x, pt.y, pt.z);
				p.endShape();
			}
			if (showArrows) {
				const step = 8;
				for (let i = 0; i <= segs; i += step) {
					const e = ePts[i];
					const b = bPts[i];
					if (!e || !b) continue;
					if (showE) drawArrow(p, 0, 0, e.z, e.x, e.y, e.z, ELEC, 1.4, 3.2);
					if (showB) drawArrow(p, 0, 0, b.z, b.x, b.y, b.z, MAG, 1.4, 3.2);
				}
			}
			if (showSlice) {
				p.noFill();
				p.strokeWeight(1.6);
				if (showE) {
					strokeRgb(p, ELEC, 80);
					p.beginShape();
					for (let i = 0; i <= 96; i++) {
						const ph = i / 96 * Math.PI * 2;
						const f = fieldsAt(ph, shape, tilt, relPhase);
						p.vertex(f.Ex, f.Ey, 0);
					}
					p.endShape(p.CLOSE);
				}
				if (showB) {
					strokeRgb(p, MAG, 80);
					p.beginShape();
					for (let i = 0; i <= 96; i++) {
						const ph = i / 96 * Math.PI * 2;
						const f = fieldsAt(ph, shape, tilt, relPhase);
						p.vertex(f.Bx, f.By, 0);
					}
					p.endShape(p.CLOSE);
				}
				const now = fieldsAt(phase, shape, tilt, relPhase);
				if (showE) drawArrow(p, 0, 0, 0, now.Ex, now.Ey, 0, ELEC, 3.2, 7);
				if (showB) drawArrow(p, 0, 0, 0, now.Bx, now.By, 0, MAG, 3.2, 7);
			}
			p.noStroke();
			fillRgb(p, CREAM, 220);
			p.push();
			p.translate(0, 0, 0);
			p.sphere(4.5);
			p.pop();
			if (labels.e && labels.b && labels.z) {
				p.noLights();
				p.ambientLight(255);
				const billboard = (x, y, z, g) => {
					p.push();
					p.translate(x, y, z);
					p.rotateY(azimuth);
					p.rotateX(-elevation);
					p.texture(g);
					p.noStroke();
					p.plane(70, 24);
					p.pop();
				};
				const now = fieldsAt(phase, shape, tilt, relPhase);
				if (showE) billboard(now.Ex * 1.12, now.Ey * 1.12, 8, labels.e);
				if (showB) billboard(now.Bx * 1.12, now.By * 1.12, -8, labels.b);
				billboard(0, 0, zMax + 48 * .7, labels.z);
			}
		};
	};
}
//#endregion
export { createEulerSketch };
