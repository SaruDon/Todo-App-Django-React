import { useEffect, useState } from "react";
import TodoSearch from "./components/TodoSearch";
import TodoList from "./components/TodoList";
import axios from 'axios'
import TodoFilter from "./components/TodoFilter";
import TodoBody from "./components/TodoBody";

function App() {
  const[erros,setErros] = useState("")
  const [loading, setLoading] = useState(false); // Add loading state
  const [todos, setTodos] = useState([
  ]);

  useEffect(()=>{
    setLoading(true); // Set loading to true before fetching data
    axios.get("https://todo-app-django-react-1.onrender.com/todos")
    .then(res =>{
      setTodos(res.data)
    })
    .catch(err=> setErros(err.message))
    .finally(() => setLoading(false));
  },[setTodos]);


// add todo function
const addTodo = async (data) => {
  const originalTodos = [...todos];
  setLoading(true); // Set loading to true before making a request

  try {
      const res = await axios.post("https://todo-app-django-react-1.onrender.com/todos", data);
      // Append the newly created todo (from response) to the state
      setTodos([...todos, res.data]);
  } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos); // If the add function fails, replace with the previous list of todos
  } finally {
      setLoading(false); // Set loading to false after request
  }
};



  // delete function
  const delTodo = (id) => {
    setTodos(todos.filter( todo => todo.id != id ))
    const originalTodos = [...todos]
    setLoading(true); // Set loading to true before making a request
    axios.delete("https://todo-app-django-react-1.onrender.com/todos/" + id)
    .catch(err=>setErros(err.message))
    .finally(() => setLoading(false));
  }


  // update function
  const updateTodo = async (e, id, text, todo) => {
    e.preventDefault();

    // Create the updated todo object with the new text
    const updatedTodo = { ...todo, task: text, status: "Active" };

    // Optimistically update the state with the new todo
    setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));

    // Send the updated todo to the backend using a PATCH request
    setLoading(true);
    
    try {
        const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
        console.error("Error updating todo:", err);
        // Optionally revert the state to the original todo if the update fails
        setTodos(todos.map(t => (t.id === id ? todo : t)));
    } finally {
        setLoading(false); // Set loading to false after the request
    }
};



const completeTodo = async (e, id, todo) => {
  const updatedTodo = { ...todo, completed: e.target.checked }; // Prepare the updated todo object
  setLoading(true); // Set loading to true before making a request

  // Update local state optimistically
  setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));

  try {
      const res = await axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo);
      console.log("Update successful:", res.data);
      // Optionally update the state with the response (if it has additional fields like a new timestamp)
      setTodos(todos.map(t => (t.id === id ? res.data : t)));
  } catch (err) {
      console.error("Error updating todo:", err);
      // Optionally revert the local state if the update fails
      setTodos(todos.map(t => (t.id === id ? todo : t)));
  } finally {
      setLoading(false); // Set loading to false after request
  }
};

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
  }


  return (
    <div className="w-full mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
      {erros && <p className="text-red-500">{erros}</p>}
        <>
          <TodoBody />
          <TodoSearch addTodo={addTodo} />
          <TodoList todos={todos} delTodo={delTodo} update_todo={updateTodo} complete_todo={completeTodo} filter_todo={filterTodo} />
        </>
    </div>
  );
}



export default App;