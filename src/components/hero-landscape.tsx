"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { Button } from "@/components/ui/button";
import { mountDither } from "@/lib/hero-dither";

const photo = "/images/citesky.jpg";

export function HeroLandscape() {
  preload(photo, { as: "image" });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof mountDither>>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(motion.matches);
    syncPreference();
    motion.addEventListener("change", syncPreference);
    renderer.current = mountDither(canvas, photo, () => setReady(true), motion);

    return () => {
      motion.removeEventListener("change", syncPreference);
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  function toggleAnimation() {
    const nextPaused = !paused;
    renderer.current?.setPaused(nextPaused);
    setPaused(nextPaused);
  }

  return (
    <>
      <div className="hero-landscape" data-ready={ready} aria-hidden="true">
        <div className="hero-landscape-scene">
          <canvas ref={canvasRef} className="hero-landscape-canvas" />
        </div>
      </div>
      {ready && !reducedMotion && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hero-motion-control"
          onClick={toggleAnimation}
          aria-label={paused ? "Lanjutkan animasi latar" : "Jeda animasi latar"}
          title={paused ? "Lanjutkan animasi latar" : "Jeda animasi latar"}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </Button>
      )}
    </>
  );
}
