import {useMallocDispatch, useMallocState} from "../../../Models/States/Hooks";
import {useParams} from "react-router-dom";
import {ProjectId, Student} from "../../../../shared/types";
import StudentsCardComp from "../Students/StudentsCardComp";
import {MallocState} from "../../../Models/States/MallocState";
import {useDragOperation, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";

const ProjectUnallocatedSidebarComp = () => {

    const mallocDispatch = useMallocDispatch();
    const mallocState: MallocState = useMallocState();
    const { projectId, grade } = useParams();

    const operation = useDragOperation();
    const { ref: droppableRef, isDropTarget } = useDroppable({
        id: -1,
        type: "mentor-lesson",
        disabled: false,
        collisionPriority: CollisionPriority.Highest
    });

    const students: Student[] | undefined = mallocState.projects.get(projectId as ProjectId)?.students.values().toArray();

    async function autoAllocate(): Promise<void> {
        const students: Student[] | undefined = await window.electronAPI.automaticallyAllocateStudents(projectId as ProjectId);
        if (!students) {
            return;
        }

        mallocDispatch!({ type: "SET_STUDENTS", payload: { projectId: projectId as ProjectId, students: students } });
    }

    function isStudentCardDropTarget(): boolean {
        return isDropTarget && operation.source?.type === "student-card";
    }

    return (
        <div ref={droppableRef} className={`project-unallocated-sidebar panel ${isStudentCardDropTarget() ? "valid-drop-target" : ""}`}>
            <h3>Unallocated students</h3>
            <div className="unallocated-students scroller">
                {students?.map((student: Student) => {
                    if (student.mentorLessonId > 0 || student.grade !== grade) {
                        return null;
                    }

                    return <StudentsCardComp key={student.id} student={student}/>
                })}
            </div>
            <button onClick={autoAllocate} className="auto-allocate button primary">Automatically allocate</button>
        </div>
    )

}

export default ProjectUnallocatedSidebarComp;