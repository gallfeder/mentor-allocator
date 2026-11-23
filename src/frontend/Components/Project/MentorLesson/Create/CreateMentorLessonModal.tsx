import Modal from "../../../Generic/Modal/Modal";
import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {useMallocState} from "../../../../Models/States/Hooks";
import {useParams} from "react-router-dom";
import {Course, Day, ProjectId, Teacher, TeacherId} from "../../../../../shared/types";
import {RefObject, useRef} from "react";
import {CreateMentorLessonPayload} from "./MentorLessonCreateComp";

interface Props {
    createMentorLesson: (payload: CreateMentorLessonPayload) => void;
    onClosed: () => void;
}

const CreateMentorLessonModal = (props: Props) => {

    const mallocState: MallocState = useMallocState();
    const { projectId, grade } = useParams();
    const teacherSelect: RefObject<HTMLSelectElement | null> = useRef<HTMLSelectElement>(null);
    const daySelect: RefObject<HTMLSelectElement | null> = useRef<HTMLSelectElement>(null);
    const lessonSelect: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
    if (!stateProject) {
        props.onClosed();
        return null;
    }

    function createMentorLesson() {
        if (!teacherSelect.current || !daySelect.current) {
            return;
        }

        const teacherId: TeacherId = Number(teacherSelect.current.value) as TeacherId;
        const day: Day = daySelect.current.value as unknown as Day;
        // eslint-disable-next-line no-constant-binary-expression
        const lesson: number = Number(lessonSelect.current?.value) ?? 0;

        const createMentorLessonPayload: CreateMentorLessonPayload = {
            teacherId: teacherId,
            day: day,
            lesson
        }
        props.createMentorLesson(createMentorLessonPayload);
    }

    function getContextRelevantTeachers(): Teacher[] {
        if (!stateProject) {
            return [];
        }

        const contextRelevantTeacherIds: TeacherId[] = Array.from(
            new Set(
                Array.from(stateProject.courses.values())
                    .filter((course: Course) => course.grade === grade)
                    .map((course: Course) => course.teacher)
            )
        );

        return contextRelevantTeacherIds.map((teacherId: TeacherId) => stateProject.teachers.get(teacherId))
            .filter((teacher: Teacher | undefined) => teacher !== undefined).sort(((a: Teacher, b: Teacher) => a.shorthand.localeCompare(b.shorthand)));
    }

    return (
        <Modal onClosed={props.onClosed} modalSize="modal-medium"
               header={
                   <div className="create-mentor-modal-header">
                       <h2>Create mentor lesson</h2>
                   </div>
               }
               footer={
                   <div className="create-mentor-modal-footer">
                       <button className="button primary" onClick={createMentorLesson}>Create lesson</button>
                       <button className="button normal" onClick={() => props.onClosed()}>Cancel</button>
                   </div>
               }
        >
            <div className="create-mentor-modal">
                <div className="general-information-section">
                    <div className="modal-section-header">
                        <h3 className="section-title">General information</h3>
                        <hr className="line"/>
                    </div>

                    <div className="teacher-selector">
                        <p>Teacher</p>
                        <select ref={teacherSelect}>
                            {getContextRelevantTeachers().map((teacher: Teacher) => {
                                return <option key={teacher.id} value={teacher.id}>{teacher.shorthand}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="time-information-section">
                    <div className="modal-section-header">
                        <h3 className="section-title">Time</h3>
                        <hr className="line"/>
                    </div>

                    <div className="section-field day-selector">
                        <p>Day</p>
                        <select ref={daySelect}>
                            <option value={-1}>Unspecified</option>
                            <option value={0}>Monday</option>
                            <option value={1}>Tuesday</option>
                            <option value={2}>Wednesday</option>
                            <option value={3}>Thursday</option>
                            <option value={4}>Friday</option>
                            <option value={5}>Saturday</option>
                            <option value={6}>Sunday</option>
                        </select>
                    </div>

                    <div className="section-field lesson-selector">
                        <p>Lesson</p>
                        <input ref={lessonSelect} type="number" placeholder="Unspecified" min={0} max={13}/>
                    </div>
                </div>
            </div>
        </Modal>
    )

}

export default CreateMentorLessonModal;