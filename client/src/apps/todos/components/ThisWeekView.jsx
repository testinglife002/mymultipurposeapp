// ✅ src/components/TodoViews/ThisWeekView.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../../api/newRequest";
import TodoCard from "./TodoCard";
import TodosDetailsModal from "./TodosDetailsModal";
import "./TodosViews.css";
import { format, parseISO } from "date-fns";

const ThisWeekView = () => {
  const [todosByDay, setTodosByDay] = useState({});
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    const fetchThisWeekTodos = async () => {
      try {
        const res = await newRequest.get("/todos/next-7-days");
        setTodosByDay(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchThisWeekTodos();
  }, []);

  const handleShowDetails = (todo) => setSelectedTodo(todo);
  const handleCloseModal = () => setSelectedTodo(null);

  return (
    <div>
      <h4>📅 Todos This Week</h4>
      {Object.entries(todosByDay).map(([dateStr, todos]) => {
        const parsedDate = parseISO(dateStr);
        const formatted = format(parsedDate, "EEEE, MMM d");

        return (
          <div key={dateStr}>
            <h5>{formatted}</h5>
            {todos.length === 0 ? (
              <p>No todos</p>
            ) : (
              todos.map((todo) => (
                <TodoCard key={todo._id} todo={todo} onShowDetails={handleShowDetails} />
              ))
            )}
          </div>
        );
      })}

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

export default ThisWeekView;

