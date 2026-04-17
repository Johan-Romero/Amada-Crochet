"use client";

import { useEffect } from "react";

type Point = { x: number; y: number; line?: boolean };

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function rectFor(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    bottom: r.bottom + window.scrollY,
    left: r.left,
    right: r.right,
    width: r.width,
    height: r.height,
    centerX: r.left + r.width / 2,
    centerY: r.top + window.scrollY + r.height / 2,
  };
}

function clampX(x: number, width: number, inset = 32) {
  return clamp(x, inset, Math.max(inset, width - inset));
}

function pathFromPoints(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    if (p1.line || p2.line) {
      d += ` L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      continue;
    }

    const tension = 0.22;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function buildWaypoints() {
  const sphere = rectFor("yarn-sphere");
  const intro = rectFor("intro");
  const categories = rectFor("categories");
  const promo = rectFor("promo");
  const editorial = rectFor("editorial");
  const custom = rectFor("custom-order");
  const cta = rectFor("cta-button");
  const storyPhoto = rectFor("mother-photo");
  const threadOrigin = rectFor("thread-origin");
  if (!sphere || !intro || !cta) return [];

  const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const startX = threadOrigin?.centerX ?? sphere.centerX;
  const startY = threadOrigin?.centerY ?? sphere.centerY;
  const mobile = window.innerWidth <= 767;
  const categoryBlock = categories ?? intro;
  const promoBlock = promo ?? categoryBlock;
  const editorialBlock = editorial ?? promoBlock;
  const customBlock = custom ?? editorialBlock;

  if (mobile) {
    const leftLane = clampX(width * 0.29, width, 18);
    const centerLane = clampX(width * 0.5, width, 18);
    const rightLane = clampX(width * 0.71, width, 18);
    const heroExitY = intro.top - Math.min(104, window.innerHeight * 0.12);

    return [
      { x: startX, y: startY },
      { x: centerLane, y: heroExitY },
      { x: rightLane, y: intro.top + intro.height * 0.18 },
      { x: centerLane, y: intro.centerY + intro.height * 0.12 },
      { x: leftLane, y: intro.bottom - intro.height * 0.12 },
      { x: centerLane, y: intro.bottom + intro.height * 0.12 },
      { x: rightLane, y: categoryBlock.centerY },
      { x: centerLane, y: categoryBlock.bottom + categoryBlock.height * 0.12 },
      { x: leftLane, y: promoBlock.top + promoBlock.height * 0.26 },
      { x: rightLane, y: promoBlock.bottom - promoBlock.height * 0.1 },
      { x: leftLane, y: editorialBlock.centerY + editorialBlock.height * 0.08 },
      { x: centerLane, y: customBlock.top + customBlock.height * 0.2 },
      { x: leftLane, y: customBlock.bottom - customBlock.height * 0.12 },
      { x: centerLane, y: cta.top - cta.height * 0.98 },
      { x: cta.centerX, y: cta.centerY },
    ] satisfies Point[];
  }

  const leftLane = clampX(width * 0.31, width, 24);
  const leftOuter = storyPhoto ? clampX(storyPhoto.left + storyPhoto.width * 0.08, width, 24) : clampX(width * 0.2, width, 24);
  const centerLane = clampX(width * 0.5, width, 24);
  const rightLane = clampX(width * 0.67, width, 24);
  const topSweep = clampX((centerLane + rightLane) * 0.5, width, 24);
  const heroExitY = intro.top - Math.min(112, window.innerHeight * 0.12);
  const heroSoftY = heroExitY + Math.min(36, window.innerHeight * 0.04);
  const startBendX = startX + (centerLane - startX) * 0.35;

  return [
    { x: startX, y: startY },
    { x: startBendX, y: startY + 34 },
    { x: centerLane, y: heroSoftY },
    { x: clampX((centerLane + topSweep) * 0.5, width, 24), y: heroExitY },
    { x: topSweep, y: intro.top + intro.height * 0.06 },
    { x: rightLane, y: intro.top + intro.height * 0.14 },
    { x: rightLane, y: intro.top + intro.height * 0.28 },
    { x: rightLane, y: intro.top + intro.height * 0.52 },
    { x: centerLane, y: intro.centerY + intro.height * 0.16 },
    { x: leftLane, y: intro.top + intro.height * 0.72 },
    { x: leftOuter, y: intro.bottom - intro.height * 0.05 },
    { x: leftLane, y: intro.bottom + intro.height * 0.08 },
    { x: centerLane, y: intro.bottom + intro.height * 0.14 },
    { x: centerLane, y: categoryBlock.top + categoryBlock.height * 0.14 },
    { x: rightLane, y: categoryBlock.centerY - categoryBlock.height * 0.08 },
    { x: centerLane, y: categoryBlock.bottom + categoryBlock.height * 0.1 },
    { x: leftLane, y: promoBlock.top + promoBlock.height * 0.2 },
    { x: rightLane, y: promoBlock.bottom - promoBlock.height * 0.12 },
    { x: leftLane, y: editorialBlock.top + editorialBlock.height * 0.2 },
    { x: rightLane, y: editorialBlock.centerY + editorialBlock.height * 0.12 },
    { x: centerLane, y: customBlock.top + customBlock.height * 0.24 },
    { x: leftLane, y: customBlock.bottom - customBlock.height * 0.1 },
    { x: cta.centerX, y: cta.top - cta.height * 1.06 },
    { x: cta.centerX, y: cta.top - cta.height * 0.02 },
    { x: cta.centerX, y: cta.centerY },
  ] satisfies Point[];
}

export default function ThreadScene() {
  useEffect(() => {
    const svg = document.getElementById("golden-thread") as SVGSVGElement | null;
    if (!svg) return;
    let enabled = window.innerWidth >= 768;
    if (!enabled) {
      svg.style.display = "none";
      return;
    }
    svg.style.display = "block";
    const path = document.getElementById("thread-path") as SVGPathElement | null;
    const highlight = document.getElementById("thread-highlight") as SVGPathElement | null;
    const ctaButton = document.getElementById("cta-button");
    const yarnOverlay = document.getElementById("yarn-overlay-img");
    const footer = document.querySelector("footer");
    if (!path || !highlight || !ctaButton) return;

    let totalLength = 0;
    let running = true;
    let raf = 0;
    let smoothedProgress = 0;
    let targetProgress = 0;
    let mobile = window.innerWidth <= 767;
    let endLine = 1;
    let syncTimer = 0;
    let scrollRaf = 0;

    const resetThread = () => {
      smoothedProgress = 0;
      targetProgress = 0;
      path.style.strokeDashoffset = String(totalLength || 0);
      highlight.style.strokeDashoffset = String(totalLength || 0);
      path.style.opacity = "0";
      highlight.style.opacity = "0";
      ctaButton.style.setProperty("--thread-glow", "0");
      ctaButton.classList.remove("thread-activated");
    };

    const paintThread = (progress: number) => {
      if (!totalLength || progress <= 0.0005) {
        resetThread();
        return;
      }

      const easedProgress = 1 - Math.pow(1 - clamp(progress, 0, 1), 1.18);
      const visibleLength = clamp(totalLength * easedProgress, 0, totalLength);
      const offset = Math.max(0, totalLength - visibleLength);

      path.style.strokeDashoffset = String(offset);
      path.style.opacity = mobile ? "0.8" : "0.84";

      if (!mobile) {
        const tipLength = clamp(totalLength * 0.085, 72, 210);
        highlight.style.strokeDasharray = `${tipLength} ${totalLength}`;
        highlight.style.strokeDashoffset = String(offset);
        highlight.style.opacity = String(0.18 + 0.16 * easedProgress);

        const glowProgress = clamp((easedProgress - 0.84) / 0.16, 0, 1);
        ctaButton.style.setProperty("--thread-glow", glowProgress.toFixed(4));
        ctaButton.classList.toggle("thread-activated", glowProgress > 0.98);
        return;
      }

      ctaButton.style.setProperty("--thread-glow", "0");
      ctaButton.classList.remove("thread-activated");
    };

    const animateTowardsTarget = () => {
      if (!running) return;
      const smoothing = mobile ? 0.24 : 0.16;
      smoothedProgress += (targetProgress - smoothedProgress) * smoothing;
      const settleThreshold = mobile ? 0.0048 : 0.0012;
      if (Math.abs(targetProgress - smoothedProgress) < settleThreshold) {
        smoothedProgress = targetProgress;
      }

      const progressForPaint = mobile ? Math.round(smoothedProgress * 320) / 320 : smoothedProgress;
      paintThread(progressForPaint);

      if (Math.abs(targetProgress - smoothedProgress) >= settleThreshold) {
        raf = requestAnimationFrame(animateTowardsTarget);
        return;
      }
      raf = 0;
    };

    const ensureAnimation = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(animateTowardsTarget);
    };

    const updateTargetFromScroll = (immediate = false) => {
      const scrollY = window.scrollY;

      if (scrollY <= 1 || !totalLength) {
        targetProgress = 0;
        if (yarnOverlay) yarnOverlay.style.transform = "rotate(0deg)";
        if (immediate || mobile) {
          smoothedProgress = targetProgress;
          paintThread(smoothedProgress);
          return;
        }
        ensureAnimation();
        return;
      }

      targetProgress = clamp(scrollY / endLine, 0, 1);

      if (yarnOverlay && !mobile) {
        const speed = 0.85;
        const rotation = (scrollY * speed).toFixed(2);
        yarnOverlay.style.transform = `rotate(${rotation}deg)`;
      }

      if (immediate || mobile) {
        smoothedProgress = targetProgress;
        paintThread(smoothedProgress);
        return;
      }
      ensureAnimation();
    };

    const syncSizeAndPath = () => {
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
      const footerRect = footer?.getBoundingClientRect();
      const footerBottom = footerRect ? footerRect.bottom + window.scrollY : 0;
      const contentHeight = Math.max(
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        window.innerHeight
      );
      const height = Math.ceil(Math.max(contentHeight, footerBottom + 8));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      const d = pathFromPoints(buildWaypoints());
      path.setAttribute("d", d);
      highlight.setAttribute("d", d);

      if (!d) {
        totalLength = 0;
        resetThread();
        return;
      }

      totalLength = path.getTotalLength();
      mobile = window.innerWidth <= 767;
      path.setAttribute("stroke-width", mobile ? "3.4" : "5.2");
      highlight.setAttribute("stroke-width", mobile ? "1.7" : "2.2");
      highlight.style.display = mobile ? "none" : "block";
      path.style.strokeDasharray = `${totalLength} ${totalLength}`;
      highlight.style.strokeDasharray = `${totalLength} ${totalLength}`;

      const cta = rectFor("cta-button");
      endLine = cta ? Math.max(1, cta.top + cta.height * 0.32 - window.innerHeight * 0.66) : 1;

      resetThread();
      updateTargetFromScroll(true);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      syncSizeAndPath();
    };

    const scheduleSyncDebounced = () => {
      if (syncTimer) window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(
        () => {
          scheduleSync();
        },
        mobile ? 160 : 90
      );
    };

    const handleScroll = () => {
      if (!enabled) return;
      if (!mobile) {
        updateTargetFromScroll();
        return;
      }
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        updateTargetFromScroll(true);
      });
    };

    const handleResize = () => {
      const nextEnabled = window.innerWidth >= 768;
      if (!nextEnabled) {
        enabled = false;
        svg.style.display = "none";
        targetProgress = 0;
        smoothedProgress = 0;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }

      if (!enabled && nextEnabled) {
        enabled = true;
        svg.style.display = "block";
        scheduleSyncDebounced();
        return;
      }

      if (mobile) return;
      scheduleSyncDebounced();
    };

    scheduleSync();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const ro = mobile
      ? null
      : new ResizeObserver(() => {
          scheduleSyncDebounced();
        });
    ro?.observe(document.documentElement);
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", scheduleSyncDebounced, { passive: true });
    window.addEventListener("load", scheduleSyncDebounced, { passive: true });
    window.addEventListener("pageshow", scheduleSyncDebounced, { passive: true });
    const t1 = window.setTimeout(scheduleSyncDebounced, 120);
    const t2 = window.setTimeout(scheduleSyncDebounced, 420);

    return () => {
      running = false;
      clearTimeout(t1);
      clearTimeout(t2);
      if (syncTimer) window.clearTimeout(syncTimer);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      ro?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", scheduleSyncDebounced);
      window.removeEventListener("load", scheduleSyncDebounced);
      window.removeEventListener("pageshow", scheduleSyncDebounced);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg id="golden-thread" className="golden-thread" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e3bf48" />
          <stop offset="50%" stopColor="#cda632" />
          <stop offset="100%" stopColor="#aa7d1a" />
        </linearGradient>
      </defs>
      <path id="thread-path" fill="none" stroke="url(#thread-gradient)" strokeWidth="4.6" strokeLinecap="round" />
      <path
        id="thread-highlight"
        fill="none"
        stroke="rgba(255,255,255,0.34)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
