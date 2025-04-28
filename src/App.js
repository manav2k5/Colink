import React from "react";
import { Routes, Route } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Start from "./pages/Start";
import CompanyName from "./pages/CompanyName";
import UserProfile from "./pages/UserProfile";
import ProjectType from "./pages/ProjectType";
import Homepage1 from "./pages/Homepage1";
import Homepage2 from "./pages/Homepage2.jsx";
import SocialPage from "./pages/SocialPage";
import DMsPage from "./pages/DMsPage";
import ActivityPage from "./pages/ActivityPage";
import CompanyHandbook from "./pages/CompanyHandbook.jsx"
import KanbanBoard from "./pages/kanbanboard.jsx";
import Roadmap  from "./pages/roadmap.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/start" element={<Start />} />
      <Route path="/company" element={<CompanyName />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/project" element={<ProjectType />} />
      <Route path="/homepage1" element={<Homepage1 />} />
      <Route path="/homepage2" element={<Homepage2 />} />
      <Route path="/social" element={<SocialPage />} />
      <Route path="/dms" element={<DMsPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/companyhandbook" element={<CompanyHandbook />} /> 
      <Route path="/kanbanboard" element={<KanbanBoard />} />
      <Route path="/roadmap" element={<Roadmap />} />

    </Routes>
  );
}

export default App; 
