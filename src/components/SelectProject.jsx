import React, { useState, useEffect } from "react";
import axios from "axios";

const SelectProject = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const email = localStorage.getItem("email");

  const fetchProjects = async () => {
    let customerIdsArr = null;
    try {
      customerIdsArr = await axios.post(
        "https://api.confidanto.com/connect-google-ads/get-customer-project-id",
        { email }
      );
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.post(
        "https://api.confidanto.com/projects-data/fetch-project-list",
        { email }
      );

      const updatedProjects = response.data.map((project) => {
        let customerId = "Not Connected";
        if (customerIdsArr) {
          let customerIdObj = customerIdsArr.data.find(
            (e) => e.project_id === project.id
          );
          if (customerIdObj) {
            customerId = customerIdObj.customer_id;
          }
        }
        return { ...project, customerId };
      });
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [email]);

  const handleProjectClick = (project) => {
    setSelectedProject(project.id);
    onSelectProject(project.id);
    localStorage.setItem("project_id", project.id);
    localStorage.setItem("customer_id", project.customerId);
    localStorage.setItem("project_name", project.name);
  
    // Open a new tab with a relevant URL (change '/dashboard' to the desired route)
    const newTab = window.open(`/project-details/${project.id}`, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  };
  

  return (
    <div className="w-full h-60 overflow-auto  flex justify-center items-center pt-4">
      <div className="w-full rounded overflow-y-auto h-fit bg-white">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-3 border-b last:border-b-0 cursor-pointer ${
              selectedProject === project.id ? "bg-gray-200" : ""
            }`}
            onClick={() => handleProjectClick(project)}
          >
            <p className="font-semibold text-gray-900">{project.name}</p>
            <p className="text-sm text-gray-500">{project.customerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectProject;
