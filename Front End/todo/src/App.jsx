import { useEffect, useState } from "react";
import TodoSearch from "./components/TodoSearch";
import TodoList from "./components/TodoList";
import axios from 'axios';
import TodoBody from "./components/TodoBody";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [updatingTodos, setUpdatingTodos] = useState(new Set());
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get("https://todo-app-django-react-1.onrender.com/todos")
      .then(res => {
        setTodos(res.data);
        setFilteredTodos(res.data); // Set filtered todos initially
        toast.success('Todos loaded successfully', { position: 'top-right' });
      })
      .catch(err => {
        setErrors(err.message);
        toast.error('Failed to load todos', { position: 'top-right' });
      })
      .finally(() => setLoading(false));
  }, []);

  // Add todo function
  const addTodo = async (data) => {
    const originalTodos = [...todos];
    const newTodo = { ...data, status: 'Active' };

    // Optimistically update the UI
    setTodos([...todos, newTodo]);
    setFilteredTodos([...filteredTodos, newTodo]);

    setLoading(true);
    try {
      const res = await axios.post("https://todo-app-django-react-1.onrender.com/todos", data);
      console.log(res); 
      toast.success('Todo added successfully', { position: 'top-right' });
    } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos);  // Revert to original todos array
      toast.error('Failed to add todo', { position: 'top-right' });
    } finally {
      setLoading(false);
    }    
  };

  // Delete function
  const delTodo = async (id) => {
    const originalTodos = [...todos];  // Backup original todos
    const originalFilteredTodos = [...filteredTodos];  // Backup original filtered todos
    
    // Optimistically remove the todo from both lists
    setTodos(todos.filter(todo => todo.id !== id));
    setFilteredTodos(filteredTodos.filter(todo => todo.id !== id));
  
    try {
      await axios.delete(`https://todo-app-django-react-1.onrender.com/todos/${id}`);
      toast.success('Todo deleted successfully', { position: 'top-right' });
    } catch (err) {
      // If delete fails, revert to the original state
      setTodos(originalTodos);
      setFilteredTodos(originalFilteredTodos);
      setErrors(err.message);
      toast.error('slow serve, please refresh and Try again ', { position: 'top-right' });
    }
  };
  

  // Update function
  const updateTodo = async (e, id, text, todo) => {
    e.preventDefault();
    
    const updatedTodo = { ...todo, task: text, status: "Active" };
    const originalTodos = [...todos];  // Backup original todos
    const originalFilteredTodos = [...filteredTodos];  // Backup original filteredTodos
    
    // Optimistically update the state before the API call
    setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
    setFilteredTodos(filteredTodos.map(t => (t.id === id ? updatedTodo : t)));
    
    setLoading(true);
    try {
      const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
      console.log(res);
      toast.success('Todo updated successfully', { position: 'top-right' });
    } catch (err) {
      // Revert back to the original state on failure
      setTodos(originalTodos);
      setFilteredTodos(originalFilteredTodos);
      toast.error('Failed to update todo', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };
  

  // Complete Todo
  const completeTodo = async (e, id, todo) => {
    const updatedTodo = { ...todo, completed: e.target.checked };
    if (updatingTodos.has(id)) return;

    setUpdatingTodos(new Set(updatingTodos).add(id));
    setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
    setFilteredTodos(filteredTodos.map(t => (t.id === id ? updatedTodo : t)));

    try {
      const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
      setTodos(todos => todos.map(t => (t.id === id && t.completed === updatedTodo.completed ? res.data : t)));
      toast.success('Todo completed status updated', { position: 'top-right' });
    } catch (err) {
      setTodos(todos.map(t => (t.id === id ? todo : t)));
      toast.error('Failed to update todo status', { position: 'top-right' });
    }
  };

  const filterTodo = (cat_value) => {
    setFilteredTodos(todos.filter(todo => todo.status === cat_value));
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
      <>
        <TodoBody />
        <TodoSearch addTodo={addTodo} />
        <TodoList 
          todos={filteredTodos} 
          delTodo={delTodo} 
          update_todo={updateTodo} 
          complete_todo={completeTodo} 
          filter_todo={filterTodo} 
        />
        <ToastContainer />
      </>
    </div>
  );
}

export default App;
