import React, { useState, useEffect } from "react";
import { notask } from "../assets/index";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom"; 
const CreateTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: "",
    assignTo: "",
    taskDescription: "",
    taskPriority: "Low",
    taskDate: "",
  });
  const trialStatus = localStorage.getItem("daysLeftStatus");
  const navigate = useNavigate();

  //const [isEditable, setIsEditable] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 font-bold";
      case "Medium":
        return "text-yellow-500 font-bold";
      case "Low":
      default:
        return "text-green-500 font-bold";
    }
  };
  const { id } = useParams(); // Extract the projectId from the URL

  const email = localStorage.getItem("email");
  const addTask = () => {
    if (newTask.taskName && newTask.assignTo) {
      // Prepare the data to send in the API request
      const taskData = {
        task_name: newTask.taskName,
        assign_to: newTask.assignTo,
        description: newTask.taskDescription || "",
        priority: newTask.taskPriority || "Medium",
        date: newTask.taskDate || new Date(),
        project_id: id, // Use the projectId from the URL
        owner_email: email,
      };

      // Call the API to create the task
      fetch("https://api.confidanto.com/task-backend/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.task_id) {
            // On successful creation, add the task to the local state
            const taskWithId = {
              ...newTask,
              id: data.task_id,
              isEditing: false,
            };
            setTasks((prevTasks) => [...prevTasks, taskWithId]);
            fetchTasks();
            resetForm();
            setIsAddingTask(false);
          } else {
            console.error("Failed to create task:", data.error);
            // Handle error (e.g., show an error message)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error (e.g., show an error message)
        });
    }
  };

  const resetForm = () => {
    setNewTask({
      taskName: "",
      assignTo: "",
      taskDescription: "",
      taskPriority: "Low",
      taskDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const [error, setError] = useState(null);
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://api.confidanto.com/task-backend/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ project_id: id, email: email }), // Send project_id in the request body
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data); // Update state with fetched tasks
    } catch (err) {
      setError(err.message); // Set error if any
    } finally {
      //setLoading(false); // Set loading to false when done
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const handleDeleteTask = (taskId) => {
    fetch(`https://api.confidanto.com/task-backend/delete-task`, {
      method: "DELETE", // Use DELETE method
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify({ task_id: taskId }), // Send task_id in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Task deleted successfully") {
          alert("Task  deleted successfully...");
          fetchTasks();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error (e.g., show an error message)
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Return an empty string or a default value if the dateString is invalid
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return ""; // Return an empty string or a default value if the date is invalid
    }

    // Extract year, month, and day, and format them as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleEditChange = (e, taskId) => {
    const { name, value } = e.target;
    //task.isEditing = true
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, [name]: value } : task
      )
    );
  };

  const handleSaveEdit = (taskId) => {
    const updatedTask = tasks.find((task) => task.task_id === taskId);

    if (updatedTask.date) {
      const dateObj = new Date(updatedTask.date);
      const formattedDate = dateObj.toISOString().split("T")[0]; // Extract the date part (YYYY-MM-DD)
      updatedTask.date = formattedDate;
    }

    fetch(`https://api.confidanto.com/task-backend/update-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Task updated successfully...");
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.task_id === taskId ? { ...task, isEditing: false } : task
            )
          );
          fetchTasks();
        } else {
          console.error("Failed to update task:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="relative">
      <div
        className={
          trialStatus === "Your trial has ended"
            ? "blur-sm pointer-events-none h-screen overflow-hidden"
            : ""
        }
      >
        <Link to="/projects">
              <IoIosArrowBack className="space-x-2 h-8 w-8  shadow-lg hover:bg-slate-200  rounded-lg mb-4 ml-2" />
        </Link>
        <div className="relative p-4 max-w-full w-full mx-auto">
          {/* Create Task Button */}
          <div className="flex justify-end mb-4">
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => setIsAddingTask(true)}
            >
              Add Task
            </button>
          </div>
          
            
          
          {/* Task List */}
          <div>
            <h2 className="text-xl font-bold mb-2">Tasks</h2>

            {tasks.length === 0 && !isAddingTask ? (
              <div className="flex flex-col items-center justify-center mt-10">
                <img
                  src={notask} // Replace this with your own image URL
                  alt="No tasks"
                  className="mb-4 h-64 w-64"
                />
                <p className="text-gray-500 text-lg">
                  You haven’t created any tasks for this project yet.
                </p>
              </div>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Task Name</th>
                    <th className="border px-4 py-2">Assign To</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Priority</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isAddingTask && (
                    <tr>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="taskName"
                          value={newTask.taskName}
                          onChange={handleInputChange}
                          className="w-full p-1 border rounded"
                          placeholder="Task Name"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="assignTo"
                          value={newTask.assignTo}
                          onChange={handleInputChange}
                          className="w-full p-1 border rounded"
                          placeholder="Assign To"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="taskDescription"
                          value={newTask.taskDescription}
                          onChange={handleInputChange}
                          className="w-full p-1 border rounded"
                          placeholder="Description"
                        />
                      </td>
                      <td className={`border px-4 py-2`}>
                        <select
                          name="taskPriority"
                          value={newTask.taskPriority}
                          onChange={handleInputChange}
                          className="w-full p-1 border rounded"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="date"
                          name="taskDate"
                          value={newTask.taskDate} // Bind to state
                          onChange={handleInputChange} // Handle changes
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="p-2 bg-green-500 text-white rounded mr-2"
                          onClick={addTask}
                        >
                          Save
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded"
                          onClick={() => {
                            resetForm();
                            setIsAddingTask(false);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                  {tasks.map((task) => (
                    <tr key={task.task_id}>
                      <td className="border px-4 py-2">
                        {task.isEditing ? (
                          <input
                            type="text"
                            name="task_name"
                            value={task.task_name}
                            onChange={(e) => handleEditChange(e, task.task_id)}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          task.task_name
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {task.isEditing ? (
                          <input
                            type="text"
                            name="assign_to"
                            value={task.assign_to}
                            onChange={(e) => handleEditChange(e, task.task_id)}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          task.assign_to
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {task.isEditing ? (
                          <input
                            type="text"
                            name="description"
                            value={task.description}
                            onChange={(e) => handleEditChange(e, task.task_id)}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          task.description
                        )}
                      </td>
                      <td
                        className={`border px-4 py-2 ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.isEditing ? (
                          <select
                            name="priority"
                            value={task.priority}
                            onChange={(e) => handleEditChange(e, task.task_id)}
                            className="w-full p-1 border rounded"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        ) : (
                          task.priority
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {task.isEditing ? (
                          <input
                            type="date"
                            name="date"
                            value={formatDate(task.date)}
                            onChange={(e) => handleEditChange(e, task.task_id)}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          formatDate(task.date)
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {task.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(task.task_id)}
                              className="p-1 bg-green-500 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() =>
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) =>
                                    t.task_id === task.task_id
                                      ? { ...t, isEditing: false }
                                      : t
                                  )
                                )
                              }
                              className="p-1 bg-red-500 text-white rounded ml-2"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setTasks((prevTasks) =>
                                  prevTasks.map((t) =>
                                    t.task_id === task.task_id
                                      ? { ...t, isEditing: true }
                                      : t
                                  )
                                )
                              }
                              className="p-1 bg-yellow-500 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.task_id)}
                              className="p-1 bg-red-500 text-white rounded ml-2"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {trialStatus === "Your trial has ended" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-xl p-4 pb-0 fomt font-semibold text-white ">
              You Free Trial has been ended.
            </h1>
            <h1 className="text-lg p-4 text-white">
              Select your plan to continue to access your workspace.
            </h1>
            <button
              className="px-4 py-2 text-white bg-blue-600 hover:shadow-lg"
              onClick={() => navigate("/billing-support")}
            >
              Select Your Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTaskPage;
