import {MentorLesson} from "../../../../shared/types";
import MentorLessonStudentsComp from "./MentorLessonStudentsComp";

interface Props {
    mentorLesson: MentorLesson;
}

const MentorLessonComp = (props: Props) => {

    return (
        <div className="mentor-lesson">
            <div className="mentor-header">
                <h3>Day {props.mentorLesson.day}, lesson {props.mentorLesson.lesson}</h3>
            </div>
            <MentorLessonStudentsComp mentorLesson={props.mentorLesson}/>
        </div>
    )

}

export default MentorLessonComp;