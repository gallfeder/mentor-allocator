import {Course, MentorLesson, ProjectId, StudentId} from "../../../../shared/types";
import MentorLessonStudentsComp from "./MentorLessonStudentsComp";
import MentorLessonHeaderComp from "./MentorLessonHeaderComp";
import {useDragOperation, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import "./MentorLessons.css";
import {MallocState, StateProject} from "../../../Models/States/MallocState";
import {useMallocState} from "../../../Models/States/Hooks";
import {useParams} from "react-router-dom";

interface Props {
    mentorLesson: MentorLesson;
}

const MentorLessonComp = (props: Props) => {

    const { projectId } = useParams();
    const mallocState: MallocState = useMallocState();
    const operation = useDragOperation();

    function isValidDropTarget(): boolean {
        if (operation.source?.type === "student-card") {
            const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
            if (!stateProject) {
                return false;
            }

            const studentId: StudentId = operation.source.id as unknown as StudentId;

            const course: Course | undefined = stateProject.courses.values().find((course: Course) => {
                return course.teacher === props.mentorLesson.teacherId && course.students.includes(studentId)
            });
            return course !== undefined;
        }

        return false;
    }


    function getDropCssClasses(): string {
        if (operation.source === null || operation.source === undefined) {
            return "";
        }

        if (isValidDropTarget()) {
            return `valid-drop-target${isDropTarget ? "-active" : ""}`;
        }
        return "invalid-drop-target";
    }

    const { ref: droppableRef, isDropTarget } = useDroppable({
        id: props.mentorLesson.id,
        type: "mentor-lesson",
        disabled: false,
        collisionPriority: CollisionPriority.Highest
    });

    return (
        <div ref={droppableRef} className={`mentor-lesson ${getDropCssClasses()}`}>
            <MentorLessonHeaderComp mentorLesson={props.mentorLesson}/>
            <MentorLessonStudentsComp mentorLesson={props.mentorLesson}/>
        </div>
    )

}

export default MentorLessonComp;