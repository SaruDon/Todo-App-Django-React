import { useEffect, useState } from "react";
import TodoSearch from "./components/TodoSearch";
import TodoList from "./components/TodoList";
import axios from 'axios'

import TodoBody from "./components/TodoBody";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const[errors,setErrors] = useState("")
  const [loading, setLoading] = useState(false); // Add loading state
  const [todos, setTodos] = useState([
  ]);
  const [updatingTodos, setUpdatingTodos] = useState(new Set()); // Set to track todos being updated


  useEffect(()=>{
    setLoading(true); // Set loading to true before fetching data
    console.log("gettingd data");
    axios.get("https://todo-app-django-react-1.onrender.com/todos")
    .then(res =>{
      setTodos(res.data)
    })
    .catch(err=> setErrors(err.message))
    .finally(() => setLoading(false));
    console.log("got data");
  },[setTodos]);


// add todo function
const addTodo = async (data) => {
  const originalTodos = [...todos];
  setLoading(true); // Set loading to true before making a request

  //! 1st wirte the data to database and then make local changes to unsure consistency

  try {
      const res = await axios.post("https://todo-app-django-react-1.onrender.com/todos", data);
      setTodos([...todos, res.data]);
  } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos); // If the add function fails, replace with the previous list of todos
  } finally {
      setLoading(false); 
  }
};



  // delete function
  const delTodo = async (id) => {
    const originalTodos = [...todos]; 


    //! Here locallly update state 1st as we might delete more task a once

    setTodos(todos.filter(todo => todo.id !== id));

    try {
        await axios.delete(`https://todo-app-django-react-1.onrender.com/todos/${id}`);
        console.log("Todo deleted successfully");
    } catch (err) {
        console.error("Error deleting todo:", err);
        setErrors(err.message); 
        setTodos(originalTodos);
    } 
};



  // update function
  const updateTodo = async (e, id, text, todo) => {
    e.preventDefault();

    const updatedTodo = { ...todo, task: text, status: "Active" };

    setLoading(true); 
    //! Update in database 1t them in state
    try {
        // Send the updated todo to the backend using a PATCH request
        const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
        console.log("Update successful:", res.data);
        
        setTodos(todos.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
        console.error("Error updating todo:", err);
    } finally {
        setLoading(false); // Set loading to false after the request
    }
};



const completeTodo = async (e, id, todo) => {
  const updatedTodo = { ...todo, completed: e.target.checked };

  // Avoid updates while the current todo is already being updated
  if (updatingTodos.has(id)) {
    return; // If the todo is already being updated, we skip it
  }

  // Add the todo to the set of updating items
  setUpdatingTodos(new Set(updatingTodos).add(id));

  // Optimistically update the local state
  setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));

  try {
    const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
    
    // Ensure the state didn't change while the request was pending
    setTodos(todos => 
      todos.map(t => (t.id === id && t.completed === updatedTodo.completed ? res.data : t))
    );
  } catch (err) {
    console.error("Error updating todo:", err);

    // Optionally revert the local state if the update fails
    setTodos(todos.map(t => (t.id === id ? todo : t)));
  } finally {
    // Remove the todo from the updating set
    setUpdatingTodos(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }
};

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
  }


  return (
    <div className="w-full mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
      {errors && <p className="text-red-500">{errors}</p>}
        <>

          <TodoBody />
          <TodoSearch addTodo={addTodo} />
          <TodoList todos={todos} delTodo={delTodo} update_todo={updateTodo} complete_todo={completeTodo} filter_todo={filterTodo} />
        
          </>
 
    </div>
  );
}



export default App;