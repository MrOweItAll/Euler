import { Pause, Play } from "lucide-react";
import { formatCycle } from "@/lib/euler-math";
import { useEulerStore } from "@/lib/euler-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function ThetaBar() {
  const phase = useEulerStore((s) => s.phase);
  const playing = useEulerStore((s) => s.playing);
  const togglePlaying = useEulerStore((s) => s.togglePlaying);
  const setPhase = useEulerStore((s) => s.setPhase);
  const tau = Math.PI * 2;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/90 p-2 pl-2 pr-3 shadow-[0_0_0_1px_rgb(236_234_228/0.04)] sm:gap-3 sm:p-3">
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
        <div className="flex items-baseline justify-between gap-3 px-1">
          <span className="text-xs text-muted">Cycle</span>
          <span className="text-xs font-medium tabular-nums text-fg">
            {formatCycle(phase)}
          </span>
        </div>
        <Slider
          min={0}
          max={tau}
          step={0.001}
          value={[phase]}
          onValueChange={([v]) => setPhase(v ?? 0)}
          aria-label="Wiggle cycle"
        />
      </div>
    </div>
  );
}
