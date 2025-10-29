// apps/AppsRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AppsLayout from "./layout/AppsLayout";
import EditorContextProvider from "./notes/components/EditorContext";
import NotesUIApp from "./notes/NotesUIApp";
import Notes from "./notes/Notes";
import NoteDetailsWrapper from "./notes/components/NotesDetails";
import TodosApp from "./todos/TodosApp";
import TodoApp from "./todos/TodoApp";
import TodoLayout from "./todos/layout/TodoLayout";
import InboxView from "./todos/components/InboxView";
import TodayView from "./todos/components/TodayView";
import ThisWeekView from "./todos/components/ThisWeekView";
import CalendarView from "./todos/components/CalendarView";
import AllTodosView from "./todos/components/AllTodosView";
import CreateTodo from "./todos/components/CreateTodo";
import TaskLayout from "./taskmanager/TaskLayout";
import Tasks from "./taskmanager/components/Tasks";
import Trash from "./taskmanager/pages/Trash";
import TrelloDashboardPageUI from "./trello/TrelloDashboardPageUI";
import BoardDetailsPageUI from "./trello/components/BoardDetailsPageUI";
import Layout from "./taskmanager/Layout";
import TaskManager from "./taskmanager/TaskManager";
import TodosDetailsPage from "./todos/components/TodosDetailsPage";
import Dashboard from "./taskmanager/pages/Dashboard";
import UserListAlt from "./taskmanager/components/UserListAlt";
import TaskDetails from "./taskmanager/pages/TaskDetails";
import Users from "./taskmanager/pages/Users";

export default function AppsRoutes({ user }) {
  return (
    <Routes>
      <Route element={<AppsLayout user={user} />}>
        <Route
          index
          element={<div style={{ padding: 20 }}>Select an app from the sidebar</div>}
        />

        {/* Notes */}
        <Route
          path="notes"
          element={
            <EditorContextProvider>
              <Notes user={user} />
            </EditorContextProvider>
          }
        />
        <Route path="notesapp" element={<NotesUIApp user={user} />} />
        <Route path="note/:id" element={<NoteDetailsWrapper user={user} />} />

        {/* Todos */}
        <Route path="todosapp" element={<TodosApp />} />
        <Route path="todoapp" element={<TodoApp />} />
        <Route path="todo" element={<TodoLayout />}>
          <Route index element={<InboxView />} />
          <Route path="inbox" element={<InboxView />} />
          <Route path="today" element={<TodayView />} />
          <Route path="week" element={<ThisWeekView />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="all" element={<AllTodosView />} />
          <Route path="add-todos" element={<CreateTodo user={user} />} />
          <Route path=":todoId" element={<TodosDetailsPage />} />
        </Route>

        {/* Tasks */}
        <Route path="taskmanager" element={<TaskManager />} />
        <Route path="task-manager" element={<Layout user={user} />}>
          <Route path="task-dashboard" element={<Dashboard user={user} />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="completed/:status" element={<Tasks />} />
          <Route path="in-progress/:status" element={<Tasks />} />
          <Route path="todo/:status" element={<Tasks />} />
          <Route path="team" element={<Users />} />
          <Route path="trashed" element={<Trash />} />
          <Route path="task/:id" element={<TaskDetails />} />
        </Route>

        {/* Trello Dashboard */}
        {/* Trello Dashboard */}
        <Route
          path="trello"
          element={<TrelloDashboardPageUI user={user || { username: "Guest" }} />}
        />
        <Route path="board/:boardId" element={<BoardDetailsPageUI  />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>App not found.</div>} />
    </Routes>
  );
}

