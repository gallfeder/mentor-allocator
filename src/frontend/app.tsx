import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectHomepage from "./Pages/Home/ProjectHomepage";
import MallocStateProvider from "./Models/States/MallocStateProvider";
import "./app.css"
import ProjectPage from "./Pages/Project/ProjectPage";

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
            <MallocStateProvider>
                <AppContent/>
            </MallocStateProvider>
        </BrowserRouter>
    )

}

export default App;