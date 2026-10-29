import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';

import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Admin from './pages/Admin';

function PageMeta() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const page = pathname === '/' ? 'Work' : pathname === '/about' ? 'About & Experience' : pathname === '/admin' ? 'Admin' : pathname.startsWith('/project/') ? 'Case Study' : 'Page Not Found';
    document.title = `${page} | Harikrishna — Senior Product Designer`;
  }, [pathname]);
  return null;
}

function NotFound() {
  return <section className="max-w-4xl mx-auto px-6 py-24"><h1 className="text-4xl font-bold mb-4">Page not found</h1><p className="text-theme-muted mb-8">This page does not exist.</p><Link to="/" className="text-theme-accent underline">Return to work</Link></section>;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/portofolio">
        <PageMeta />
        <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ThemeSwitcher />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// GitHub Pages has no SPA fallback: it serves public/404.html for unknown paths.
// That page stores the requested path here and redirects to the app root, so the
// route has to be restored before BrowserRouter reads location.
const spaPath = sessionStorage.getItem('spa-path');
if (spaPath) {
  sessionStorage.removeItem('spa-path');
  history.replaceState(null, '', spaPath);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
