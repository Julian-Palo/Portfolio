import React from "react";

const Header = () => {
  const textWithNewLines = "Julian Palomino\n-\nFront End Developer";
  return (
    <header>
      <h1 class="name">Julian Palomino</h1>
      <p class="hyphen"> - </p>
      <h3 class="jobfield">
        Junior Developer —— open to roles and paid internships
      </h3>
    </header>
  );
};

export default Header;
