import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectHomepage from "./Pages/Projects/ProjectHomepage";

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
            <AppContent/>
        </BrowserRouter>
    )

}

export default App;