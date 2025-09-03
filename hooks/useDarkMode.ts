
import { useState, useEffect } from 'react';

export const useDarkMode = (): [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const storedPreference = window.localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      return JSON.parse(storedPreference);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
        window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
        console.error("Could not save dark mode preference to localStorage", error);
    }
  }, [isDarkMode]);

  return [isDarkMode, toggleDarkMode];
};
