/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
} from "@mui/material";
import { People, Settings } from "@mui/icons-material";

import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraIcon from "@mui/icons-material/Camera";
import { googleads } from "../assets/index";
import emptyImage from "../assets/empty.png";

const ProjectList = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isGoogleAdsConnected, setIsGoogleAdsConnected] = useState(false);
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const navigate = useNavigate();

  const [fetchedProjectName, setFetchedProjectName] = useState("");
  const [uniqueUserId, setUniqueUserId] = useState("");
  const [username, setUsername] = useState("");
  const [people, setPeople] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(async () => {
    const fetchProjects = async () => {
      try {
        // get customer id's
        let customerIdsArr = null;
        try {
          customerIdsArr = await axios.post(
            "https://api.confidanto.com/connect-google-ads/get-customer-project-id",
            { email: email }
          );
        } catch (e) {
        }
        let customerId = "Not Connected";
        const response = await axios.post(
          "https://api.confidanto.com/projects-data/fetch-project-list",
          {
            email: email,
          }
        );
        const storedTimestamps =
          JSON.parse(localStorage.getItem("lastAccessedTimestamps")) || {};

        const updatedProjects = response.data.map((project) => {
          let iconBase64 = null;

          if (project.icon && project.icon.data) {
            // Convert Buffer to Base64
            iconBase64 = `data:image/png;base64,${btoa(
              String.fromCharCode(...new Uint8Array(project.icon.data))
            )}`;
          }

          // Customer Ids
          if (customerIdsArr) {
            let customerIdObj = customerIdsArr.data.filter((e) => {
              return e.project_id == project.id;
            });

            if (customerIdObj.length > 0) {
              customerId = customerIdObj[0].customer_id;
            } else {
              customerId = "Not Connected";
            }
          }

          return {
            ...project,
            lastAccessed: storedTimestamps[project.id] || project.lastAccessed,
            icon: iconBase64,
            customerId: customerId,
          };
        });
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    await fetchProjects();
    await removeCustomerIdOnPageStart();
  }, [email]);
  const updateLastAccessed = async (projectId) => {
    const currentTimestamp = new Date().toISOString();
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, lastAccessed: currentTimestamp }
          : project
      )
    );
    const storedTimestamps =
      JSON.parse(localStorage.getItem("lastAccessedTimestamps")) || {};
    storedTimestamps[projectId] = currentTimestamp;
    localStorage.setItem(
      "lastAccessedTimestamps",
      JSON.stringify(storedTimestamps)
    );

    try {
      await axios.put(`https://api.confidanto.com/projects/${projectId}`, {
        lastAccessed: currentTimestamp,
      });
    } catch (error) {
      console.error("Error updating last accessed timestamp:", error);
    }
  };

  const handleMenuOpen = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleEditProject = () => {
    navigate(`/edit-project/${selectedProject}`);
    handleMenuClose();
  };

  const handleDeleteProject = async () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    try {
      await axios.delete(
        `https://api.confidanto.com/projects-data/delete-project`,
        {
          data: {
            id: selectedProject,
            email: email,
          },
        }
      );

      try {
        await axios.delete(
          "https://api.confidanto.com/connect-google-ads/revoke-connected-account",
          {
            data: {
              email: email,
              project_id: selectedProject,
            },
          }
        );
      } catch (e) {
        //console.log(e);
      }

      setProjects(projects.filter((project) => project.id !== selectedProject));
      handleMenuClose();
      setDeleteDialogOpen(false); // Close confirmation dialog
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleFileUpload = async (event, projectId) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("icon", file);
      try {
        await axios.put(
          `https://api.confidanto.com/projects/${projectId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedProjects = projects.map((project) =>
          project.id === projectId
            ? { ...project, icon: URL.createObjectURL(file) }
            : project
        );
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleNewProjectClick = () => {
    navigate("/create-project");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Accessed Yet";

    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) return "Invalid Date";

    // Check for today or yesterday
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today) {
      // If it was today, return the time instead of just "Today"
      return `Today at ${date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const handleProjectTitleClick = async (
    projectId,
    customer_id,
    project_name
  ) => {
    await updateLastAccessed(projectId);
    localStorage.setItem("project_id", projectId);
    localStorage.setItem("customer_id", customer_id);
    localStorage.setItem("project_name", project_name);
    //console.log("set customer id:", customer_id);

    // Api call to hide Paid Ads
    window.dispatchEvent(
      new CustomEvent("localStorageChange", { detail: { key: "customer_id" } })
    );

    navigate(`/project-details/${projectId}`);
  };
  const removeCustomerIdOnPageStart = () => {
    // localStorage.removeItem("project_id");
    // localStorage.removeItem("project_name");
    localStorage.removeItem("customer_id");

    // Api call to hide Paid Ads
    window.dispatchEvent(
      new CustomEvent("localStorageChange", { detail: { key: "customer_id" } })
    );
  };

  const handleAddPeopleClick = (projectId) => {
    setCurrentProjectId(projectId);
    setEmailDialogOpen(true);
    const requestBody = {
      email: email,
      projectId: projectId,
    };
    fetch("https://api.confidanto.com/fetch-user-project-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const { user, project } = data;
        setFetchedProjectName(project?.name || "");
        setUniqueUserId(user?.unique_user_id || "");
        setUsername(user?.username || "");
        return fetch(
          "https://api.confidanto.com/send-invitation-email/fetch-invited-users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
      })
      .then((response) => {
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response
        return response.json();
      })
      .then((invitedUsersData) => {
        // If data is there, set the fetched invited users data to the people array
        if (invitedUsersData && Array.isArray(invitedUsersData)) {
          setPeople(invitedUsersData);
        } else {
          ////console.log("No invited users data available");
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const handleCreateTask = async (projectId) => {
    await updateLastAccessed(projectId); // Update the timestamp
    navigate(`/create-task/${projectId}`);
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
    setEmailInput("");
    setCurrentProjectId(null);
    setPeople([]);
  };
  useEffect(async () => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://api.confidanto.com/projects/${projectId}`
        );
        setProject(response.data);
        setIsGoogleAdsConnected(response.data.isGoogleAdsConnected);
        // setIsBingAdsConnected(response.data.isBingAdsConnected);

        //console.log(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    await fetchProject();
    await removeCustomerIdOnPageStart();
  }, [projectId]);

  const handleEmailSubmit = () => {
    if (currentProjectId && emailInput) {
      const requestBody = {
        inviteFrom: email,
        email: emailInput,
        userId: uniqueUserId,
        accountName: username,
        projectName: fetchedProjectName,
        projectId: currentProjectId,
      };
      fetch("https://api.confidanto.com/send-invitation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          alert("Invitation email sent successfully...!", data);
        })
        .catch((error) => {
          console.error("Error sending invitation email:", error.message);
        });
    }
    handleEmailDialogClose();
  };

  const handleRevokeAccess = (person) => {
    if (currentProjectId) {
      const requestBody = {
        projectId: currentProjectId,
        email: person.email,
        ownerEmail: email,
      };
      fetch(
        "https://api.confidanto.com/send-invitation-email/revoke-project-invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          if (
            data.message === "Invitation revoked and user removed successfully"
          ) {
            setPeople(people.filter((p) => p.email !== person.email));
            alert(`Access to this project revoked for ${person.email}`);
          }
        })
        .catch((error) => {
          console.error("Error in revoking access:", error.message);
        });
    }
  };
  const handleGoogleAdsIconClick = async (projectId) => {
    navigate(`/Googledetails/${projectId}`, { state: { step: 2 } });
  };

  return (
    <div className="flex justify-center bg-gray-100 p-8 mb-4 min-h-screen font-sans">
      <div className="w-full max-w-screen-xl ">
        <div className="flex justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-500">Project List</h1>
          </div>
          <div className="flex items-center space-x-5">
            <button
              onClick={handleNewProjectClick}
              className="bg-[#4142dc] px-4 py-2 text-base text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#4142dc] "
            >
              {projects.length === 0 ? "Create Project" : "Add Project"}
            </button>
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-fit">
            <img
              src={emptyImage}
              alt="No projects available"
              className="w-1/3 h-1/3"
            />
            <p className="text-gray-600 mt-0 text-center mr-20">
              No projects available.
            </p>
          </div>
        ) : (
          <div
            className={
              isGridView
                ? "grid grid-cols-1 xs:grid-cols-4 sm:grid-cols-2 mb-6  lg:grid-cols-2 xl:grid-cols-3  gap-6"
                : "flex flex-col space-y-6 mb-6"
            }
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg p-10 transition-transform transform  duration-500 hover:shadow-lg relative "
              >
                <div className="flex flex-col items-center mb-4 space-y-4">
                  <div className="absolute top-0 left-0 ml-4 mt-6 ml flex space-x-4 flex-row">
                    <Tooltip
                      title={
                        project.customerId &&
                        project.customerId !== "Not Connected"
                          ? `Google Ads Customer ID: ${project.customerId}`
                          : "Connect with Google Ads"
                      }
                      arrow
                    >
                      <img
                        src={googleads}
                        alt="Google Ads"
                        className="h-6 cursor-pointer"
                        onClick={() => handleGoogleAdsIconClick(project.id)} // Attach click event handler
                      />
                    </Tooltip>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id={`icon-upload-${project.id}`}
                    onChange={(event) => handleFileUpload(event, project.id)}
                  />
                  <label htmlFor={`icon-upload-${project.id}`}>
                    <IconButton component="span">
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                        {project.icon ? (
                          <img
                            src={project.icon}
                            alt="Project Icon"
                            className="object-contain w-10 h-10"
                          />
                        ) : (
                          <CameraIcon className="w-16 h-16" />
                        )}
                      </div>
                    </IconButton>
                  </label>
                  <h2
                    className="text-2xl font-bold text-blue-600 hover:underline mb-2 cursor-pointer"
                    onClick={() =>
                      handleProjectTitleClick(
                        project.id,
                        project.customerId,
                        project.name
                      )
                    }
                  >
                    {project.name}
                  </h2>
                  {/* <p className="text-gray-700 text-sm ">{project.customerId}</p> */}
                  <p className="text-gray-400 text-sm ">
                    Last Accessed: {formatDate(project.lastAccessed)}
                  </p>
                </div>
                <p className="text-gray-700 mb-4 text-center">
                  <span className="font-semibold">Category:</span>{" "}
                  {project.category}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleAddPeopleClick(project.id)}
                    className="text-sm text-gray-500 hover:text-gray-700 left-2 bottom-2 hover:underline absolute"
                  >
                    Add People
                  </button>
                  <button
                    onClick={() => handleCreateTask(project.id)}
                    className="text-sm text-gray-500 hover:text-gray-700 right-2 bottom-2 hover:underline absolute"
                  >
                    Create Task
                  </button>
                </div>
                <div className="absolute top-0 right-0 mt-2 mr-2">
                  <IconButton onClick={(e) => handleMenuOpen(e, project.id)}>
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditProject}>
          <EditIcon fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteProject}>
          <DeleteIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProject} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleEmailDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span>Share "{fetchedProjectName}"</span>
            <IconButton>
              <Settings />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            placeholder="Add your team"
            type="email"
            fullWidth
            InputProps={{
              startAdornment: <People className="mr-2" />,
            }}
            value={emailInput}
            onChange={handleEmailInputChange}
          />
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">People with access</h3>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center w-8 h-8 bg-[#da627d] text-white rounded-full">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex w-full justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">{username}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
              </div>
            </div>
            {people.length > 0 && (
              <>
                {people.map((person, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
                        {person.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex w-full justify-between">
                        <p className="text-sm text-gray-500 text-center">
                          {person.email}
                        </p>
                        <p className="text-sm text-gray-500 text-center">
                          {person.invitation_status}
                        </p>
                        <button
                          className="text-sm text-red-500"
                          onClick={() => handleRevokeAccess(person)}
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-between w-full m-2 px-2">
            <Button
              onClick={handleEmailDialogClose}
              variant="outlined"
              color="primary"
              sx={{ borderRadius: "50px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmailSubmit}
              variant="contained"
              color="primary"
              sx={{ borderRadius: "50px" }}
            >
              Done
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectList;
