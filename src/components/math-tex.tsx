import katex from "katex";
import { cn } from "@/lib/utils";

type MathTexProps = {
  tex: string;
  display?: boolean;
  className?: string;
};

export function MathTex({ tex, display = false, className }: MathTexProps) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  });
  return (
    <span
      className={cn("katex-host", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
