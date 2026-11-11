import {MallocState, StateProject} from "../../../Models/States/MallocState";
import {useParams} from "react-router-dom";
import {useMallocState} from "../../../Models/States/Hooks";
import {MentorLesson, ProjectId, Student} from "../../../../shared/types";
import StudentsCardComp from "../Students/StudentsCardComp";

interface Props {
    mentorLesson: MentorLesson;
}

const MentorLessonStudentsComp = (props: Props) => {

    const mallocState: MallocState = useMallocState();
    const { projectId, grade } = useParams();

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
    if (!stateProject) {
        return null;
    }

    const students: Student[] = Array.from(stateProject.students.values()).filter((student: Student) => {
            return student.mentorLessonId === props.mentorLesson.id && student.grade === grade;
        });

    return (
        <div className="mentor-lesson-students">
            {students.map((student: Student) => {
                return <StudentsCardComp key={student.id} student={student}/>
            })}
        </div>
    )

}

export default MentorLessonStudentsComp;