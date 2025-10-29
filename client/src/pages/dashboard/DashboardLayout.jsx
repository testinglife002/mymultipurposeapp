// // frontend/src/pages/dashboard/DashboardLayout.jsx (routes)

import { Routes, Route, Link } from "react-router-dom";
import AdminPanel from "../admin/AdminPanel";
import AuthorPanel from "../author/AuthorPanel";
import UserPanel from "../user/UserPanel";
import PrivateRoute from "../../components/auth/PrivateRoute";


export default function DashboardLayout({user}) {
  return (
    <div>
      <nav className="p-3 border-bottom">
        <Link className="me-3" to="/dashboard/admin">Admin</Link>
        <Link className="me-3" to="/dashboard/author">Author</Link>
        <Link className="me-3" to="/dashboard/user">User</Link>
      </nav>
      <div className="p-3">
        <Routes>
          <Route path="admin" element={<PrivateRoute allowedRoles={["admin"]}><AdminPanel/></PrivateRoute>} />
          <Route path="author" element={<PrivateRoute allowedRoles={["author"]}><AuthorPanel/></PrivateRoute>} />
          <Route path="user" element={<PrivateRoute allowedRoles={["user"]}><UserPanel/></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}