// src/utils/todoApi.js
import newRequest from './newRequest';

// 1. Get all todos (optional filter query param)
export const getTodos = async (filter = '') => {
  const res = await newRequest.get(`/todos?filter=${filter}`);
  return res.data;
};

// 2. Get todos by specific date (e.g. 2025-07-23)
export const getTodosByDate = async (date) => {
  const res = await newRequest.get(`/todos/by-date/${date}`);
  return res.data;
};


// 3. Get todos for the next 7 days
export const getNext7DaysTodos = async () => {
  const res = await newRequest.get(`/todos/next-7-days`);
  return res.data;
};

// 4. Add a new todo
export const addTodo = async (todoData) => {
  const res = await newRequest.post(`/todos`, todoData);
  return res.data;
};

// 5. Update an existing todo
export const updateTodo = async (id, updatedTodo) => {
  const res = await newRequest.put(`/todos/${id}`, updatedTodo);
  return res.data;
};

// 6. Delete a todo
export const deleteTodo = async (id) => {
  const res = await newRequest.delete(`/todos/${id}`);
  return res.data;
};

// 7. Duplicate (clone) a todo
export const duplicateTodo = async (id) => {
  const res = await newRequest.post(`/todos/${id}/duplicate`);
  return res.data;
};

// 8. Fetch todos using filters (e.g. project, priority, status)
export const fetchTodosByFilter = async (filters) => {
  const res = await newRequest.post(`/todos/filter`, filters);
  return res.data;
};









// import newRequest from './newRequest';
/*
export const getTodos = async (filter = '') => {
  const res = await newRequest.get(`/todos?filter=${filter}`);
  return res.data;
};
*/

export const getAllTodos = async () => {
  const res = await newRequest.get('/todos');
  return res.data;
};

export const getTodosByDateRange = async (start, end) => {
  const res = await newRequest.get(`/todos/date-range?start=${start}&end=${end}`);
  return res.data;
};

export const getMarkedTodos = async () => {
  const res = await newRequest.get(`/todos/marked`);
  return res.data;
};




