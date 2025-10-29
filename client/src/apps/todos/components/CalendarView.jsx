// ✅ src/components/TodoViews/CalendarView.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import newRequest from "../../../api/newRequest";
import TodoCard from "./TodoCard";
import TodosDetailsModal from "./TodosDetailsModal";
import "./TodosViews.css";

const CalendarView = () => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    const fetchAllTodos = async () => {
      try {
        const res = await newRequest.get("/todos");
        setTodos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllTodos();
  }, []);

  const groupedByDate = todos.reduce((acc, todo) => {
    const dateKey = todo.dueDate ? dayjs(todo.dueDate).format("YYYY-MM-DD") : "No Due Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(todo);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    const dayTodos = groupedByDate[dateKey] || [];
    if (dayTodos.length === 0) return null;
    return <div className="tile-todo-count">{dayTodos.length}</div>;
  };

  const selectedKey = dayjs(selectedDate).format("YYYY-MM-DD");
  const todosForSelectedDate = groupedByDate[selectedKey] || [];

  const handleShowDetails = (todo) => setSelectedTodo(todo);
  const handleCloseModal = () => setSelectedTodo(null);

  return (
    <div className="calendar-container">
      <h4>📆 Calendar View</h4>
      <Calendar value={selectedDate} onChange={setSelectedDate} tileContent={tileContent} />
      <div className="todos-for-date">
        <h5>Todos on {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}:</h5>
        {todosForSelectedDate.length > 0 ? (
          todosForSelectedDate.map((todo) => (
            <TodoCard key={todo._id} todo={todo} onShowDetails={handleShowDetails} />
          ))
        ) : (
          <p>No todos for this date.</p>
        )}
      </div>

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

export default CalendarView;

