// contexts/main-context.tsx
import { createContext, useContext } from "react";

const DEFAULT_MAIN = { restaurant: {}, menu: [] };

const MainContext = createContext(DEFAULT_MAIN);

export function useMain() {
  return useContext(MainContext); // no throw needed now
}

export function MainContextProvider({ value = DEFAULT_MAIN, children }: any) {
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}
