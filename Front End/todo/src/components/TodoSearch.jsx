import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodoSearch = ({ addTodo }) => {
  const [task, setTask] = useState("");

  const notify = () => {
    toast.success("Wow so easy!", {
      position: toast.POSITION.TOP_RIGHT, // You can customize the position
      autoClose: 3000, // Time before auto-close in milliseconds (3000ms = 3 seconds)
      hideProgressBar: false, // Show/hide progress bar
      closeOnClick: true, // Close the toast when clicked
      pauseOnHover: true, // Pause the timer on hover
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    notify();
    if (task.trim()) {
      addTodo({ task }); // Call the addTodo function passed as a prop
      setTask(""); // Clear the input field after submission
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-5 my-5 shadow-lg">
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input
        type="text"
        id="task"
        placeholder="Enter Todo"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border border-silver h-12 px-3 w-full rounded-lg outline-none transition-colors duration-300 focus:border-purple-500"
      />
      <button
        type="submit"
        className="h-12 w-full mt-3 bg-purple-600 text-white rounded-lg cursor-pointer transition-colors duration-300 hover:bg-purple-700"
      >
        Add
      </button>
    </form>
  </div>
  );
};

export default TodoSearch;
