"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLocale = "es" | "en";
export type AppTheme = "light" | "dark";

type AppPreferencesContextValue = {
  locale: AppLocale;
  theme: AppTheme;
  setLocale: (locale: AppLocale) => void;
  setTheme: (theme: AppTheme) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

const LOCALE_KEY = "amada-locale";
const THEME_KEY = "amada-theme";

function isLocale(value: string | null): value is AppLocale {
  return value === "es" || value === "en";
}

function isTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark";
}

function applyLocale(locale: AppLocale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("es");
  const [theme, setThemeState] = useState<AppTheme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLocale = window.localStorage.getItem(LOCALE_KEY);
    const savedTheme = window.localStorage.getItem(THEME_KEY);

    const initialLocale = isLocale(savedLocale) ? savedLocale : "es";
    const initialTheme = isTheme(savedTheme) ? savedTheme : "light";

    setLocaleState(initialLocale);
    setThemeState(initialTheme);
    applyLocale(initialLocale);
    applyTheme(initialTheme);
  }, []);

  const setLocale = (nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_KEY, nextLocale);
    }
    applyLocale(nextLocale);
  };

  const setTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    }
    applyTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      locale,
      theme,
      setLocale,
      setTheme,
    }),
    [locale, theme]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }
  return context;
}

