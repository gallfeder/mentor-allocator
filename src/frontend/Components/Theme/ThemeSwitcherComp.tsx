import {useTheme} from "../../Contexts/Theme/ThemeHooks";
import "./ThemeSwitcher.css";

const ThemeSwitcherComp = () => {

    const { theme, toggleTheme } = useTheme();

    function onClicked() {
        toggleTheme();
    }

    const lightModeSwitcherIcon = "/src/frontend/public/lightmode-switcher.svg"
    const darkModeSwitcherIcon = "/src/frontend/public/darkmode-switcher.svg"

    return (
        <img className="theme-switcher" height="40px" src={theme === "light" ? lightModeSwitcherIcon : darkModeSwitcherIcon}
             alt={theme === "light" ? "light mode" : "dark mode"} onClick={onClicked}/>
    )

}

export default ThemeSwitcherComp;