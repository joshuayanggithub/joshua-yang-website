import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


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


