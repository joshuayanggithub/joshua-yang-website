import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Setup from "./components/Setup";
import Projects from "./components/Projects";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="setup" element={<Setup />} />
          <Route path="contact" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
