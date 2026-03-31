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

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(
      1
    )}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function buildWaypoints() {
  const sphere = rectFor("yarn-sphere");
  const intro = rectFor("intro");
  const motherPhoto = rectFor("mother-photo");
  const motherCopy = rectFor("mother-copy");
  const storyProcess = rectFor("story-process");
  const categories = rectFor("categories");
  const collectionHeading = rectFor("collection-heading");
  const craftGrid = rectFor("craft-grid");
  const craftWoman = rectFor("craft-mujer");
  const craftGirl = rectFor("craft-nina");
  const craftBags = rectFor("craft-bolsos");
  const promo = rectFor("promo");
  const promoContent = rectFor("promo-content");
  const cta = rectFor("cta-button");
  const threadOrigin = rectFor("thread-origin");
  if (!sphere || !intro || !cta) return [];

  const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const startX = threadOrigin?.centerX ?? sphere.centerX;
  const startY = threadOrigin?.centerY ?? sphere.centerY;
  const mobile = window.innerWidth <= 767;
  const photoBlock = motherPhoto ?? intro;
  const copyBlock = motherCopy ?? intro;
  const processBlock = storyProcess ?? copyBlock;
  const headingBlock = collectionHeading ?? categories ?? intro;
  const gridBlock = craftGrid ?? categories ?? headingBlock;
  const leftCraft = craftWoman ?? gridBlock;
  const centerCraft = craftGirl ?? gridBlock;
  const rightCraft = craftBags ?? gridBlock;
  const promoBlock = promo ?? gridBlock;
  const promoInfo = promoContent ?? promoBlock;

  if (mobile) {
    const laneX = clampX(width * 0.56, width, 24);
    const leftSweepX = clampX(photoBlock.left - 26, width, 20);
    const centerSweepX = clampX(width * 0.52, width, 20);
    const lowerCenterX = clampX(width * 0.5, width, 20);
    const rightSweepX = clampX(rightCraft.right - rightCraft.width * 0.22, width, 20);

    return [
      { x: startX, y: startY, line: true },
      { x: startX, y: startY + 30, line: true },
      { x: laneX, y: intro.top + intro.height * 0.1 },
      { x: leftSweepX, y: photoBlock.top + photoBlock.height * 0.16 },
      { x: leftSweepX, y: photoBlock.centerY + photoBlock.height * 0.12 },
      { x: centerSweepX, y: processBlock.top + processBlock.height * 0.52 },
      { x: lowerCenterX, y: processBlock.bottom + 18 },
      { x: clampX(leftCraft.left + leftCraft.width * 0.18, width, 20), y: gridBlock.top + gridBlock.height * 0.2 },
      { x: clampX(leftCraft.left + leftCraft.width * 0.2, width, 20), y: gridBlock.bottom - gridBlock.height * 0.14 },
      { x: lowerCenterX, y: gridBlock.bottom - gridBlock.height * 0.08 },
      { x: rightSweepX, y: gridBlock.bottom - gridBlock.height * 0.12 },
      { x: rightSweepX, y: promoBlock.top + promoBlock.height * 0.22 },
      { x: laneX, y: promoInfo.top + promoInfo.height * 0.56 },
      { x: lowerCenterX, y: cta.top - cta.height * 1.12 },
      { x: cta.centerX, y: cta.top - cta.height * 0.4 },
      { x: cta.centerX, y: cta.centerY },
    ] satisfies Point[];
  }

  const introEntryX = clampX(copyBlock.left + copyBlock.width * 0.2, width);
  const photoOuterX = clampX(photoBlock.left - photoBlock.width * 0.38, width);
  const photoMidX = clampX(photoBlock.left - photoBlock.width * 0.22, width);
  const photoBottomX = clampX(photoBlock.left + photoBlock.width * 0.12, width);
  const processLeftX = clampX(processBlock.left + processBlock.width * 0.12, width);
  const processMidX = clampX(processBlock.left + processBlock.width * 0.52, width);
  const processRightX = clampX(processBlock.right - processBlock.width * 0.14, width);
  const collectionsEntryX = clampX(centerCraft.centerX + centerCraft.width * 0.08, width);
  const collectionsLeftX = clampX(leftCraft.left + leftCraft.width * 0.16, width);
  const collectionsMidX = clampX(centerCraft.centerX, width);
  const collectionsRightX = clampX(rightCraft.right - rightCraft.width * 0.14, width);
  const promoRightX = clampX(promoBlock.left + promoBlock.width * 0.64, width);
  const promoCenterX = clampX(promoInfo.left + promoInfo.width * 0.56, width);
  const ctaApproachX = clampX(width * 0.5, width);

  return [
    { x: startX, y: startY, line: true },
    { x: startX, y: startY + 42, line: true },
    { x: clampX(startX - width * 0.03, width), y: startY + 78 },
    { x: introEntryX, y: intro.top + intro.height * 0.18 },
    { x: photoOuterX, y: photoBlock.top + photoBlock.height * 0.14 },
    { x: photoMidX, y: photoBlock.centerY + photoBlock.height * 0.08 },
    { x: photoBottomX, y: photoBlock.bottom + photoBlock.height * 0.14 },
    { x: processLeftX, y: processBlock.top + processBlock.height * 0.56 },
    { x: processMidX, y: processBlock.top + processBlock.height * 0.62 },
    { x: processRightX, y: processBlock.top + processBlock.height * 0.44 },
    { x: collectionsEntryX, y: headingBlock.bottom + headingBlock.height * 0.56 },
    { x: collectionsLeftX, y: gridBlock.top + gridBlock.height * 0.18 },
    { x: collectionsLeftX, y: gridBlock.bottom - gridBlock.height * 0.12 },
    { x: collectionsMidX, y: gridBlock.bottom - gridBlock.height * 0.08 },
    { x: collectionsRightX, y: gridBlock.bottom - gridBlock.height * 0.12 },
    { x: promoRightX, y: promoBlock.top + promoBlock.height * 0.14 },
    { x: promoRightX, y: promoBlock.top + promoBlock.height * 0.72 },
    { x: promoCenterX, y: promoInfo.top + promoInfo.height * 0.44 },
    { x: ctaApproachX, y: cta.top - cta.height * 1.12 },
    { x: cta.centerX, y: cta.top - cta.height * 0.42 },
    { x: cta.centerX, y: cta.centerY },
  ] satisfies Point[];
}

export default function ThreadScene() {
  useEffect(() => {
    const svg = document.getElementById("golden-thread") as SVGSVGElement | null;
    const path = document.getElementById("thread-path") as SVGPathElement | null;
    const highlight = document.getElementById("thread-highlight") as SVGPathElement | null;
    const ctaButton = document.getElementById("cta-button");
    const yarnOverlay = document.getElementById("yarn-overlay-img");
    const footer = document.querySelector("footer");
    if (!svg || !path || !highlight || !ctaButton) return;

    let totalLength = 0;
    let running = true;
    let raf = 0;

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
        return;
      }
      totalLength = path.getTotalLength();
      const mobile = window.innerWidth <= 767;
      path.setAttribute("stroke-width", mobile ? "4.2" : "5.2");
      highlight.setAttribute("stroke-width", mobile ? "1.7" : "2.2");
      const dash = `${totalLength} ${totalLength}`;
      path.style.strokeDasharray = dash;
      highlight.style.strokeDasharray = dash;
    };

    const tick = () => {
      if (!running) return;
      const cta = rectFor("cta-button");
      const scrollY = window.scrollY;

      if (scrollY <= 1 || !totalLength || !cta) {
        path.style.strokeDashoffset = String(totalLength || 0);
        highlight.style.strokeDashoffset = String(totalLength || 0);
        path.style.opacity = "0";
        highlight.style.opacity = "0";
        ctaButton.style.setProperty("--thread-glow", "0");
        ctaButton.classList.remove("thread-activated");

        if (yarnOverlay) {
          yarnOverlay.style.transform = "rotate(0deg)";
        }

        raf = requestAnimationFrame(tick);
        return;
      }

      if (totalLength && cta) {
        const endLine = Math.max(1, cta.top + cta.height * 0.5 - window.innerHeight * 0.46);
        const progress = clamp(scrollY / endLine, 0, 1);
        const baseVisible = window.innerWidth <= 767 ? 12 : 20;
        const visibleLength = clamp(baseVisible + (totalLength - baseVisible) * progress, 0, totalLength);
        const offset = Math.max(0, totalLength - visibleLength);

        path.style.strokeDashoffset = String(offset);
        highlight.style.strokeDashoffset = String(offset);
        path.style.opacity = "1";
        highlight.style.opacity = "0.34";

        const glowProgress = clamp((progress - 0.985) / 0.015, 0, 1);
        ctaButton.style.setProperty("--thread-glow", glowProgress.toFixed(4));
        ctaButton.classList.toggle("thread-activated", glowProgress > 0.98);
      }

      if (yarnOverlay) {
        const rotation = (scrollY * 0.85).toFixed(2);
        yarnOverlay.style.transform = `rotate(${rotation}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      syncSizeAndPath();
      raf = requestAnimationFrame(tick);
    };

    scheduleSync();
    const ro = new ResizeObserver(() => scheduleSync());
    ro.observe(document.documentElement);
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("orientationchange", scheduleSync, { passive: true });
    window.addEventListener("load", scheduleSync, { passive: true });
    window.addEventListener("pageshow", scheduleSync, { passive: true });
    const t1 = window.setTimeout(scheduleSync, 120);
    const t2 = window.setTimeout(scheduleSync, 420);

    return () => {
      running = false;
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
      window.removeEventListener("load", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
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
