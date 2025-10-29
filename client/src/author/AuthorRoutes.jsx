// author/AuthorRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthorDashboardLayout from "./layout/AuthorDashboardLayout";
import UserProfile from "./components/UserProfile";
import AllCategories from "./components/AllCategories";
import MyBlogs from "./components/MyBlogs";
import DisplayUserBlogs from "./components/DisplayUserBlogs";
import AllBlogPosts from "./components/AllBlogPosts";
import CommentsOnMyPosts from "./components/CommentsOnMyPosts";
import MyLikes from "./components/MyLikes";
import MyFavorites from "./components/MyFavorites";
import MySubscriptions from "./components/MySubscriptions";
import MyNotifications from "./components/MyNotifications";
import AddPostAuthor from "./pages/AddPostAuthor";
import ProjectManagerAuthor from "./pages/ProjectManagerAuthor";
import ProjectManager from "./pages/ProjectManager";
import EditorContextProvider from "../apps/notes/components/EditorContext";
import AllPostsList from "./pages/AllPostsList";
import Post from "../admin/pages/Post";


export default function AuthorRoutes({ user }) {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<AuthorDashboardLayout user={user} />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="allCategories" element={<AllCategories />} />
        <Route path="myBlogs" element={<MyBlogs />} />
        <Route path="myPosts" element={<DisplayUserBlogs />} />
        <Route path="allPosts" element={<AllBlogPosts />} />
        <Route path="comments" element={<CommentsOnMyPosts />} />
        <Route path="likes" element={<MyLikes />} />
        <Route path="favorites" element={<MyFavorites />} />
        <Route path="subscriptions" element={<MySubscriptions />} />
        <Route path="notifications" element={<MyNotifications />} />

        <Route path="projectmanager" element={user && <ProjectManagerAuthor />} />
        <Route path="project-manager" element={user && <ProjectManager />} />

        <Route
          path="add-post"
          element={
            <EditorContextProvider>
              <AddPostAuthor user={user} />
            </EditorContextProvider>
          }
        />

        <Route path="all-posts" element={<AllPostsList user={user} />} />
        <Route path="post/:slug" element={<Post user={user} />} />
      </Route>
    </Routes>
  );
}

