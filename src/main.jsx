import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';

import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/portofolio">
        <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <ThemeSwitcher />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
