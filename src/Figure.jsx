import { useEffect, useRef } from "react";
import paragonalPreview from "./assets/preview-paragonal.png";
import reactApiPreview from "./assets/preview-react-api.png";
import currencyPreview from "./assets/preview-currency.png";
import immpressionPreview from "./assets/immpression.png";
import Julian from "./Julian";

// Vite's starter-template art: the React and Vite logos laid onto the two tiles of hero.png
const ViteReactStack = () => (
  <div className="card-preview vite-stack">
    <img className="base" src={heroBase} alt="" />
    <img className="framework" src={reactLogo} alt="" />
    <img className="vite" src={viteLogo} alt="" />
  </div>
);

// Each project sits in one of the boxes drawn along the ribbon (see .slot-* in index.css).
// `at` is how far the ribbon has to grow (0 to 1) before the box appears.
// `preview` pops up above the box on hover: an image, or an element to show as-is.
const projects = [
  {
    title: "Immpression contributions",
    blurb:
      "I pitched users to upload their art to the app and website while building a virtual whiteboard that other users can scribble and interact artistically",
    href: "https://www.immpression.art/",
    source: "Immpression",
    slot: "slot-2",
    preview: immpressionPreview,
    at: 0.9,
  },
  {
    title: "React API App",
    blurb:
      "Fetches JSON from an API and reshapes it with the Fetch API, useState, and useEffect",
    href: "https://github.com/Julian-Palo/React-JSON-Manipulation",
    source: "GitHub",
    slot: "slot-3",
    preview: reactApiPreview,
    at: 0.5,
  },
  {
    title: "Paragonal",
    blurb:
      "An agentically built 3D platformer. Built with Google Gemini's Antigravity IDE to test skills acquired from the Google AI Professional Certification",
    href: "https://gamejolt.com/games/Paragonal/1101374",
    source: "Game Jolt",
    slot: "slot-4",
    preview: paragonalPreview,
    at: 0.3,
  },
  {
    title: "C# Currency Converter",
    blurb:
      "Converts amounts between currencies in real time with C# and SQL, and saves your own custom currencies to a local database",
    href: "https://github.com/Julian-Palo/CurrencyConverter_Static",
    source: "GitHub",
    slot: "slot-5",
    preview: currencyPreview,
    at: 0.15,
  },
];

// Centerline of the ribbon: enters from the right edge, dips, then curls up the left side
// and hooks over the top. The visible ribbon is an outline built around this line.
const CENTERLINE =
  "M1480 470 C1250 400 1100 520 900 570 C700 620 520 680 380 620 " +
  "C210 565 165 430 190 310 C215 190 320 120 430 130 C520 140 560 220 540 300";
// Extends the tail off to the right, so the ribbon still reaches the edge of wide screens
const LEAD_IN = "M3400 560 L2200 560 C1900 560 1710 540 1480 470";
const SAMPLES = 400;
const LEAD_IN_SAMPLES = 120;
const TIP_RADIUS = 65;
// How far inside the ribbon's edge Julian's fist sits, so it overlaps the ribbon
const GRIP_INSET = 26;
// How his fist squeezes the ribbon, in viewBox units: the edge is pressed in under the fist
// and pushed out a little on either side of it
const GRIP_SPREAD = 14; // how far along the edge the squeeze reaches
const GRIP_DEPTH = 8;
const GRIP_BULGE = 2.5;
const GRIP_TUG = 1.2; // how far the squeeze slides along the edge per degree he swings
const JULIAN_SHOWS_AT = 0.9;

// Ribbon thickness at a point along the centerline (0 = start, 1 = tip of the curl).
// Even along the tail, then swells smoothly through the curl.
const widthAt = (t) => {
  const swell = Math.min(Math.max((t - 0.5) / 0.4, 0), 1);
  return 130 + 100 * swell * swell * (3 - 2 * swell);
};

const Figure = () => {
  const trackRef = useRef(null);
  const heroRef = useRef(null);
  const centerlineRef = useRef(null);
  const leadInRef = useRef(null);
  const bodyRef = useRef(null);
  const tipRef = useRef(null);
  const julianRef = useRef(null);
  const gripRef = useRef(null);
  const poseGripRef = useRef(null);

  // Ties the ribbon's growth to scroll position: grows on the way down, shrinks on the way back up
  useEffect(() => {
    const track = trackRef.current;
    const hero = heroRef.current;
    const body = bodyRef.current;
    const tip = tipRef.current;
    const centerline = centerlineRef.current;
    const svg = centerline.ownerSVGElement;
    const sample = (path, count) => {
      const length = path.getTotalLength();
      return Array.from({ length: count + 1 }, (_, i) =>
        path.getPointAtLength((i / count) * length),
      );
    };

    // Sample the lead-in and centerline, then offset each point to both sides by half the width
    const points = [
      ...sample(leadInRef.current, LEAD_IN_SAMPLES).slice(0, -1),
      ...sample(centerline, SAMPLES),
    ];
    const last = points.length - 1;
    const widths = points.map((_, i) =>
      widthAt(Math.max(i - LEAD_IN_SAMPLES, 0) / SAMPLES),
    );
    const edges = points.map((point, i) => {
      const before = points[Math.max(i - 1, 0)];
      const after = points[Math.min(i + 1, last)];
      const dx = after.x - before.x;
      const dy = after.y - before.y;
      const scale = widths[i] / 2 / (Math.hypot(dx, dy) || 1);
      return {
        left: { x: point.x - dy * scale, y: point.y + dx * scale },
        right: { x: point.x + dy * scale, y: point.y - dx * scale },
      };
    });
    const toPath = ({ x, y }) => `${x.toFixed(1)} ${y.toFixed(1)}`;

    // Julian grips the ribbon's leftmost point (its outer edge, halfway down the curl), with his
    // fist a little inside the edge so it overlaps the ribbon. Placed in % of the viewBox.
    const leftmost = edges
      .flatMap((edge) => [edge.left, edge.right])
      .reduce((best, edge) => (edge.x < best.x ? edge : best));
    const view = svg.viewBox.baseVal;
    hero.style.setProperty(
      "--grip-x",
      `${((leftmost.x + GRIP_INSET - view.x) / view.width) * 100}%`,
    );
    hero.style.setProperty(
      "--grip-y",
      `${((leftmost.y - view.y) / view.height) * 100}%`,
    );
    const gripX = leftmost.x + GRIP_INSET;
    gripRef.current.setAttribute("opacity", 0);

    // The squeeze only moves the outer edge (the side his fist is on), toward the centerline
    const gripIndex = edges.findIndex(
      (edge) => edge.left === leftmost || edge.right === leftmost,
    );
    const gripSide = edges[gripIndex].left === leftmost ? "left" : "right";
    const along = [0];
    for (let i = 1; i <= last; i++) {
      along.push(
        along[i - 1] +
          Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y),
      );
    }
    const grip = { strength: 0, angle: 0 };
    const squeezed = (edge, i) => {
      const s = (along[i] - along[gripIndex] - grip.angle * GRIP_TUG) / GRIP_SPREAD;
      if (!grip.strength || Math.abs(s) > 4) return edge;
      const bell = (x) => Math.exp(-x * x);
      const depth =
        grip.strength *
        (GRIP_DEPTH * bell(s) - GRIP_BULGE * (bell(s - 2) + bell(s + 2)));
      const inward = depth / (widths[i] / 2);
      const side = edge[gripSide];
      return {
        ...edge,
        [gripSide]: {
          x: side.x + (points[i].x - side.x) * inward,
          y: side.y + (points[i].y - side.y) * inward,
        },
      };
    };

    const slots = hero.querySelectorAll(".slot");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let count = 0;
    let progress = 0;

    // Outline of the ribbon up to how far it has grown, pinched where Julian holds it
    const draw = () => {
      const shown = edges.slice(0, count + 1).map(squeezed);
      const left = shown.map((edge) => toPath(edge.left));
      const right = shown.map((edge) => toPath(edge.right)).reverse();
      body.setAttribute(
        "d",
        progress > 0 ? `M${left.join("L")}L${right.join("L")}Z` : "",
      );
      gripRef.current.setAttribute("opacity", grip.strength);
      gripRef.current.setAttribute(
        "transform",
        `translate(${gripX.toFixed(1)} ${leftmost.y.toFixed(1)}) rotate(${(grip.angle * 0.5).toFixed(2)})`,
      );
    };

    // Julian reports each pose: how far his body has swung, and how tightly he's holding on
    poseGripRef.current = (angle, strength) => {
      grip.angle = angle;
      grip.strength = strength;
      draw();
    };

    const update = () => {
      frame = 0;
      let raw;
      const pinned = getComputedStyle(hero).position === "sticky";
      if (pinned) {
        // The ribbon is pinned on screen while you scroll through the track:
        // 0 when it first pins, 1 when it's about to scroll away
        const pinnedAt = parseFloat(getComputedStyle(hero).top);
        const pinnedDistance = track.offsetHeight - hero.offsetHeight;
        raw = (pinnedAt - track.getBoundingClientRect().top) / pinnedDistance;
      } else {
        // Small screens don't pin: 0 when the ribbon peeks in, 1 once it's centered
        const { top, height } = hero.getBoundingClientRect();
        const screen = window.innerHeight;
        raw = (screen - top) / (screen / 2 + height / 2);
      }
      progress = reduceMotion.matches ? 1 : Math.min(Math.max(raw, 0), 1);

      // Growth starts where the ribbon crosses the right edge of the screen
      const screenRight = svg.getScreenCTM();
      const visibleRight =
        (window.innerWidth - screenRight.e) / screenRight.a + TIP_RADIUS;
      const entry = Math.max(
        points.findIndex((point) => point.x < visibleRight),
        0,
      );

      count = entry + Math.round(progress * (last - entry));
      if (progress < JULIAN_SHOWS_AT) grip.strength = 0;
      draw();

      // Round cap on the growing end
      tip.setAttribute("cx", points[count].x);
      tip.setAttribute("cy", points[count].y);
      tip.setAttribute("r", progress > 0 ? widths[count] / 2 : 0);
      // Small screens have no hover, so the box crossing the middle of the screen shows its preview
      const middle = window.innerHeight / 2;
      slots.forEach((slot) => {
        slot.classList.toggle("is-shown", progress >= Number(slot.dataset.at));
        const { top, bottom } = slot.getBoundingClientRect();
        slot.classList.toggle(
          "is-previewing",
          !pinned && top <= middle && bottom >= middle,
        );
      });
      julianRef.current.update(progress);
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div className="hero-track" ref={trackRef}>
      <section
        className="hero"
        ref={heroRef}
        aria-label="Introduction and projects"
      >
        <svg
          className="ribbon"
          viewBox="80 0 1332 715"
          preserveAspectRatio="xMinYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="ribbon-fill"
              gradientUnits="userSpaceOnUse"
              x1="200"
              y1="100"
              x2="1412"
              y2="700"
            >
              <stop offset="0%" stopColor="#ff7a00" />
              <stop offset="55%" stopColor="#ffa500" />
              <stop offset="100%" stopColor="#ffb21a" />
            </linearGradient>
            <radialGradient id="grip-shadow">
              <stop offset="0%" stopColor="#7a2e00" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7a2e00" stopOpacity="0" />
            </radialGradient>
            <clipPath id="ribbon-clip">
              <use href="#ribbon-body" />
            </clipPath>
          </defs>
          <path ref={leadInRef} d={LEAD_IN} fill="none" />
          <path ref={centerlineRef} d={CENTERLINE} fill="none" />
          <path ref={bodyRef} id="ribbon-body" fill="url(#ribbon-fill)" />
          <circle ref={tipRef} fill="url(#ribbon-fill)" r="0" />
          {/* Shadow and tension creases around Julian's fist (origin = the fist) */}
          <g clipPath="url(#ribbon-clip)">
            <g ref={gripRef} className="ribbon-grip" opacity="0">
              <ellipse cx="6" cy="4" rx="40" ry="30" fill="url(#grip-shadow)" />
              <path className="crease" d="M18 -8 C40 -22 62 -40 88 -58" />
              <path className="crease" d="M22 2 C46 -2 70 -8 98 -12" />
              <path className="crease" d="M18 12 C38 20 56 30 74 42" />
              <path className="crease-light" d="M20 -3 C42 -17 64 -35 90 -53" />
              <path className="crease-light" d="M22 7 C46 3 70 -3 96 -7" />
            </g>
          </g>
        </svg>

        <Julian
          ref={julianRef}
          showAt={JULIAN_SHOWS_AT}
          onPose={(angle, strength) => poseGripRef.current?.(angle, strength)}
        />

        <ul className="projects">
          {projects.map((project) => (
            <li
              key={project.title}
              className={`slot ${project.slot}`}
              data-at={project.at}
            >
              {typeof project.preview === "string" ? (
                <img className="card-preview" src={project.preview} alt="" />
              ) : (
                project.preview
              )}
              {project.href ? (
                <a
                  className="card"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ProjectContent {...project} />
                </a>
              ) : (
                <div className="card card--soon">
                  <ProjectContent {...project} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const ProjectContent = ({ title, blurb, href, source }) => (
  <>
    <span className="card-title">{title}</span>
    {blurb && <span className="card-blurb">{blurb}</span>}
    <span className="card-meta">
      {source}
      {href && " ↗"}
    </span>
  </>
);

export default Figure;
