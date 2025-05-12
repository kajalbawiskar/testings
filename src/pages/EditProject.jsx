import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const EditProject = () => {
  const { id: projectId } = useParams(); // <- Fix: extract `id` and alias it to `projectId`
  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState({
    name: "",
    category: "",
  });
  const [project, setProject] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://api.confidanto.com/projects/${projectId}`
        );
        setProject(response.data);
        setProjectDetails({
          name: response.data.name,
          category: response.data.category,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEditProject = async (event) => {
    event.preventDefault();
  
    const updatedProject = {
      email: localStorage.getItem("email"), // ← required!
      name: projectDetails.name,
      category: projectDetails.category,
    };
  
    try {
      const response = await fetch(`https://api.confidanto.com/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      await response.json();
      navigate("/projects");
    } catch (error) {
      console.error("Error updating project:", error.message);
    }
  };
  
  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setProjectDetails({
      ...projectDetails,
      name: e.target.value,
    });
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="relative bg-white rounded-lg shadow-lg p-6 m-4 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/projects")}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <h2 className="text-3xl font-semibold mb-6 text-gray-700 text-center">
          Edit Project
        </h2>

        <form onSubmit={handleEditProject}>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-gray-600">
              Name
            </label>
            {!isEditingName ? (
              <p
                className="w-full p-3 border rounded border-gray-300 cursor-pointer"
                onClick={handleNameClick}
              >
                {projectDetails.name}
              </p>
            ) : (
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectDetails.name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                required
              />
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block mb-2 text-gray-600">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectDetails.category}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  category: e.target.value,
                })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Animals & Pets">Animals & Pets</option>
              <option value="Advocacy">Advocacy</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-blue-500 to-green-500 py-4 px-6 font-semibold text-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
