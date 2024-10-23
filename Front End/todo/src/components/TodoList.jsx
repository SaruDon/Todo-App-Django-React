import React, { useState, useRef } from 'react'
import { AiFillDelete  } from 'react-icons/ai'
import { TbEdit } from 'react-icons/tb'



const TodoList = ({todos, delTodo, update_todo, complete_todo, filter_todo}) => {

  // this line references the update input field
  let taskRef = useRef(null)

  let [todoId,  setTodoId]  = useState(0)
  let [task, setTask] = useState("")
  let [toggle, setToggle] = useState(false)

  // this line helps to get the current value of the update field as the user types in.
  let [todo, setTodo] = useState({})


  // this function helps to pass the current todo to the updateform
  const todoItem = (task, id,todo) => {

    // this line helps to fill up the update input field with the current todo
      // taskRef.current.value = task

      // this line helps to get the current id of the todoitem

      setTodoId(id)
      setTask(task)
      setToggle(true)
      setTodo(todo)

      console.log(toggle)
  }


  return (

<>
  <div className="todo-list bg-white rounded-lg shadow-md p-4 w-full mx-auto max-h-96 overflow-y-auto">
    {todos.map((todo, index) => (
      <div className="todo-list-item flex items-center justify-between border-b border-silver py-2" key={index}>
        <div className="task flex items-center">
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={(e) => complete_todo(e, todo.id, todo)} 
            className="mr-2 w-5 h-5"
          />
          <p id="t_task" className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-black"}`}>
            {todo.task}
          </p>
        </div>
        <div className="btn-container flex">
          <div className="edit mr-2 cursor-pointer">
            <TbEdit size={25} onClick={() => todoItem(todo.task, todo.id, todo)} />
          </div>
          <div className="del cursor-pointer">
            <AiFillDelete size={25} onClick={() => delTodo(todo.id)} />
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Modal section */}
  {toggle && (
    <div className="modal-container fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
      <div className="modal bg-white rounded-lg p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold mb-4">Update Form</h1>
        <form onSubmit={(e) => { update_todo(e, todoId, task, todo); setToggle(false); }}>
          <input 
            type="text" 
            ref={taskRef} 
            placeholder="Update Todo" 
            value={task} 
            onChange={(e) => setTask(e.target.value)} 
            required 
            className="border border-silver h-10 px-3 w-full mb-4 rounded-lg"
          />
          <button type="submit" className="h-10 w-full bg-purple-600 text-white rounded-lg cursor-pointer transition duration-300 hover:bg-purple-700">Update</button>
        </form>
        <div className="btn-container flex justify-center mt-4">
          <button className="cancel mod-btn bg-purple-600 text-white rounded-lg py-2 px-4 mr-2" onClick={() => setToggle(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )}
</>


  )
}

export default TodoList