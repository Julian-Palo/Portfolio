import React from "react";

const Header = () => {
  const textWithNewLines = "Julian Palomino\n-\nFront End Developer";
  return (
    <header>
      <h1 className="name">Julian Palomino</h1>
      <p className="hyphen"> - </p>
      <h3 className="jobfield">
        Junior Developer —— open to roles and paid internships
      </h3>
    </header>
  );
};

export default Header;
