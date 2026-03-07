"use client";

import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";

interface LoadingPageProps {
  hue?: number;
  text?: string;
}

const LoadingPage = ({ hue = 280, text }: LoadingPageProps) => (
  <div className="relative flex h-full min-h-[50vh] w-full items-center justify-center overflow-hidden">
    {/* Lightning WebGL background */}
    <div className="absolute inset-0 opacity-40">
      <Lightning hue={hue} speed={0.6} intensity={1.2} size={1.2} />
    </div>

    {/* Radial vignette overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_80%)]" />

    {/* Center content */}
    <div className="relative z-10 flex flex-col items-center gap-6">
      {/* Pulsing orb */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-ping rounded-full bg-primary/20" />
        <div className="absolute size-12 animate-pulse rounded-full bg-primary/30 blur-md" />
        <div className="relative size-4 rounded-full bg-primary shadow-[0_0_20px_4px] shadow-primary/50" />
      </div>

      {text && (
        <p className="animate-pulse text-sm font-medium tracking-wide text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  </div>
);

export default LoadingPage;
