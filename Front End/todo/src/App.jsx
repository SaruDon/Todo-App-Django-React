import { useEffect, useState } from "react";
import TodoSearch from "./components/TodoSearch";
import TodoList from "./components/TodoList";
import axios from 'axios'
import TodoFilter from "./components/TodoFilter";
import TodoBody from "./components/TodoBody";

function App() {
  const[erros,setErros] = useState("")



  const [todos, setTodos] = useState([
  ]);

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/todos")
    .then(res =>{
      setTodos(res.data)
    })
    .catch(err=> setErros(err.message))
  },[setTodos]);


// add todo function
  const addTodo = (data) => {
    // Making a POST request to add the todo
    const originalTodos = [...todos]
    axios.post("http://127.0.0.1:8000/todos", data)
    .then(res => {
        // Append the newly created todo (from response) to the state
        setTodos([...todos, res.data]);
    })
    .catch(err => {
        setErros(err.message);
        setTodos[originalTodos]; // the the add function fails then just replace it with previous list of todos
    });
  };


  // delete function
  const delTodo = (id) => {
    setTodos(todos.filter( todo => todo.id != id ))
    const originalTodos = [...todos]
    axios.delete("http://127.0.0.1:8000/todos/" + id)
    .catch(err=>setErros(err.message))
  }


  // update function
  const updateTodo = (e, id, text, todo) => {
    e.preventDefault();

    // Create the updated todo object with the new text
    const updatedTodo = { ...todo, task: text, status: "Active" };

    // Update the state with the new todo
    setTodos(todos.map(t => t.id === id ? updatedTodo : t));

    // Send the updated todo to the backend using a PATCH request
    axios.patch(`http://127.0.0.1:8000/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      });
};


  const completeTodo = (e, id, todo) => {

    if(e.target.checked){
      console.log("okay")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:true}: todo))

      const updatedTodo ={...todo,completed:true}
      axios.patch(`http://127.0.0.1:8000/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      });
    }
    else
    {
      console.log("omo")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, status:false}: todo))
      const updatedTodo ={...todo,completed:false}
      axios.patch(`http://127.0.0.1:8000/todos/${id}`, updatedTodo)
      .then((res) => {
        console.log("Update successful:", res.data);
        // Optionally update the state with the response (if it has additional fields like a new timestamp)
        setTodos(todos.map(t => t.id === id ? res.data : t));
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
      });
    }

   
  }

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
  }


  return (
    <div className="w-full mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
      {erros && <p>{erros}</p>}
      <TodoBody/>
      <TodoSearch addTodo = { addTodo } />
      <TodoList todos = { todos } delTodo = { delTodo } update_todo = { updateTodo } complete_todo = { completeTodo } filter_todo = { filterTodo } />
    </div>
  );
}



export default App;