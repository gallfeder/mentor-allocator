import {useMallocState} from "../../Models/States/Hooks";
import {MallocState, StateProject} from "../../Models/States/MallocState";
import {useParams} from "react-router-dom";
import {MentorLesson, ProjectId} from "../../../shared/types";
import MentorLessonComp from "./MentorLesson/MentorLessonComp";

const ProjectComp = () => {

    const mallocState: MallocState = useMallocState();
    const { projectId, grade } = useParams();

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
    if (!stateProject) {
        return null;
    }

    let mentorLessons: MentorLesson[] = Array.from(stateProject.mentorLessons.values()).filter((mentorLesson: MentorLesson) => mentorLesson.grade === grade);
    mentorLessons = mentorLessons.sort((a: MentorLesson, b: MentorLesson) => {
        if (a.day < b.day) {
            return -1;
        } else if (a.day == b.day) {
            return a.lesson < b.lesson ? -1 : a.lesson === b.lesson ? 0 : 1;
        } else {
            return 1;
        }
    })

    return (
        <div className="project panel scroller">
            <div className="mentor-lessons">
                {mentorLessons.map((mentorLesson: MentorLesson) => {
                    return <MentorLessonComp key={mentorLesson.id} mentorLesson={mentorLesson}/>
                })}
            </div>
        </div>
    )

}

export default ProjectComp;