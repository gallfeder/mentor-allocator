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

        const hasName: boolean = Boolean(teacher.name);
        const hasSurname: boolean = Boolean(teacher.surname);
        const hasShorthand: boolean = Boolean(teacher.shorthand);

        let namePart: string = "";

        if (hasName && hasSurname) {
            namePart = `${teacher.name}, ${teacher.surname}`;
        } else if (hasName) {
            namePart = teacher.name;
        } else if (hasSurname) {
            namePart = teacher.surname;
        }

        if (!namePart) {
            return hasShorthand ? `(${teacher.shorthand})` : "No teacher assigned...";
        }

        return hasShorthand ? `${namePart} (${teacher.shorthand})` : namePart;
    }

    function toDayText(day: Day): string {
        let value: string = "";
        if (day == Day.Monday) value = "MO";
        else if (day == Day.Tuesday) value = "DI";
        else if (day == Day.Wednesday) value = "MI";
        else if (day == Day.Thursday) value = "DO";
        else if (day == Day.Friday) value = "FR";
        else if (day == Day.Saturday) value = "SA";
        else if (day == Day.Sunday) value = "SO";
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