import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Setup from "./components/Setup";
import About from './components/About';
import Goals from "./components/Goals";

function App() {
  return (
    <>
      <NavBar />
      <Home />
      <About />
      <Goals />
      <Setup />
      <Contacts />
    </>
  );
}

export default App;
