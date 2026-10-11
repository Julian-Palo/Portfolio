import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Figure from "./Figure";
import Footer from "./Footer";
import Contact from "./Contact";

function App() {
  return (
    <div className="App">
      <Contact />
      <Header />
      <Figure />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
