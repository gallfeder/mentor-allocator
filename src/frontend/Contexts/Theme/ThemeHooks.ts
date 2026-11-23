import {useContext} from "react";
import {ThemeContext, ThemeContextType} from "./ThemeContext";

export function useTheme() {
    return useContext<ThemeContextType>(ThemeContext);
}