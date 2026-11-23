import "./ThemeSwitcher.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import lightModeSwitcherIcon from "../../public/lightmode-switcher.svg";

const ThemeSwitcherComp = () => {

    function onClicked() {
        window.theme.toggleTheme().then();
    }


    return (
        <img className="theme-switcher" height="40px" src={lightModeSwitcherIcon} alt={"theme switcher"} onClick={onClicked}/>
    )

}

export default ThemeSwitcherComp;