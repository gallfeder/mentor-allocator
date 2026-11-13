import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectHomepage from "./Pages/Home/ProjectHomepage";
import MallocStateProvider from "./Models/States/MallocStateProvider";
import "./app.css"
import ProjectPage from "./Pages/Project/ProjectPage";
import DragDropProviderComp from "./Contexts/Dnd/DragDropProviderComp";

const AppContent = () => {

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<ProjectHomepage/>}/>
                <Route path="projects/:projectId" element={<ProjectPage/>}/>
                <Route path="projects/:projectId/grade/:grade?" element={<ProjectPage/>}/>
            </Routes>
        </div>
    )

}

const App = () => {

    return (
        <BrowserRouter>
            <DragDropProviderComp>
                <MallocStateProvider>
                    <AppContent/>
                </MallocStateProvider>
            </DragDropProviderComp>
        </BrowserRouter>
    )

}

export default App;