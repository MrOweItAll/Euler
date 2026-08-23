import { useEffect } from "react";
import { EulerCanvas } from "@/components/euler-canvas";
import { ControlsForm } from "@/components/controls-form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEulerStore } from "@/lib/euler-store";

export function AppShell() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      useEulerStore.getState().setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      const store = useEulerStore.getState();
      if (event.code === "Space") {
        event.preventDefault();
        store.togglePlaying();
      } else if (event.key === "r" || event.key === "R") {
        store.resetCamera();
      } else if (event.key === "1") store.applyPreset("orbit");
      else if (event.key === "2") store.applyPreset("endon");
      else if (event.key === "3") store.applyPreset("side");
      else if (event.key === "4") store.applyPreset("top");
      else if (event.key === "ArrowLeft") store.orbitBy(-24, 0);
      else if (event.key === "ArrowRight") store.orbitBy(24, 0);
      else if (event.key === "ArrowUp") store.orbitBy(0, -24);
      else if (event.key === "ArrowDown") store.orbitBy(0, 24);
      else if (event.key === "=" || event.key === "+") store.zoomBy(0.9);
      else if (event.key === "-" || event.key === "_") store.zoomBy(1.1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <TooltipProvider>
      <main className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
        <div className="relative min-h-0 flex-1">
          <EulerCanvas />
        </div>
        <section className="pointer-events-auto z-10 shrink-0 border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <ControlsForm />
        </section>
      </main>
    </TooltipProvider>
  );
}
