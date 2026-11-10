import {useMallocState} from "../../../../Models/States/Hooks";
import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {useParams} from "react-router-dom";
import {ProjectId} from "../../../../../shared/types";
import GradeComp from "./GradeComp";

const ProjectGradesSidebarComp = () => {

    const mallocState: MallocState = useMallocState();
    const { projectId } = useParams();

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
    if (!stateProject) {
        return null;
    }

    const grades: string[] = [];
    for (const student of Array.from(stateProject.students.values())) {
        if (!grades.includes(student.grade)) {
            grades.push(student.grade);
        }
    }

    return (
        <div className="project-view-sidebar panel">
            <div className="project-view-grades">
                {grades.sort((a: string, b: string) => a.localeCompare(b)).map((grade: string) => {
                    return <GradeComp key={grade} grade={grade}/>
                })}
            </div>
        </div>
    )

}

export default ProjectGradesSidebarComp;