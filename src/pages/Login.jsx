/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { confi } from "../assets/index";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { SlLogin } from "react-icons/sl";
import { GoogleLogo } from "./logo";
import PrivacyPolicy from "./PrivacyPolicy";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPPVisble, setPrivacyPolicyVisible] = useState(false);
  const [token, setToken] = useState(null); // Store token
  const [user, setUser] = useState(null); 
  const [step, setStep] = useState(1)

  const [inputOtp, setInputOtp] = useState()
  const verifyOtp = (e) => {
    e.preventDefault()

    axios.post("https://api.confidanto.com/signup/verify-otp",{
      email:localStorage.getItem("email"),
      otp:inputOtp
    }).then(res=>{

      console.log("Otp Verified");
      // setSignInStatus(!isSignIn);
      setStep(1)
      alert("Otp Verified")
      // navigate("/projects");
    }).catch(err=>{
      alert("Invalid Otp")
    })
    console.log("InputOtp:",inputOtp);
  }
  const resendOtp = (e) => {
    e.preventDefault()

    axios.post("https://api.confidanto.com/signup/resend-otp",{
      email:localStorage.getItem("email")
    }).then(res=>{
      alert("Otp Sent. Please check email.")
      console.log("Resend Otp",res);
    })
    .catch(err=>{
      alert("Wait 2 minutes to Resend Otp.")
      console.log("Resend Otp Error",err);
    })
  }

  // const clientId ="549323825011-0r1nidodml9re6qp7gc3773our6se63a.apps.googleusercontent.com";
  const clientId ="784240047961-l599fdt46lag2p9t3blr91jdmfeb7hnt.apps.googleusercontent.com";
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // axios.post("https://api.confidanto.com/user/check-email-verification",{email:email})
    // .then(res=>{
    //   console.log(res,res.data,res.data.verify_status);
    //   if(res.data.verify_status){
    //     axios
    //     .post("https://api.confidanto.com/login", { email, password })
    //     .then((res) => {
    //       if (res.data) {
    //         const { token } = res.data;
    //         const { email } = res.data.user;

    //         localStorage.setItem("token", token);
    //         localStorage.setItem("email", email);

    //         console.log(localStorage.getItem("token"));
    //         console.log(localStorage.getItem("email"));

    //         navigate("/projects");
    //         onLogin();
    //       } else {
    //         alert("Failed to login");
    //       }
    //     })
    //     .catch((error) => {
    //       if (error.response && error.response.status === 401) {
    //         alert("Invalid username or password");
    //       } else {
    //         alert(error);
    //       }
    //     });

    //   }else{

    //     localStorage.setItem("email", email);
    //     // 
    //     setStep(2)
    //     alert("Email not verified")
    //   }
    // })
    // .catch(err=>{
    //   alert(err.response.data.error)
      
    //   console.log(err.response.data.error);
    // })
    // return
    axios
      .post("https://api.confidanto.com/login", { email, password })
      .then((res) => {
        if (res.data) {
          const { token } = res.data;
          const { email } = res.data.user;

          localStorage.setItem("token", token);
          localStorage.setItem("email", email);

          console.log(localStorage.getItem("token"));
          console.log(localStorage.getItem("email"));


          axios.post("https://api.confidanto.com/user/check-email-verification",{email:email})
          .then(res=>{
            console.log(res);
            if(res.data.verify_status){
    
              navigate("/projects");
              onLogin();
              
            }else{
  
              // setStep(2)
              alert("Email not verified")
  
            }
          })
          .catch(err=>{
            console.log("verify otp",err);
          })
        } else {
          alert("Failed to login");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert("Invalid username or password");
        } else {
          alert(error);
        }
      });
  };

  const passwordTooltip =
    "Must have at least 6 characters.<br>----------------------------------------------------------- <br>Its better to have: <br>1. Upper & Lower case letters <br>2. A special character <br>3. A longer password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = useGoogleLogin({
    clientId,
    onSuccess: async (tokenResponse) => {
      try {
        // Store the token
        setToken(tokenResponse.access_token);

        // Fetch user information from Google with the token
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        console.log("User Info:", userInfo.data);

        // Set the user info in state
        setUser(userInfo.data); // Fixes the ReferenceError

        // Step 1: Send user info and token to the backend for signup
        // await axios.post("http://localhost:3001/continue-with-google/signup", {
        await axios.post("https://api.confidanto.com/continue-with-google/signup", {
          userName: userInfo.data.name,
          email: userInfo.data.email,
          token: tokenResponse.access_token, // Send token as 'password'
        });

        // Step 2: Login user by verifying token in backend
        // const loginResponse = await axios.post("http://localhost:3001/continue-with-google/login", {
        const loginResponse = await axios.post("https://api.confidanto.com/continue-with-google/login", {
          token: tokenResponse.access_token,
        });

        if (loginResponse.data) {
          // Store token and email locally
          localStorage.setItem("token", tokenResponse.access_token);
          localStorage.setItem("email", userInfo.data.email);

          // Navigate to the projects page if login is successful
          navigate("/projects");
          onLogin();
        } else {
          alert("Failed to login");
        }
      } catch (error) {
        console.error("Error during signup or login:", error);
      }
    },
    onError: (error) => console.error("Login Failed:", error),
  });
  

  return (
    <>
      <style>
        {`
          body {
            overflow-y: hidden;
            font-family: Calibri", sans-serif;
          }
        `}
      </style>

      <div className="bg-white md:overflow-auto sm:overflow-y-scroll font-roboto">
        <a href="https://www.confidanto.com" rel="noopener noreferrer">
          <img
            src={confi}
            alt="Logo"
            className="h-6 w-32 lg:h-12 lg:w-auto mb-6 mt-8 ml-8"
            style={{ width: "234px", height: "46px" }}
          />
        </a>
        <div className="min-h-screen flex justify-center bg-cover bg-center bg-transparent w-full">
          <div className="max-w-4xl bg-white bg-opacity-75 rounded-lg p-8">
            <h2 className="mt-6 text-center text-4xl lg:text-6xl font-bold text-gray-900">
              Log In
            </h2>
            <div className="text-sm lg:text-base mt-4 text-center text-gray-500">
              Don't have an account ?{" "}
              <Link
                to="/Signup"
                className="font-medium underline text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-wrap w-full justify-between items-center">

                {step == 1?
                  <div className="w-full lg:w-64 mx-4 items-center">
                    <div className="relative">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="block px-2.5 pb-2.5 pt-5 w-full text-sm lg:text-base text-gray-900 bg-transparent dark:bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label
                        htmlFor="username"
                        className="absolute text-sm lg:text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      >
                        Email
                      </label>
                    </div>

                    <div className="relative top-4">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="block px-2.5 pb-2.5 pt-5 w-full text-sm lg:text-base text-gray-900 bg-transparent dark:bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        htmlFor="password"
                        className="absolute text-sm lg:text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="absolute top-6 right-4 focus:outline-none text-xl"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                    <div className="mt-12">
                      <button
                        type="submit"
                        className="group relative w-full lg:w-10/12 text-[#0f62e6] items-center flex justify-center py-2 px-4 border border-[#0f62e6] text-sm lg:text-base font-medium rounded-full hover:text-white bg-transparent hover:bg-[#0f62e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Login
                        <span className="ml-4">
                          <SlLogin />
                        </span>
                      </button>
                    </div>
                  </div>
                  :<>
                  <div className=" space-y-4">
                    <div>
                      <h4 className="ml-2">Email Sent to: {localStorage.getItem("email")}</h4>
                      <input
                        id="otp"
                        name="otp"
                        type="number"
                        autoComplete="otp"
                        required
                        className="block px-4 py-3 w-full text-inherit text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Enter Otp"
                        value={inputOtp}
                        onChange={(e)=>{setInputOtp(e.currentTarget.value)}}
                      />

                      <div className="flex justify-between items-center mt-2">
                        <button className="p-2 bg-blue-500 rounded-md font-roboto text-white hover:text-blue-500 hover:bg-white border-2 border-white hover:border-blue-500"
                        onClick={verifyOtp}
                        >Verify Otp</button>
                        <button className="p-2 bg-blue-500 rounded-md font-roboto text-white hover:text-blue-500 hover:bg-white border-2 border-white hover:border-blue-500"
                        onClick={resendOtp}>Resend Otp</button>
                        {/* <h2>{countDownTemp}</h2> */}

                        {/* <Appp/> */}
                          
                      </div>
                    </div>
                  </div>
                  
                  </>
                }

                <div className="lg:my-4 flex lg:flex-col lg:w-fit items-center justify-center w-full mt-2">
                  {/* Vertical line */}
                  <div className="w-28 h-px lg:h-24 lg:w-px bg-gray-300"></div>
                  {/* Or text */}
                  <p className="mx-4 mb-0 text-center font-semibold text-gray-400 dark:text-white">
                    or
                  </p>
                  {/* Vertical line */}
                  <div className="w-28 h-px lg:h-24 lg:w-px bg-gray-300"></div>
                </div>

                <div className="flex flex-col w-full lg:w-80 items-center p-4 justify-center">
                  <div className="flex text-sm justify-center">
                    <Link
                      to="/ForgotPassword"
                      className="font-medium text-sm lg:text-base text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="google-btn w-full lg:w-fit h-10 bg-blue-500 hover:shadow-xl relative hover:shadow-outline active:bg-blue-600 mt-2">
                    <button
                      className="google-btn w-full lg:w-[350px] h-10 bg-blue-500 shadow-md relative hover:shadow-outline active:bg-blue-600"
                      type="button"
                      onClick={login}
                    >
                      <div className="flex items-center border-1 border-blue-600">
                        <div className="google-icon-wrapper w-10 h-10 bg-white relative">
                          <img
                            className="google-icon w-6 h-6 absolute top-2 left-1.5"
                            src={GoogleLogo}
                            alt="Google Icon"
                          />
                        </div>
                        <p className="btn-text font-semibold text-white text-sm lg:text-base   leading-none w-full lg:px-12">
                          Continue with Google
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
              <p className="px-1 text-center">Terms of Use</p>
              <button
                onClick={(e) => setPrivacyPolicyVisible(true)}
                className="px-1 text-center"
              >
                Privacy Policy
              </button>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
              <p className="px-4 text-center">
                Policy and Terms of Service apply.
              </p>
            </div>
          </div>
        </div>
        {isPPVisble && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-8">
            <div className="bg-white rounded-lg w-3/6 relative">
              <PrivacyPolicy onClose={() => setPrivacyPolicyVisible(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
