import {Day, MentorLesson, ProjectId, Teacher} from "../../../../shared/types";
import {MallocState, StateProject} from "../../../Models/States/MallocState";
import {useMallocState} from "../../../Models/States/Hooks";
import {useParams} from "react-router-dom";

interface Props {
    mentorLesson: MentorLesson;
}

const MentorLessonHeaderComp = (props: Props) => {

    const mallocState: MallocState = useMallocState();
    const { projectId } = useParams();

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
    if (!stateProject) {
        return null;
    }
    const teacher: Teacher | undefined = stateProject.teachers.get(props.mentorLesson.teacherId);

    function getTeacherName(): string {
        if (!teacher) {
            return "No teacher assigned...";
        }

        let teacherName: string = `${teacher.name}, ${teacher.surname}`;
        if (teacher.shorthand.length >= 0) {
            teacherName += ` (${teacher.shorthand})`;
        }

        return teacherName;
    }

    function toDayText(day: Day): string {
        let value: string = "";
        if (day === 0) value = "MO";
        else if (day === 1) value = "DI";
        else if (day === 2) value = "MI";
        else if (day === 3) value = "DO";
        else if (day === 4) value = "FR";
        else if (day === 5) value = "SA";
        else if (day === 6) value = "SO";
        return value;
    }

    return (
        <div className="mentor-lesson-header">
            <h3>{getTeacherName()}</h3>
            <div className="header-tags">
                <p className="mentor-header-tag">{toDayText(props.mentorLesson.day)}</p>
                <p className="mentor-header-tag">{props.mentorLesson.lesson}.</p>
            </div>
        </div>
    )

}

export default MentorLessonHeaderComp;