import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoTasklist } from "react-icons/go";
import { useStateContext } from "../contexts/ContextProvider";

const ProjectSidebar = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showProjectList, setShowProjectList] = useState(false);
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const dropdownRef = useRef(null);

  if (activeMenu !== undefined && screenSize <= 900) {
    setActiveMenu(false);
  }

  const email = localStorage.getItem("email");

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/projects-data/fetch-project-list",
        {
          email: email,
        }
      );

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [email]);

  const toggleProjectList = () => {
    setShowProjectList((prevShow) => !prevShow);
    fetchProjects();
  };

  const handleProjectClick = (projectId) => {
    navigate(`/create-task/${projectId}`);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowProjectList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col text-[#1a1919]">
      <div className="flex flex-col items-end p-2 py-0 ">
        <div className="relative" ref={dropdownRef}>
          {/* <button
            className={`flex items-center ${activeMenu ? "justify-center" : "justify-end hover:bg-[#495057] p-4 rounded-full"}`}
            onClick={toggleProjectList}
          >
            <GoTasklist className={`${activeMenu ? "text-base" : "text-2xl ml-0"}`} />
            {activeMenu && <span className={`ml-2`}>{activeMenu ? "Task" : ""}</span>}
          </button> */}

          {/* Project List Dropdown */}
          {showProjectList && (
            <div
              className="absolute top-0 left-full ml-2 bg-blue-100 text-gray-700 rounded shadow-md shadow-gray-600 w-56 max-h-64 overflow-y-auto z-10"
            >
              <ul className="divide-y divide-blue-200">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project.id}
                      className="px-4 py-2 cursor-pointer hover:text-blue-100 hover:bg-blue-600 transition duration-300"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {project.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400">No projects available</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
