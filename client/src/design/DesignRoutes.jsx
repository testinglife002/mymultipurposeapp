import React from "react";
import { Routes, Route } from "react-router-dom";
import CanvaLayout from "./layout/CanvaLayout";
import CanvaHome from "./pages/CanvaHome";
import CanvaTemplate from "./pages/CanvaTemplate";
import CanvaProject from "./pages/CanvaProject";
import CreateDesign from "./comopnents/CreateDesign";
import Main from "./comopnents/Main";

const DesignRoutes = ({ user }) => {
  return (
    <Routes>
      {/* Base path: /designs */}
      <Route path="/" element={<CanvaLayout user={user} />}>
        {/* Other sub-routes */}
        <Route path="canva-home" element={<CanvaHome />} />        {/* /designs/home */}
        <Route path="templates" element={<CanvaTemplate />} /> 
        <Route path="projects" element={<CanvaProject />} /> 
      </Route>
      <Route path="design/create" element={<CreateDesign />} />  {/* /designs/design/create */}
      <Route path=":designId/edit" element={<Main />} />          {/* /designs/:designId/edit */}
    </Routes>
  );
};

export default DesignRoutes;
