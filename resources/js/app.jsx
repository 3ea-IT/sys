import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './Contexts/ThemeContext';
import { LanguageProvider } from './Contexts/LanguageContext';
import { LoaderProvider } from './Contexts/LoaderContext';

const appName = import.meta.env.VITE_APP_NAME || 'Secure My Seat';

// Setup Google Translate callback before loading script
window.googleTranslateElementInit = function() {
  console.log('Google Translate API loaded successfully');
  try {
    // Initialize will happen in LanguageContext
  } catch (error) {
    console.error('Error in googleTranslateElementInit:', error);
  }
};

// Load Google Translate API
const loadGoogleTranslate = () => {
  if (window.google && window.google.translate) {
    console.log('Google Translate already loaded');
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    console.log('Google Translate script loaded');
  };
  script.onerror = () => {
    console.error('Failed to load Google Translate script');
  };
  document.head.appendChild(script);
};

// Load Google Translate when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGoogleTranslate);
} else {
  loadGoogleTranslate();
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <LanguageProvider>
                    <LoaderProvider>
                        <App {...props} />
                    </LoaderProvider>
                </LanguageProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
