// Each project sits in one of the boxes drawn along the ribbon (see .slot-* in index.css)
const projects = [
  {
    title: "Paragonal",
    blurb: "Agentically built 3D platformer",
    href: "https://gamejolt.com/games/Paragonal/1101374",
    source: "Game Jolt",
    slot: "slot-2",
  },
  {
    title: "React API App",
    href: "https://github.com/Julian-Palo/React-JSON-Manipulation",
    source: "GitHub",
    slot: "slot-3",
  },
  {
    title: "First React Project",
    href: "https://github.com/Julian-Palo/First-React-Project",
    source: "GitHub",
    slot: "slot-4",
  },
  {
    title: "C# Currency Converter",
    href: null, // TODO: push to GitHub and add the link
    source: "Coming soon",
    slot: "slot-5",
  },
];

const Figure = () => {
  return (
    <section className="hero" aria-label="Introduction and projects">
      <svg
        className="ribbon"
        viewBox="0 0 1412 760"
        preserveAspectRatio="xMinYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ribbon-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb21a" />
            <stop offset="60%" stopColor="#ffa500" />
            <stop offset="100%" stopColor="#ff7a00" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ribbon-fill)"
          d="M367 67 C300 67 230 110 195 160 C160 210 158 270 158 330
             C158 420 190 520 222 580 C270 650 360 700 510 712
             C600 712 680 690 760 670 L1040 597 C1160 565 1290 535 1412 575
             L1412 465 C1330 410 1240 405 1160 430 L800 515
             C680 545 520 560 490 505 C465 445 470 395 500 345
             C530 300 552 250 552 210 C545 150 500 115 455 93
             C425 75 395 67 367 67 Z"
        />
      </svg>

      <ul className="projects">
        {projects.map((project, i) => (
          <li
            key={project.title}
            className={`slot ${project.slot}`}
            style={{ "--i": i + 1 }}
          >
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
