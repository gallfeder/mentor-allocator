import "./ThemeSwitcher.css";

const ThemeSwitcherComp = () => {

    function onClicked() {
        window.theme.toggleTheme().then();
    }

    const lightModeSwitcherIcon = "/src/frontend/public/lightmode-switcher.svg"

    return (
        <img className="theme-switcher" height="40px" src={lightModeSwitcherIcon} alt={"theme switcher"} onClick={onClicked}/>
    )

}

export default ThemeSwitcherComp;