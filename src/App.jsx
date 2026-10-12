import Header from "./Header";
import Body from "./Body";
import Figure from "./Figure";
import Footer from "./Footer";
import Contact from "./Contact";

/* TODO:

Link previews: once the site is hosted, change og:image in index.html to the full address
(https://your-site.com/favicon.png). LinkedIn and Discord ignore relative image paths.

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
