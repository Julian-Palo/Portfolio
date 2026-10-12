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
      <main>
        <Figure />
        <Body />
      </main>
      <Footer />
    </div>
  );
}

export default App;
