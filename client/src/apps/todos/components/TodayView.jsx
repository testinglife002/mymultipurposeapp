// ✅ src/components/TodoViews/TodayView.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../../api/newRequest";
import TodoCard from "./TodoCard";
import TodosDetailsModal from "./TodosDetailsModal";
import "./TodosViews.css";

const TodayView = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    const fetchTodayTodos = async () => {
      try {
        const res = await newRequest.get("/todos/today");
        setTodos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodayTodos();
  }, []);

  const handleShowDetails = (todo) => setSelectedTodo(todo);
  const handleCloseModal = () => setSelectedTodo(null);

  return (
    <div>
      <h4>🗓️ Today’s Todos</h4>
      {todos.length === 0 ? (
        <p>No todos due today.</p>
      ) : (
        todos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} onShowDetails={handleShowDetails} />
        ))
      )}

      {selectedTodo && (
        <TodosDetailsModal
          show={!!selectedTodo}
          todo={selectedTodo}
          onHide={handleCloseModal}
          refreshTodos={() => {}}
        />
      )}
    </div>
  );
};

export default TodayView;

