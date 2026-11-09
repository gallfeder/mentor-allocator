import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectHomepage from "./Pages/Projects/ProjectHomepage";
import MallocStateProvider from "./Models/States/MallocStateProvider";
import "./app.css"

const AppContent = () => {

    return (
        <Routes>
            <Route path="/" element={<ProjectHomepage/>}/>
        </Routes>
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