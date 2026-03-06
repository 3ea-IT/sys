import React, { createContext, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

export const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Hook into Inertia's visit to show loader
  React.useEffect(() => {
    const originalVisit = router.visit;
    
    router.visit = function(url, options = {}) {
      showLoader();
      
      const originalOnFinish = options.onFinish;
      options.onFinish = () => {
        setTimeout(() => {
          hideLoader();
        }, 2000);
        if (typeof originalOnFinish === 'function') {
          originalOnFinish();
        }
      };

      const originalOnError = options.onError;
      options.onError = (errors) => {
        hideLoader();
        if (typeof originalOnError === 'function') {
          originalOnError(errors);
        }
      };

      return originalVisit.call(router, url, options);
    };

    return () => {
      router.visit = originalVisit;
    };
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = React.useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
}
