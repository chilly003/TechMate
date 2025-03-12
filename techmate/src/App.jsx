import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-blue-600 p-4">
          <ul className="flex space-x-4 justify-center">
            <li>
              <Link to="/" className="text-white hover:text-gray-200">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-gray-200">About</Link>
            </li>
            <li>
              <Link to="/contact" className="text-white hover:text-gray-200">Contact</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
