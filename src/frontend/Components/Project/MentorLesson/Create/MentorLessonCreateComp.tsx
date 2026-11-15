import {useState} from "react";
import {createPortal} from "react-dom";
import CreateMentorLessonModal from "./CreateMentorLessonModal";
import "./CreateMentorLesson.css"
import {Day, MentorLessonId, ProjectId, TeacherId} from "../../../../../shared/types";
import {useMallocDispatch, useMallocState} from "../../../../Models/States/Hooks";
import {useParams} from "react-router-dom";
import {MallocState, StateProject} from "../../../../Models/States/MallocState";

export interface CreateMentorLessonPayload {
    teacherId: TeacherId,
    day: Day
}

const MentorLessonCreateComp = () => {

    const mallocState: MallocState = useMallocState();
    const mallocDispatch = useMallocDispatch();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { projectId, grade } = useParams();

    async function createMentorLesson(payload: CreateMentorLessonPayload): Promise<void> {
        setIsCreating(false);

        const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
        if (!stateProject) {
            return;
        }

        const predictedMentorLessonId: MentorLessonId = Date.now() * -1;

        mallocDispatch!({ type: "CREATE_MENTOR_LESSON_OPTIMISTIC", payload: {
                projectId: projectId as ProjectId,
                predictedMentorLessonId: predictedMentorLessonId,
                teacherId: payload.teacherId,
                day: payload.day,
                lesson: 0,
                grade: grade!
            }
        });

        const mentorLessonId: MentorLessonId = await window.electronAPI.createMentorLesson(
            projectId as ProjectId, Number(payload.day), 0, payload.teacherId
        );
        if (mentorLessonId > 0) {
            mallocDispatch!({ type: "CREATE_MENTOR_LESSON_SUCCEEDED", payload: {
                    projectId: projectId as ProjectId,
                    predictedMentorLessonId: predictedMentorLessonId,
                    newMentorLessonId: mentorLessonId
                }
            });
        } else {
            mallocDispatch!({ type: "CREATE_MENTOR_LESSON_FAILED", payload: {
                    projectId: projectId as ProjectId,
                    mentorLessonId: predictedMentorLessonId
                }
            });
        }
    }

    return (
        <div onClick={() => setIsCreating(true)} className="mentor-lesson-create mentor-lesson button">
            <p>+</p>
            {
                isCreating && (
                    createPortal(<CreateMentorLessonModal createMentorLesson={createMentorLesson} onClosed={() => setIsCreating(false)}/>, document.body)
                )
            }
        </div>
    )

}

export default MentorLessonCreateComp;