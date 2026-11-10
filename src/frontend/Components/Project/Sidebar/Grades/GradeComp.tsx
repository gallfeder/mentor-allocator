import {useNavigate, useParams} from "react-router-dom";

interface Props {
    grade: string
}

const GradeComp = (props: Props) => {

    const navigate = useNavigate();
    const { projectId, grade } = useParams();

    function onGradeClick() {
        navigate(`/projects/${projectId}/grade/${props.grade}`);
    }

    return (
        <div onClick={onGradeClick} className={`grade ${props.grade === grade ? "active" : ""} button`}>
            <h3>{props.grade}</h3>
        </div>
    )

}

export default GradeComp;