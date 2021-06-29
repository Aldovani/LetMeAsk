import { useEffect } from "react";
import { useState } from "react";
import { createContext, ReactNode } from "react";



type DarkModeContextProviderProps = {
  children: ReactNode;
};
type ThemeContextType={
  theme: string;
  toggleTheme: () => void;
}
type Theme = 'light'|'dark'

export const ThemeModeContext = createContext({} as ThemeContextType );

export function ThemeModeProvider( props: DarkModeContextProviderProps) {
  

  const [theme, setTheme] = useState<Theme>(() => {
    let localStorageTheme = localStorage.getItem('theme')

    return (localStorageTheme ?? 'light') as Theme
  })

  useEffect(() => {
    localStorage.setItem('theme',theme)
  },[theme])

  function toggleTheme() {
    setTheme(theme==="light"?"dark":"light")
}
  return (
    <ThemeModeContext.Provider value={{theme,toggleTheme}}>
      {props.children}
    </ThemeModeContext.Provider>
  );
}


