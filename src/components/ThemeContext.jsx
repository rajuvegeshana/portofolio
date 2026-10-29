import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const themes = new Set(['editorial', 'swiss', 'creative']);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('theme');
    const selected = q || localStorage.getItem('portfolio_theme');
    return themes.has(selected) ? selected : 'editorial';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
