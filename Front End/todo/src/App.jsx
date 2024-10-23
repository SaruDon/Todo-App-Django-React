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
  const addTodo = (data) => {
    // Making a POST request to add the todo
    const originalTodos = [...todos]
    setLoading(true); // Set loading to true before making a request
    axios.post("https://todo-app-django-react-1.onrender.com/todos", data)
    .then(res => {
        // Append the newly created todo (from response) to the state
        setTodos([...todos, res.data]);
    })
    .catch(err => {
        setErros(err.message);
        setTodos[originalTodos]; // the the add function fails then just replace it with previous list of todos
    })
    .finally(() => setLoading(false)); // Set loading to false after request;
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
  const updateTodo = (e, id, text, todo) => {
    e.preventDefault();

    // Create the updated todo object with the new text
    const updatedTodo = { ...todo, task: text, status: "Active" };

    // Update the state with the new todo
    setTodos(todos.map(t => t.id === id ? updatedTodo : t));

    // Send the updated todo to the backend using a PATCH request
    setLoading(true);
    axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      })
      .finally(() => setLoading(false));;
};


  const completeTodo = (e, id, todo) => {

    if(e.target.checked){
      console.log("okay")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:true}: todo))

      const updatedTodo ={...todo,completed:true}
      setLoading(true);
      axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      })
      .finally(() => setLoading(false)); // Set loading to false after request;
    }
    else
    {
      console.log("omo")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, status:false}: todo))
      const updatedTodo ={...todo,completed:false}
      setLoading(true); // Set loading to true before making a request
      axios.patch(`https://todo-app-django-react-1.onrender.com/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      })
      .finally(() => setLoading(false));
    }

   
  }

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