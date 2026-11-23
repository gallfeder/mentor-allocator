import {createContext} from "react";

export type Theme = undefined | "light" | "dark";

export type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}

const InitialThemeContextState: ThemeContextType = {
    theme: undefined as Theme,
    toggleTheme: () => {}
}

export const ThemeContext = createContext<ThemeContextType>(InitialThemeContextState);