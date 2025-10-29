// admin/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboardHome from "./pages/AdminDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProjectManager from "./pages/ProjectManager";
import AddCategory from "./components/AddCategory";
import AddCategoryUI from "./components/AddCategoryUI";
import CategoriesList from "./components/CategoriesList";
import AllCategory from "./components/AllCategory";
import CategoryManagerAlt from "./components/CategoryManagerAlt";
import CategoryNodeII from "./components/CategoryNodeII";
import CategoryNodeAlt from "./components/CategoryNodeAlt";
import CategoryTreeView from "./components/CategoryTreeView";
import CategoryTreeViewAlt from "./components/CategoryTreeViewAlt";
import EditCategory from "./components/EditCategory";
import AddPost from "./pages/AddPost";
import EditorContextProvider from "../apps/notes/components/EditorContext";
import AllPosts from "./pages/AllPosts";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import AllPostsList from "./pages/AllPostsList";
import Post from "./pages/Post";
import PostDetail from "./pages/PostDetail";
import EditingPost from "./pages/EditingPost";
import ChannelManager from "./pages/ChannelManager";

export default function AdminRoutes({ user }) {
  return (
    <Routes>
      <Route path="dashboard/*" element={<AdminLayout user={user} />}>
        <Route index element={<AdminDashboardHome />} />
        <Route path="" element={<AdminDashboard />} />

        {/* Project & Category routes */}
        <Route path="project-manager" element={user && <ProjectManager user={user} />} />
        <Route path="channel-manager" element={<ChannelManager/>} />

        <Route path="add-category" element={<AddCategory />} />
        <Route path="add-category-ui" element={<AddCategoryUI />} />
        <Route path="categories-list" element={<CategoriesList />} />
        <Route path="all-category" element={<AllCategory />} />
        <Route path="category-manager-alt" element={<CategoryManagerAlt />} />
        <Route path="category-node-ii" element={<CategoryNodeII />} />
        <Route path="category-node-alt" element={<CategoryNodeAlt />} />
        <Route path="category-tree" element={<CategoryTreeView />} />
        <Route path="category-tree-alt" element={<CategoryTreeViewAlt />} />
        <Route path="edit-category/:slug" element={<EditCategory />} />

        {/* Post routes */}
        <Route
          path="add-post"
          element={
            <EditorContextProvider>
              <AddPost user={user} />
            </EditorContextProvider>
          }
        />
        <Route path="all-post" element={<AllPosts user={user} />} />

        {/* Canonical slug-based routes */}
        <Route path="all-posts" element={<AllPostsList user={user} />} />

        {/* ✅ Canonical slug-based routes */}
        <Route path="slug/:slug" element={<PostDetails user={user} />} />

        <Route path="posts/:slug" element={<PostDetail user={user} />} />

        <Route path="post/:slug" element={<Post user={user} />} />

        <Route
          path="edit-post/:slug"
          element={
            <EditorContextProvider>
              <EditPost user={user} />
            </EditorContextProvider>
          }
        />  

        <Route
          path="editing-post/:slug"
          element={
            <EditorContextProvider>
              <EditingPost user={user} />
            </EditorContextProvider>
          }
        />  

      </Route>
    </Routes>
  );
}
