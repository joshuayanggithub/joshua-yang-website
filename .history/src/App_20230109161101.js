import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Setup from "./components/Setup";
import Projects from "./components/Projects";
import About from './components/About';

function App() {
  return (
    <>
      <NavBar />
      <Home />
      <Projects />
      <About></About>
      <Setup />
      <Contacts />
    </>
  );
}

export default App;
