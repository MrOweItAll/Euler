import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useEulerStore } from "@/lib/euler-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function ControlsForm() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const speed = useEulerStore((s) => s.speed);
  const shape = useEulerStore((s) => s.shape);
  const showE = useEulerStore((s) => s.showE);
  const showB = useEulerStore((s) => s.showB);
  const playing = useEulerStore((s) => s.playing);
  const togglePlaying = useEulerStore((s) => s.togglePlaying);
  const setSpeed = useEulerStore((s) => s.setSpeed);
  const setShape = useEulerStore((s) => s.setShape);

  if (!ready) {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-display text-base text-fg">Field Wiggles</p>
        <p className="text-xs text-muted">
          Polarization is which way light’s electric shake aims across its path.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-base leading-tight text-fg">Field Wiggles</p>
        <p className="text-pretty text-xs leading-snug text-muted sm:text-sm">
          Polarization is which way light’s electric shake aims across its path —
          a line, an oval, or a circle. Nature does this on its own: blue sky,
          glare off water, some starlight. In the lab we choose the aim on
          purpose to cut glare, measure surfaces, and send a clean signal. A
          polarizer does not change the color. It keeps the shake that lines up
          and dumps the rest. Gold is electric, blue is magnetic; they stay
          partners at right angles.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlaying}
          className="shrink-0"
        >
          {playing ? <Pause /> : <Play className="ml-0.5" />}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="speed">Wiggle speed</Label>
            <span className="text-xs tabular-nums text-muted">{speed.toFixed(2)}</span>
          </div>
          <Slider
            id="speed"
            min={0.15}
            max={2.4}
            step={0.05}
            value={[speed]}
            onValueChange={([v]) => setSpeed(v ?? speed)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="shape">How flat</Label>
          <span className="text-xs tabular-nums text-muted">
            {shape < 0.08 ? "line" : shape > 0.92 ? "circle" : "ellipse"}
          </span>
        </div>
        <Slider
          id="shape"
          min={0}
          max={1}
          step={0.01}
          value={[shape]}
          onValueChange={([v]) => setShape(v ?? shape)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex h-10 items-center gap-2">
          <Switch
            id="gold"
            checked={showE}
            onCheckedChange={useEulerStore.getState().setShowE}
          />
          <Label htmlFor="gold" className="text-real">
            Gold
          </Label>
        </div>
        <div className="flex h-10 items-center gap-2">
          <Switch
            id="blue"
            checked={showB}
            onCheckedChange={useEulerStore.getState().setShowB}
          />
          <Label htmlFor="blue" className="text-imag">
            Blue
          </Label>
        </div>
      </div>
    </div>
  );
}
