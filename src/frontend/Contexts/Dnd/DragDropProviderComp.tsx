import {DragDropProvider} from "@dnd-kit/react";
import {matchPath, useLocation} from "react-router-dom";
import {useMallocDispatch} from "../../Models/States/Hooks";
import {MentorLessonId, ProjectId, StudentId} from "../../../shared/types";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = (props: Props) => {

    const location = useLocation();
    const match = matchPath({ path: "projects/:projectId/*" }, location.pathname);
    const projectId: ProjectId = match?.params.projectId as ProjectId;

    const mallocDispatch = useMallocDispatch();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    function updateDragEndState(event: { operation; nativeEvent?: Event | undefined; canceled?: boolean; suspend?: () => { resume(): void; abort(): void; }; }) {
        const { source, target } = event.operation;

        if (source?.type === "student-card" && target?.type === "mentor-lesson") {
            const mentorLessonId: MentorLessonId = target.id;
            const studentIds: StudentId[] = [source.id];

            mallocDispatch!({
                type: "ALLOC_STUDENTS", payload: {
                    projectId: projectId,
                    mentorLessonId: mentorLessonId,
                    students: studentIds
                }
            });

            window.electronAPI.allocateStudents(projectId, mentorLessonId, studentIds).then();
        }
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                updateDragEndState(event);
            }}
        >
            {props.children}
        </DragDropProvider>
    )

}

export default DragDropProviderComp;