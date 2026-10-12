import Header from "./Header";
import Body from "./Body";
import Figure from "./Figure";
import Footer from "./Footer";
import Contact from "./Contact";

/* TODO:

Favicon: public/favicon.svg is still Vite's purple lightning bolt. 
Replace it with something of your own, like an initial or a crop of your drawing.

Link previews: add og:title, og:description and og:image tags to index.html. 
LinkedIn and Discord use them to show a title and picture when you share the link. Right now a shared link shows up bare.

Hover only works with a mouse. On phones nobody sees the project previews or certificate images. 
That's fine since the text still makes sense, but don't put anything important only in an image.

Pick a host and set Vite's base path to match.
Vercel or Netlify: connect the GitHub repo and it works with no config. This is the easiest option.

*/

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
