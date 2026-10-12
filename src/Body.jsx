import { useState } from "react";
import w3CsharpCert from "./assets/cert-w3-csharp.jpg";
import w3JavaCert from "./assets/cert-w3-java.jpg";
import googleAiCert from "./assets/cert-google-ai.jpg";
import googleAppBuildingCert from "./assets/cert-google-app-building.jpg";

const languages = [
  "React",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "JavaScript",
  "Python",
  "SQL",
  "C#",
];

// Hovering an item shows one of its `previews`, picked by where the mouse is:
// first on the left side, last on the right
const certifications = [
  {
    title: "W3Schools C# and Java certification",
    previews: [w3CsharpCert, w3JavaCert],
  },
  {
    title: "Google AI Professional Certificate",
    previews: [googleAiCert, googleAppBuildingCert],
  },
];

const Body = () => {
  return (
    <ul className="skills">
      <li className="blob">
        <h2>Frontend Developer</h2>
        <p>
          I code from scratch, but I produce fast, building the website's bare
          structure then polishing and deploying with Claude.
        </p>
        <p className="languages">Languages I use</p>
        <ul className="chips">
          {languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </li>

      <li className="blob blob--alt">
        <h2>Certifications</h2>
        <ul className="certs">
          {certifications.map((cert) => (
            <Certification key={cert.title} {...cert} />
          ))}
        </ul>
      </li>
    </ul>
  );
};

const Certification = ({ title, previews }) => {
  const [shown, setShown] = useState(0);

  // Splits the item into equal strips across its width, one per preview
  const pickPreview = (event) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const strip = Math.floor(
      ((event.clientX - left) / width) * previews.length,
    );
    setShown(Math.min(Math.max(strip, 0), previews.length - 1));
  };

  return (
    <li onMouseEnter={pickPreview} onMouseMove={pickPreview}>
      {title}
      <span className="cert-previews" aria-hidden="true">
        {previews.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={i === shown ? "is-shown" : undefined}
            style={{
              "--side": previews.length > 1 ? i / (previews.length - 1) : 0,
            }}
          />
        ))}
      </span>
    </li>
  );
};

export default Body;
