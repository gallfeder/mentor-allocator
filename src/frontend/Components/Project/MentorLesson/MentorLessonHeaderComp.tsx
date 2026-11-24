import {Day, MentorLesson, ProjectId, Teacher} from "../../../../shared/types";
import {MallocState, StateProject} from "../../../Models/States/MallocState";
import {useMallocState} from "../../../Models/States/Hooks";
import {useParams} from "react-router-dom";
import {getTeacherName} from "../../../Helpers/teacherHelpers";

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
            <h3>{teacher ? getTeacherName(teacher) : "No teacher assigned..."}</h3>
            <div className="header-tags">
                { (props.mentorLesson.day > 0 || props.mentorLesson.lesson > 0) && (
                    <>
                        <p className="mentor-header-tag">{props.mentorLesson.day != Day.Unspecified ? toDayText(props.mentorLesson.day) : "No day specified"}</p>
                        { props.mentorLesson.lesson > 0 && <p className="mentor-header-tag">{props.mentorLesson.lesson}.</p> }
                    </>
                )}
            </div>
        </div>
    )

}

export default MentorLessonHeaderComp;