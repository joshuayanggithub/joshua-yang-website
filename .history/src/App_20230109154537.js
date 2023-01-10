import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Setup from "./components/Setup";
import Projects from "./components/Projects";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <Home />
      <Projects />
      <Setup />
      <Contacts />
    </>
  );
}

export default App;
