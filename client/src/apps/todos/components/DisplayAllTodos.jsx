import React, { useEffect, useState } from "react";
import TodoCard from "./TodoCard";
import TodoDetailsModal from "./TodoDetailsModal";
import newRequest from "../../../api/newRequest";
import "./DisplayAllTodos.css";

const DisplayAllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await newRequest.get("/todos/my-todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleUpdatedTodo = (updated) => {
    setTodos((prevTodos) => {
      if (!updated) return prevTodos.filter((t) => t._id !== selectedTodo._id);
      return prevTodos.map((t) => (t._id === updated._id ? updated : t));
    });
  };

  return (
    <div className="display-all-todos">
      {todos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} onShowDetails={setSelectedTodo} />
      ))}
      {selectedTodo && (
        <TodoDetailsModal
          show={!!selectedTodo}
          todo={selectedTodo}
          onHide={() => setSelectedTodo(null)}
          onTodoUpdated={handleUpdatedTodo}
        />
      )}
    </div>
  );
};

export default DisplayAllTodos;

