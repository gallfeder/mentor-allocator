import ProjectViewComp from "../../Components/Projects/ProjectViewComp";
import HeaderComp from "../../Components/Header/HeaderComp";
import "../Pages.css"

const ProjectHomepage = () => {

    return (
        <div className="app">
            <HeaderComp/>
            <ProjectViewComp/>
        </div>
    )

}

export default ProjectHomepage;