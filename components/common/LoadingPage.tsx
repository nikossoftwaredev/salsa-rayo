"use client";

import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";

interface LoadingPageProps {
  hue?: number;
  text?: string;
}

const LoadingPage = ({ hue = 280, text }: LoadingPageProps) => (
  <div className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-40">
      <Lightning hue={hue} speed={0.6} intensity={1.2} size={1.2} />
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_80%)]" />

    {text && (
      <p className="relative z-10 animate-pulse text-sm font-medium tracking-wide text-muted-foreground">
        {text}
      </p>
    )}
  </div>
);

export default LoadingPage;
