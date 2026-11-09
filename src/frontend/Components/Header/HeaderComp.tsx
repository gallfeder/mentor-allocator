import "./Header.css"
import {useNavigate} from "react-router-dom";

const HeaderComp = () => {

    const navigate = useNavigate();

    function backToHomepage() {
        navigate("/");
    }

    return (
        <nav className="header panel">
            <h2 onClick={backToHomepage}>Mentor Allocator</h2>
        </nav>
    )

}

export default HeaderComp;