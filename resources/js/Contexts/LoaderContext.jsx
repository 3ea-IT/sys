import React, { createContext, useState, useCallback } from 'react';

export const LoaderContext = createContext();

// NOTE: This loader is shown ONLY when a page explicitly calls showLoader()
// (currently: the Login page, while the login request is in flight).
// It is intentionally NOT hooked into every Inertia navigation anymore —
// that used to make it pop up on every single page change across the app.
export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

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