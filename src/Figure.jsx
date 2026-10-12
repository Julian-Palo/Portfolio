import { useEffect, useRef } from "react";
import paragonalPreview from "./assets/preview-paragonal.png";
import reactApiPreview from "./assets/preview-react-api.png";
import heroBase from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import currencyPreview from "./assets/preview-currency.png";

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
    title: "Paragonal",
    blurb:
      "An agentically built 3D platformer. Built with Google Gemini's Antigravity IDE to test skills acquired from the Google AI Professional Certification",
    href: "https://gamejolt.com/games/Paragonal/1101374",
    source: "Game Jolt",
    slot: "slot-2",
    preview: paragonalPreview,
    at: 0.9,
  },
  {
    title: "React API App",
    blurb:
      "Fetches JSON from an API and reshapes it with the Fetch API, useState, and useEffect.",
    href: "https://github.com/Julian-Palo/React-JSON-Manipulation",
    source: "GitHub",
    slot: "slot-3",
    preview: reactApiPreview,
    at: 0.5,
  },
  {
    title: "First React Project",
    blurb:
      "React fundamentals in one app: components, props, state, click events, lists, and controlled inputs.",
    href: "https://github.com/Julian-Palo/First-React-Project",
    source: "GitHub",
    slot: "slot-4",
    preview: <ViteReactStack />,
    at: 0.3,
  },
  {
    title: "C# Currency Converter",
    blurb:
      "Converts amounts between currencies in real time with C# and SQL, and saves your own custom currencies to a local database.",
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
  "C250 565 215 430 235 310 C255 190 340 120 430 130 C520 140 560 220 540 300";
// Extends the tail off to the right, so the ribbon still reaches the edge of wide screens
const LEAD_IN = "M3400 560 L2200 560 C1900 560 1710 540 1480 470";
const SAMPLES = 400;
const LEAD_IN_SAMPLES = 120;
const TIP_RADIUS = 65;

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
        left: `${(point.x - dy * scale).toFixed(1)} ${(point.y + dx * scale).toFixed(1)}`,
        right: `${(point.x + dy * scale).toFixed(1)} ${(point.y - dx * scale).toFixed(1)}`,
      };
    });
    const slots = hero.querySelectorAll(".slot");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      let raw;
      if (getComputedStyle(hero).position === "sticky") {
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
      const progress = reduceMotion.matches ? 1 : Math.min(Math.max(raw, 0), 1);

      // Growth starts where the ribbon crosses the right edge of the screen
      const screenRight = svg.getScreenCTM();
      const visibleRight =
        (window.innerWidth - screenRight.e) / screenRight.a + TIP_RADIUS;
      const entry = Math.max(
        points.findIndex((point) => point.x < visibleRight),
        0,
      );

      // Outline of the ribbon up to how far it has grown
      const count = entry + Math.round(progress * (last - entry));
      const shown = edges.slice(0, count + 1);
      const left = shown.map((edge) => edge.left);
      const right = shown.map((edge) => edge.right).reverse();
      body.setAttribute(
        "d",
        progress > 0 ? `M${left.join("L")}L${right.join("L")}Z` : "",
      );

      // Round cap on the growing end
      tip.setAttribute("cx", points[count].x);
      tip.setAttribute("cy", points[count].y);
      tip.setAttribute("r", progress > 0 ? widths[count] / 2 : 0);
      slots.forEach((slot) =>
        slot.classList.toggle("is-shown", progress >= Number(slot.dataset.at)),
      );
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
              <stop offset="0%" stopColor="#ffb21a" />
              <stop offset="55%" stopColor="#ffa500" />
              <stop offset="100%" stopColor="#ff7a00" />
            </linearGradient>
          </defs>
          <path ref={leadInRef} d={LEAD_IN} fill="none" />
          <path ref={centerlineRef} d={CENTERLINE} fill="none" />
          <path ref={bodyRef} fill="url(#ribbon-fill)" />
          <circle ref={tipRef} fill="url(#ribbon-fill)" r="0" />
        </svg>

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
