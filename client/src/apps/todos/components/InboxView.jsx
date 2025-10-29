// ✅ src/components/InboxView.jsx
// ✅ src/apps/todos/components/InboxView.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../../api/newRequest";
import TodoCard from "./TodoCard";
import "./TodosViews.css";

const InboxView = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchInboxTodos = async () => {
      try {
        const res = await newRequest.get("/todos/marked/all");
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to load todos:", err);
      }
    };
    fetchInboxTodos();
  }, []);

  return (
    <div className="todos-views-container">
      <h4>📥 Inbox</h4>
      {todos.length === 0 ? (
        <p>No todos in inbox.</p>
      ) : (
        todos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
      )}
    </div>
  );
};

export default InboxView;


