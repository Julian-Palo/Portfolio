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
          <li>W3Schools C# and Java certification</li>
          <li>Google AI Professional Certificate</li>
        </ul>
      </li>
    </ul>
  );
};

export default Body;
