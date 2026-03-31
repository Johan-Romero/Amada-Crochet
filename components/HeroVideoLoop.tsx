"use client";

import { useEffect, useRef } from "react";

const HERO_VIDEO_SRC = "/video/5742268-uhd_2560_1080_30fps.mp4";
const CROSSFADE_MS = 220;
const LEAD_TIME = 0.28;

function primeVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "auto";
}

export default function HeroVideoLoop() {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<number>(0);
  const activeIndexRef = useRef(0);
  const swappingRef = useRef(false);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;

    const videos = [first, second];
    videos.forEach(primeVideo);

    const syncActiveLayer = (activeIndex: number) => {
      videos.forEach((video, index) => {
        video.dataset.active = index === activeIndex ? "true" : "false";
      });
    };

    const swapTo = async (nextIndex: number) => {
      if (swappingRef.current || nextIndex === activeIndexRef.current) return;
      swappingRef.current = true;

      const current = videos[activeIndexRef.current];
      const next = videos[nextIndex];

      try {
        next.currentTime = 0;
      } catch {
        next.load();
      }

      try {
        await next.play();
      } catch {
        swappingRef.current = false;
        return;
      }

      syncActiveLayer(nextIndex);
      activeIndexRef.current = nextIndex;

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        current.pause();
        try {
          current.currentTime = 0;
        } catch {
          current.load();
        }
        swappingRef.current = false;
      }, CROSSFADE_MS + 80);
    };

    const tick = () => {
      const active = videos[activeIndexRef.current];
      const standbyIndex = activeIndexRef.current === 0 ? 1 : 0;

      if (!swappingRef.current && active.readyState >= 2 && active.duration) {
        const remaining = active.duration - active.currentTime;
        if (remaining <= LEAD_TIME) {
          void swapTo(standbyIndex);
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const resume = async () => {
      syncActiveLayer(activeIndexRef.current);
      try {
        await videos[activeIndexRef.current].play();
      } catch {
        return;
      }
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafRef.current);
        videos.forEach((video) => video.pause());
        return;
      }
      void resume();
    };

    syncActiveLayer(0);
    void resume();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <div className="hero-video-stack" aria-hidden>
      <video ref={firstRef} className="hero-video-layer" autoPlay muted loop={false} playsInline>
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <video ref={secondRef} className="hero-video-layer" muted loop={false} playsInline>
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
