
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BsInfoCircle, BsPencil } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { IoCheckmark } from "react-icons/io5";
import { CiMonitor } from "react-icons/ci";
import { GoKey, GoPencil } from "react-icons/go";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";

const EditProfile = () => {
  const [isDesgEdit, setDesgEdit] = useState(false);
  const [isEmailEdit, setEmailEdit] = useState(false);
  const [isPasswordEdit, setPasswordEdit] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [userData, setUserData] = useState([]);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [designation, setDesignation] = useState("");
  const navigate = useNavigate();
  const handleDesignationChange = (e) => setDesignation(e.target.value);

  const handleDesignationEdit = () => {
    setDesgEdit(!isDesgEdit);
  };

  const handleEmailEdit = () => {
    setEmailEdit(!isEmailEdit);
  };

  const handlePasswordEdit = () => {
    setPasswordEdit(!isPasswordEdit);
  };
  const [email, setEmail] = useState("");
 

  const handleSavePasswordChanges = () => {
    
    console.log("User Data: ",userData);
    if(newPassword != confirmPassword){
      alert("Password does not match")
    }else{

      if(/[\#\$\&\@]/.test(newPassword) && newPassword.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)){

        axios.post("https://api.confidanto.com/update-profile/change-password",{
          email:localStorage.getItem("email"),
          currentPassword:userData[0].password,
          newPassword:confirmPassword
        })
        .then(res=>{      
          alert("Password Changed")
          handlePasswordEdit();
        }).catch(err=>{
          console.log("Error Saving Password")
        })
      }else{
        alert("Incorrect Password Format")
      }

    }

  };

  // Function to handle cancelling password changes
  const handleCancelPasswordChanges = () => {
    handlePasswordEdit();
    setPasswordMatchError(false); // Close the popup without saving changes
  };

  const handleDelete = () => {
    alert('Account deleted!');
  };
  

  
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      handleDelete();
      localStorage.clear();
      navigate("/login"); // Redirect to signup page
    }
  };


  const handleDeleteAccount = async () => {
    // Get email from local storage
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Email not found in local storage. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("https://api.confidanto.com/delete-account", {
        email,
      });

      if (response.status === 200) {
        alert("Account deleted successfully.");
        // Clear local storage (optional)
        localStorage.clear();
        // Navigate to the login page
        navigate("/login");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account. Please try again.");
    }
  };

  const url = "https://api.confidanto.com/header-data";
  const fetchInfo = () => {
    return axios
      .post(url, { email: localStorage.getItem("email") })
      .then((res) => {
        setUserData([res.data.userData]);
        setEmail(res.data.userData);
      })
      .catch((error) => console.log(error.response));
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="flex flex-col bg-[#e9ecef] font-arial overflow-x-hidden mb-16">
      <div className="flex flex-col p-4 m-4 my-2">
        <h1 className="text-4xl font-bold py-1">Account Settings</h1>
        <p className="text-base text-gray-500">
          View and update your account details, profile and more.
        </p>
      </div>
      <div className="flex mb-6">
        <div className="flex flex-col mx-8 mr-4  bg-white rounded-lg w-2/3">
          <h1 className="text-xl font-bold p-4 py-4 flex">
            <span className="mt-1 mr-2 text-lg">
              <BsInfoCircle />{" "}
            </span>
            Account info
          </h1>
          <div className="flex bg-gray-400 border-1"></div>
          <div className="flex flex-col m-4 p-4">
            <label className="pb-3 text-gray-500">First Name</label>
            {userData.map((dataObj) => {
              return (
                <input
                  type="text"
                  id="first_name"
                  value={dataObj.username.split(" ")[0]}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="First Name"
                  required
                />
              );
            })}
            <label className="mt-3 pb-3 text-gray-500">Last Name</label>
            {userData.map((dataObj) => {
              return (
                <input
                  type="text"
                  id="last_name"
                  value={dataObj.username.split(" ")[1]}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Last Name"
                  required
                />
              );
            })}
            <div className="flex mt-3 w-full justify-between">
              <div className="flex flex-col w-1/2">
                <label className="mt-3 pb-3 text-gray-500 flex">
                  Company Name{" "}
                  <span className="text-blue-500 mt-1.5 ml-2">
                    <BsInfoCircle />
                  </span>
                </label>
                {userData.map((dataObj) => {
                  return (
                    <input
                      type="text"
                      id="company"
                      value={dataObj.organisation}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Site Prefix"
                      required
                    />
                  );
                })}
              </div>
              <div className="flex flex-col w-1/2 ml-3">
                <label className="mt-3 pb-3 text-gray-500 flex">
                  Location
                  <span className="text-blue-500 mt-1.5 ml-2">
                    <BsInfoCircle />
                  </span>
                </label>
                {userData.map((dataObj) => {
                  return (
                    <input
                      type="text"
                      id="budget"
                      value={dataObj.region}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Location"
                      required
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 mr-8  bg-white rounded-lg w-1/3 font-roboto">
          <h1 className="text-xl font-bold py-3 flex">Account security</h1>
          <div className="flex flex-col my-3">
            <div className="flex">
              <p className="bg-blue-500 text-white mr-2 tex-sm mt-1 h-fit p-0.5 w-fit rounded-full">
                <IoCheckmark />
              </p>
              <div className="flex flex-col pr-4">
                <p>Confirm email</p>
                <p>Your email is confirmed</p>
                <NavLink to="/" className="text-blue-500">
                  Change
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex flex-col my-3">
            <div className="flex">
              <p className="mr-2 text-lg mt-1 h-fit w-fit rounded-full">
                <CiMonitor />
              </p>
              <div className="flex flex-col pr-4">
                <p>Recent login</p>
                <p>IOS, Chrome</p>
                <p>06/05/2024</p>
                <p>Pune, India</p>
                <NavLink to="/" className="text-blue-500">
                  See Recent Logins
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-8 bg-white rounded-lg mb-6 ">
        <h1 className="text-xl font-bold p-4 py-4 flex">
          <span className="mt-1  mr-2 text-lg">
            <BsInfoCircle />{" "}
          </span>
          Login info
        </h1>
        <div className="flex bg-gray-400 border-1"></div>
        <div className="flex flex-col m-4 p-4">
          <label className="pb-3 text-gray-500 flex">
            <span className="mr-2 py-0.5 text-lg">
              <AiOutlineMail />
            </span>
            Account Email
          </label>
          {userData.map((dataObj) => {
            return (
              <div className="relative">
                <input
                  type="text"
                  id="account_email"
                  value={newEmail ? newEmail : dataObj.email}
                  disabled={isEmailEdit ? false : true}
                  className={` bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                    isEmailEdit ? "bg-transparent" : "bg-gray-50"
                  }`}
                  placeholder="email"
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                {/* <button
                  type="button"
                  className="absolute top-1  right-4  py-1.5 px-1.5 focus:outline-none text-xl text-blue-500"
                  onClick={handleEmailEdit}
                >
                  <GoPencil />
                </button> */}
              </div>
            );
          })}
          <label className="mt-6 pb-3 text-gray-500 flex">
            <span className="mr-2 py-0.5 text-lg">
              <GoKey />
            </span>
            Password
          </label>
          {userData.map((dataObj) => {
            return (
              <div className="relative">
                <input
                  type="password"
                  id="account_password"
                  disabled={true}
                  value={newPassword ? newPassword : dataObj.password}
                  className={`block bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                    isPasswordEdit ? "bg-transparent" : "bg-gray-50"
                  }`}
                  placeholder="Last Name"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1  right-4  py-1.5 px-1.5 focus:outline-none text-xl text-blue-500"
                  onClick={handlePasswordEdit}
                >
                  <GoPencil />
                </button>
              </div>
            );
          })}
          <div className="flex mt-3 w-full justify-between">
            <div className="flex flex-col w-1/2">
              <label className="mt-3 pb-3 text-gray-500 flex">
                User Type
                <span className="text-blue-500 mt-1.5 ml-2">
                  <BsInfoCircle />
                </span>
              </label>
              {userData.map((dataObj) => {
                return (
                  <input
                    type="text"
                    id="user_type"
                    value={dataObj.userType}
                    className="bg-white border capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Site Prefix"
                    required
                  />
                );
              })}
            </div>
            <div className="flex flex-col w-1/2 ml-3">
              <label className="mt-3 pb-3 text-gray-500 flex">
                Designation
                <span className="text-blue-500 mt-1.5 ml-2">
                  <BsInfoCircle />
                </span>
              </label>
              {userData.map((dataObj) => {
                return (
                  <div className="relative">
                    {isDesgEdit ? (
                      <select
                        id="designation"
                        name="designation"
                        required
                        className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                          isDesgEdit ? "visible" : "hidden"
                        }`}
                        value={designation}
                        onChange={handleDesignationChange}
                      >
                        <option value="">Select Designation</option>
                        <option value="Founder">Founder</option>
                        <option value="Co-founder">Co-founder</option>
                        <option value="Senior Manager">Senior Manager</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                        <option value="Creative Director">
                          Creative Director
                        </option>
                        <option value="Art Director">Art Director</option>
                        <option value="SEO Specialist">SEO Specialist</option>
                        <option value="Content Strategist">
                          Content Strategist
                        </option>
                        <option value="Public Relations Specialist">
                          Public Relations Specialist
                        </option>
                        <option value="Event Coordinator">
                          Event Coordinator
                        </option>
                        <option value="Copywriter">Copywriter</option>
                        <option value="Graphic Designer">
                          Graphic Designer
                        </option>
                        <option value="Account_Executive">
                          Account Executive
                        </option>
                        <option value="Media_Planner">Media Planner</option>
                        <option value="Digital Marketing Specialist">
                          Digital Marketing Specialist
                        </option>
                        <option value="Social Media Manager">
                          Social Media Manager
                        </option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="designation"
                        value={designation ? designation : dataObj.designation}
                        className="block bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Designation"
                        required
                      />
                    )}
                    <button
                      type="button"
                      className="absolute top-1  right-4  py-1.5 px-1.5 focus:outline-none text-xl text-blue-500"
                      onClick={handleDesignationEdit}
                    >
                      <GoPencil />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-8 bg-white rounded-lg mb-6 border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-bold">Delete account</h1>
          <button 
          className="border border-red-900 text-red-900 rounded-md px-3 py-1 flex items-center hover:bg-red-100"
          onClick={handleDeleteClick}
          >
            <MdOutlineDeleteOutline className="mr-1 text-lg" /> Delete account
          </button>
        </div>
        <div className="px-4 pb-4 text-sm text-gray-500">
          Once an account is deleted, it can be recovered using your registered
          email.{" "}
        </div>
      </div>

      {isPasswordEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-8">
          <div className="bg-white rounded-lg p-6 w-2/4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleCancelPasswordChanges}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Change account password</h2>
            {/* Form to change password */}
            <form>
              <div className="flex flex-col my-4">
                <label className="mt-3 pb-3 text-gray-500 flex">
                  New password
                </label>
                <input
                  type="password"
                  id="acc_password"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword.length > 1 ? <div className="text-sm mt-1 text-gray-500">
                          <p
                            className={
                              newPassword.length >= 6
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have at least 6 characters
                          </p>
                          <p
                            className={
                              /(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have upper & lower case letters
                          </p>
                          <p
                            className={
                              /[\#\$\&\@]/.test(newPassword)
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have symbols (@#&$)
                          </p>
                          {/* <p
                            className={
                              newPassword.length >= 8
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must be longer password
                          </p> */}
                        </div>:<></>}
                <label className="mt-3 pb-3 text-gray-500 flex">
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="confirm_acc_password"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {newPassword !== confirmPassword ? (
                  <p className="text-red-500 py-2">Password does not match</p>
                ) : (
                  <>
                   {/* <p className="text-green-500 py-2">Password does match</p> */}
                  </>

                )}
              </div>
              <div className="flex justify-end">
                {/* Buttons to save or cancel changes */}
                {newPassword == confirmPassword?<button
                  type="button"
                  className={`px-4 py-2 bg-blue-500 text-white rounded mr-2`}
                  onClick={handleSavePasswordChanges}
                  // disabled={newPassword != confirmPassword}
                >
                  Save
                </button>:<button
                  type="button"
                  className={`px-4 py-2 bg-blue-500 text-white rounded mr-2 pointer-events-none`}
                  onClick={handleSavePasswordChanges}
                  // disabled={newPassword != confirmPassword}
                >
                  Save
                </button>}
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                  onClick={handleCancelPasswordChanges}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
