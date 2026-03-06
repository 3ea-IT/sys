import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem('appLanguage') || 'en';
  });

  const languages = {
    en: { name: 'English', flag: '🇺🇸', code: 'en' },
    es: { name: 'Español', flag: '🇪🇸', code: 'es' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    it: { name: 'Italiano', flag: '🇮🇹', code: 'it' },
    pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
    ru: { name: 'Русский', flag: '🇷🇺', code: 'ru' },
    ja: { name: '日本語', flag: '🇯🇵', code: 'ja' },
    zh: { name: '中文', flag: '🇨🇳', code: 'zh-CN' },
    ko: { name: '한국어', flag: '🇰🇷', code: 'ko' },
    ar: { name: 'العربية', flag: '🇸🇦', code: 'ar' },
    hi: { name: 'हिन्दी', flag: '🇮🇳', code: 'hi' },
  };

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    
    // Set data attribute on html element for language
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-language', language);
      document.documentElement.lang = languages[language]?.code || 'en';
    }
  }, [language, languages]);

  const changeLanguage = (newLanguage) => {
    if (newLanguage === language) return;
    
    localStorage.setItem('appLanguage', newLanguage);
    
    // Use Google Translate's cookie-based approach
    if (typeof window !== 'undefined') {
      // Set Google Translate cookie
      const expires = new Date();
      expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      document.cookie = `googtrans=/en/${languages[newLanguage]?.code || newLanguage};path=/;expires=${expires.toUTCString()}`;
      
      // Also try to use the combo box if available
      const combobox = document.querySelector('.goog-te-combo');
      if (combobox) {
        combobox.value = languages[newLanguage]?.code || newLanguage;
        combobox.dispatchEvent(new Event('change'));
      }
      
      // Force page reload with cache bust to ensure Google Translate processes everything
      const url = new URL(window.location);
      url.searchParams.set('_t', Date.now()); // Cache bust parameter
      window.location.href = url.toString();
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

const DEFAULT_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', code: 'en' },
  es: { name: 'Español', flag: '🇪🇸', code: 'es' },
  fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
  de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
  it: { name: 'Italiano', flag: '🇮🇹', code: 'it' },
  pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
  ru: { name: 'Русский', flag: '🇷🇺', code: 'ru' },
  ja: { name: '日本語', flag: '🇯🇵', code: 'ja' },
  zh: { name: '中文', flag: '🇨🇳', code: 'zh-CN' },
  ko: { name: '한국어', flag: '🇰🇷', code: 'ko' },
  ar: { name: 'العربية', flag: '🇸🇦', code: 'ar' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', code: 'hi' },
};

const DEFAULT_VALUE = {
  language: 'en',
  changeLanguage: () => console.warn('useLanguage hook must be used within LanguageProvider'),
  languages: DEFAULT_LANGUAGES,
};

export function useLanguage() {
  try {
    const context = useContext(LanguageContext);
    if (context === null || context === undefined) {
      console.warn('useLanguage hook used outside LanguageProvider, using default values');
      return DEFAULT_VALUE;
    }
    return context;
  } catch (error) {
    console.warn('Error in useLanguage hook:', error);
    return DEFAULT_VALUE;
  }
}
