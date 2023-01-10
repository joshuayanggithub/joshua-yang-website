import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Switch, Route,Routes} from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Setup from "./components/Setup";
import Projects from "./components/Projects";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
            <Route index element={<App/>} />
            <Route path="projects" element={<Projects />} />
            <Route path="setup" element={<Setup />} />
            <Route path="contact" element={<Contacts />} />
        </Routes>
    </Router>
  </React.StrictMode>
);


