import {Student} from "../../../../shared/types";
import {useDraggable} from "@dnd-kit/react";

interface Props {
    student: Student;
}

const StudentsCardComp = (props: Props) => {

    const { ref: draggableRef } = useDraggable({
        id: props.student.id,
        type: "student-card",
        disabled: false
    })

    return (
        <div ref={draggableRef} className="user-card">
            <p>{props.student.surname}, {props.student.name}</p>
        </div>
    )

}

export default StudentsCardComp;