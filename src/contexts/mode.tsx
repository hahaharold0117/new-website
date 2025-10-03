import { PropsWithChildren, createContext, useEffect, useState } from "react";

const defaultTheme = "light";

interface ThemeContext {
  mode: "dark" | "light";
  setMode: (mode: "dark" | "light") => void;
}

export const ThemeContext = createContext<ThemeContext>({
  mode: defaultTheme,
  setMode: () => {},
});

export function ThemeContextProvider(props: PropsWithChildren) {
  const [mode, setMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("theme");
      if (storedMode === "dark" || storedMode === "light") {
        return storedMode;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(mode === "light" ? "dark" : "light");
    root.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
