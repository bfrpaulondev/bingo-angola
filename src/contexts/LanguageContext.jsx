// src/contexts/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'pt');

  const toggleLang = () => setLang((p) => (p === 'pt' ? 'en' : 'pt'));

  useEffect(() => localStorage.setItem('lang', lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
