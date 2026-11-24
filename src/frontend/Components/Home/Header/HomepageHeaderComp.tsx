import "../../Header/Header.css"
import {useNavigate} from "react-router-dom";
import ThemeSwitcherComp from "../../Theme/ThemeSwitcherComp";

const HomepageHeaderComp = () => {

    const navigate = useNavigate();

    function backToHomepage() {
        navigate("/");
    }

    return (
        <nav className="header panel">
            <h2 onClick={backToHomepage}>Mentor Allocator</h2>
            <ThemeSwitcherComp/>
        </nav>
    )

}

export default HomepageHeaderComp;