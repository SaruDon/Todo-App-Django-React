import { useEffect, useState } from "react";
import TodoSearch from "./components/TodoSearch";
import TodoList from "./components/TodoList";
import axios from 'axios';
import TodoBody from "./components/TodoBody";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [updatingTodos, setUpdatingTodos] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    console.log("getting data");

    axios.get("https://todo-app-django-react-1.onrender.com/todos")
      .then(res => {
        setTodos(res.data);
        console.log("Data received from API:", res.data); // Log the data received
        toast.success('Todos loaded successfully', { position: 'top-right' });
      })
      .catch(err => {
        setErrors(err.message);
        console.error("Error fetching data:", err.message); // Log the error if it occurs
        toast.error('Failed to load todos', { position: 'top-right' });
      })
      .finally(() => setLoading(false));

    console.log("API request sent"); // Log when the request is sent
}, [setTodos]);

  // Add todo function
  const addTodo = async (data) => {
    const originalTodos = [...todos];
    console.log("data",data)
    setLoading(true);

    try {
      const res = await axios.post("https://todo-app-django-react-1.onrender.com/todos", data);
      setTodos([...todos, res.data]);
      toast.success('Todo added successfully', { position: toast.POSITION.TOP_RIGHT });
    } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos);
      toast.error('Failed to add todo', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  // Delete function
  const delTodo = async (id) => {
    const originalTodos = [...todos];

    setTodos(todos.filter(todo => todo.id !== id));

    try {
      await axios.delete(`https://todo-app-django-react-1.onrender.com/todos/${id}`);
      toast.success('Todo deleted successfully', { position: toast.POSITION.TOP_RIGHT });
    } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos);
      toast.error('Failed to delete todo', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  // Update function
  const updateTodo = async (e, id, text, todo) => {
    e.preventDefault();
    const updatedTodo = { ...todo, task: text, status: "Active" };

    setLoading(true);
    try {
      const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
      setTodos(todos.map(t => (t.id === id ? res.data : t)));
      toast.success('Todo updated successfully', { position: toast.POSITION.TOP_RIGHT });
    } catch (err) {
      toast.error('Failed to update todo', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const completeTodo = async (e, id, todo) => {
    const updatedTodo = { ...todo, completed: e.target.checked };

    if (updatingTodos.has(id)) {
      return;
    }

    setUpdatingTodos(new Set(updatingTodos).add(id));
    setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));

    try {
      const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
      setTodos(todos => todos.map(t => (t.id === id && t.completed === updatedTodo.completed ? res.data : t)));
      toast.success('Todo completed status updated', { position: toast.POSITION.TOP_RIGHT });
    } catch (err) {
      setTodos(todos.map(t => (t.id === id ? todo : t)));
      toast.error('Failed to update todo status', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setUpdatingTodos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const filterTodo = (cat_value) => {
    setTodos(todos.filter(todo => todo.status === cat_value));
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
      {errors && <p className="text-red-500">{errors}</p>}
      <>
        <TodoBody />
        <TodoSearch addTodo={addTodo} />
        <TodoList todos={todos} delTodo={delTodo} update_todo={updateTodo} complete_todo={completeTodo} filter_todo={filterTodo} />
        <ToastContainer />
      </>
    </div>
  );
}

export default App;
