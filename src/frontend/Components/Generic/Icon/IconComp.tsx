import "./Icon.css"

interface Props {
    icon: "drop-item"
    size: "small" | "medium" | "large"
}

const IconComp = (props: Props) => {

    function toIconSource(): string {
        if (props.icon === "drop-item") return "/src/frontend/public/place_item_icon.svg";
        return "";
    }

    return (
        <img className={`icon ${props.size}`} src={toIconSource()} alt={props.icon}></img>
    )

}

export default IconComp