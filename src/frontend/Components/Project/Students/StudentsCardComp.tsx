import {Student} from "../../../../shared/types";

interface Props {
    student: Student;
}

const StudentsCardComp = (props: Props) => {

    return (
        <div className="user-card">
            <p>{props.student.surname}, {props.student.name}</p>
        </div>
    )

}

export default StudentsCardComp;