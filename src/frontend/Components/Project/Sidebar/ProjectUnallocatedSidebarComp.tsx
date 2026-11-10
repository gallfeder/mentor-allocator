import {useMallocState} from "../../../Models/States/Hooks";
import {useParams} from "react-router-dom";
import {ProjectId, Student} from "../../../../shared/types";
import StudentsCardComp from "../Students/StudentsCardComp";

const ProjectUnallocatedSidebarComp = () => {

    const mallocState = useMallocState();
    const { projectId, grade } = useParams();

    const students: Student[] | undefined = mallocState.projects.get(projectId as ProjectId)?.students.values().toArray();

    return (
        <div className="project-unallocated-sidebar panel">
            <h3>Unallocated students</h3>
            <div className="unallocated-students">
                {students?.map((student: Student) => {
                    if (student.mentorLessonId <= 0 || student.grade !== grade) {
                        return null;
                    }

                    return <StudentsCardComp key={student.id} student={student}/>
                })}
            </div>
        </div>
    )

}

export default ProjectUnallocatedSidebarComp;