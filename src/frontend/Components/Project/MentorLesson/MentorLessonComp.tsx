import {MentorLesson} from "../../../../shared/types";
import MentorLessonStudentsComp from "./MentorLessonStudentsComp";
import MentorLessonHeaderComp from "./MentorLessonHeaderComp";
import {useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import MentorLessonDropTargetComp from "./MentorLessonDropTargetComp";

interface Props {
    mentorLesson: MentorLesson;
}

const MentorLessonComp = (props: Props) => {

    const { ref: droppableRef, isDropTarget  } = useDroppable({
        id: props.mentorLesson.id,
        type: "mentor-lesson",
        disabled: false,
        collisionPriority: CollisionPriority.Highest
    });

    return (
        <div ref={droppableRef} className="mentor-lesson">
            <MentorLessonHeaderComp mentorLesson={props.mentorLesson}/>
            <MentorLessonStudentsComp mentorLesson={props.mentorLesson}/>
            { isDropTarget && <MentorLessonDropTargetComp/> }
        </div>
    )

}

export default MentorLessonComp;