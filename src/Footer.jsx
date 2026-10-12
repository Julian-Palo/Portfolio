const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/julian-palomino-ab4097260/",
  },
  { label: "GitHub", href: "https://github.com/Julian-Palo?tab=repositories" },
  { label: "Email", href: "mailto:julian.l.palomino@gmail.com" },
];

const Footer = () => {
  return (
    <footer id="contact">
      <p className="footer-lead">Let's build something.</p>
      <ul className="footer-links">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              {...(href.startsWith("http") && {
                target: "_blank",
                rel: "noreferrer",
              })}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
