// ✅ src/apps/todos/components/DisplayTodos.jsx
// DisplayTodos.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Modal,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip
} from "@mui/material";
import {
  GridView,
  TableRows,
  ViewKanban,
  FormatListBulleted
} from "@mui/icons-material";
import { AiOutlineCopy } from "react-icons/ai";
import { BsArrowRepeat } from "react-icons/bs";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import newRequest from "../../../api/newRequest";
import TodosDetailsModal from "./TodosDetailsModal";
import "./DisplayTodos.css";
import TodoDetailsModal from "./TodoDetailsModal";

const DisplayTodos = () => {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState("grid");
  const [selectedTodo, setSelectedTodo] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await newRequest.get("/todos/my-todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
      toast.error("Failed to fetch todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTodoClick = (todo) => setSelectedTodo(todo);

  const handleDuplicate = async (todo, e) => {
    e.stopPropagation();
    try {
      await newRequest.post(`/todos/${todo._id}/duplicate`);
      toast.success("Todo duplicated");
      fetchTodos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate todo");
    }
  };

  const renderTodoCard = (todo) => (
    <Card key={todo._id} className="todo-card" onClick={() => handleTodoClick(todo)}>
      <CardContent>
        <Typography variant="h6">{todo.title}</Typography>
        <Typography className="text-muted">
          {todo.start ? dayjs(todo.start).format("MMM D, YYYY h:mm A") : "-"}
        </Typography>
        <Chip size="small" label={todo.priority} className={`chip-${todo.priority}`} />
        <Chip size="small" label={todo.completed ? "Completed" : "Pending"} className="chip-status" />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={(e) => handleDuplicate(todo, e)}>
          <AiOutlineCopy size={14} /> Duplicate <BsArrowRepeat size={14} />
        </Button>
      </CardActions>
    </Card>
  );

  const renderTableView = () => (
    <Table className="todo-table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Date & Time</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Completed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo._id} onClick={() => handleTodoClick(todo)} className="clickable-row">
            <TableCell>{todo.title}</TableCell>
            <TableCell>{todo.start ? dayjs(todo.start).format("MMM D, YYYY h:mm A") : "-"}</TableCell>
            <TableCell>{todo.priority}</TableCell>
            <TableCell>{todo.completed ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderBoardView = () => (
    <Grid container spacing={2}>
      {["low", "medium", "high"].map((priority) => (
        <Grid item xs={12} md={4} key={priority}>
          <Typography align="center" variant="h6" gutterBottom>
            {priority} Priority
          </Typography>
          {todos.filter((todo) => todo.priority === priority).map(renderTodoCard)}
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <>
      {todos.map((todo) => (
        <Accordion key={todo._id}>
          <AccordionSummary>
            <Typography>
              <strong>{todo.title}</strong> — {todo.completed ? "✅ Completed" : "🕓 Pending"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography><strong>Start:</strong> {todo.start ? dayjs(todo.start).format("MMM D, YYYY h:mm A") : "-"}</Typography>
            <Typography><strong>End:</strong> {todo.end ? dayjs(todo.end).format("MMM D, YYYY h:mm A") : "-"}</Typography>
            <Button variant="outlined" size="small" onClick={() => setSelectedTodo(todo)}>
              View / Edit
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );

  return (
    <div className="todos-container">
      <div className="todos-header">
        <Typography variant="h5">My Todos</Typography>
        <ToggleButtonGroup value={view} exclusive onChange={(e, val) => setView(val || "grid")}>
          <ToggleButton value="grid"><GridView /></ToggleButton>
          <ToggleButton value="table"><TableRows /></ToggleButton>
          <ToggleButton value="board"><ViewKanban /></ToggleButton>
          <ToggleButton value="list"><FormatListBulleted /></ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === "grid" && (
        <Grid container spacing={2}>
          {todos.map((todo) => (
            <Grid key={todo._id} item xs={12} sm={6} md={4} lg={3}>
              {renderTodoCard(todo)}
            </Grid>
          ))}
        </Grid>
      )}
      {view === "table" && renderTableView()}
      {view === "board" && renderBoardView()}
      {view === "list" && renderListView()}

      <Modal open={!!selectedTodo} onClose={() => setSelectedTodo(null)}>
        <Box className="modal-box">
          {selectedTodo && (
            <TodoDetailsModal
              show={!!selectedTodo}
              onHide={() => setSelectedTodo(null)}
              todo={selectedTodo}
              refreshTodos={fetchTodos}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default DisplayTodos;









/*
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Modal,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip
} from "@mui/material";
import {
  GridView,
  ViewList,
  TableRows,
  ViewKanban,
  FormatListBulleted
} from "@mui/icons-material";
import { AiOutlineCopy } from "react-icons/ai";
import { BsArrowRepeat } from "react-icons/bs";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import newRequest from "../../../api/newRequest";
import TodosDetailsModal from "./TodosDetailsModal";

import "./DisplayTodos.css"; // custom styling

const DisplayTodos = () => {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState("grid");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTodos = async () => {
    try {
      const res = await newRequest.get("/todos/my-todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleDuplicate = async (todo) => {
    try {
      await newRequest.post(`/todos/${todo._id}/duplicate`);
      toast.success("Todo duplicated");
      fetchTodos();
    } catch (error) {
      toast.error("Failed to duplicate todo");
    }
  };

  const renderTodoCard = (todo) => (
    <Card
      key={todo._id}
      className="todo-card"
      onClick={() => handleTodoClick(todo)}
    >
      <CardContent>
        <Typography variant="h6">{todo.title}</Typography>
        <Typography className="text-muted">
          {dayjs(todo.start).format("MMM D, YYYY h:mm A")}
        </Typography>
        <Chip
          size="small"
          label={todo.priority}
          className={`chip-${todo.priority}`}
        />
        <Chip
          size="small"
          label={todo.completed ? "Completed" : "Pending"}
          className="chip-status"
        />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate(todo);
          }}
        >
          <AiOutlineCopy size={14} /> Duplicate <BsArrowRepeat size={14} />
        </Button>
      </CardActions>
    </Card>
  );

  const renderTableView = () => (
    <Table className="todo-table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Date & Time</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Completed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {todos.map((todo) => (
          <TableRow
            key={todo._id}
            onClick={() => handleTodoClick(todo)}
            className="clickable-row"
          >
            <TableCell>{todo.title}</TableCell>
            <TableCell>{dayjs(todo.start).format("MMM D, YYYY h:mm A")}</TableCell>
            <TableCell>{todo.priority}</TableCell>
            <TableCell>{todo.completed ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderBoardView = () => (
    <Grid container spacing={2}>
      {["low", "medium", "high"].map((priority) => (
        <Grid item xs={12} md={4} key={priority}>
          <Typography align="center" variant="h6" gutterBottom>
            {priority} Priority
          </Typography>
          {todos
            .filter((todo) => todo.priority === priority)
            .map((todo) => renderTodoCard(todo))}
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <>
      {todos.map((todo, index) => (
        <Accordion key={todo._id}>
          <AccordionSummary>
            <Typography>
              <strong>{todo.title}</strong> —{" "}
              {todo.completed ? "✅ Completed" : "🕓 Pending"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Start:</strong>{" "}
              {dayjs(todo.start).format("MMM D, YYYY h:mm A")}
            </Typography>
            <Typography>
              <strong>End:</strong> {dayjs(todo.end).format("MMM D, YYYY h:mm A")}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedTodo(todo);
                setShowModal(true);
              }}
            >
              View / Edit
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );

  return (
    <div className="todos-container">
      <div className="todos-header">
        <Typography variant="h5">My Todos</Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, val) => setView(val || "grid")}
        >
          <ToggleButton value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton value="table">
            <TableRows />
          </ToggleButton>
          <ToggleButton value="board">
            <ViewKanban />
          </ToggleButton>
          <ToggleButton value="list">
            <FormatListBulleted />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === "grid" && (
        <Grid container spacing={2}>
          {todos.map((todo) => (
            <Grid key={todo._id} item xs={12} sm={6} md={4} lg={3}>
              {renderTodoCard(todo)}
            </Grid>
          ))}
        </Grid>
      )}

      {view === "table" && renderTableView()}
      {view === "board" && renderBoardView()}
      {view === "list" && renderListView()}

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className="modal-box">
          {selectedTodo && (
            <TodosDetailsModal
              show={showModal}
              onHide={() => {
                setShowModal(false);
                setSelectedTodo(null);
              }}
              todo={selectedTodo}
              refreshTodos={fetchTodos}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default DisplayTodos;
*/

