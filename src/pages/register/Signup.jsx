/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { confilogo, GoogleLogo } from "../logo/index";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { confi } from "../../assets/index";
import logoIcon from "../../data/android-chrome-192x192.png";
import popupImage from "../../data/Rocket-Digital-Marketing-Gif-1-ezgif.com-crop.webp";
import gmailIcon from "../../data/gmailIcon.webp";
import { GoogleOAuthProvider } from "@react-oauth/google";
//import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

function generateUniqueId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const idLength = 8; // Adjust the length of the ID as needed

  let id = "C0";
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  return id;
}

const Signup = () => {
  const CLIENT_ID =
    "784240047961-lif8stmgjvuco5ep7db1f04obkskugnv.apps.googleusercontent.com";
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [showPasswordMatch, setPasswordMatch] = useState(false);
  const [isSignIn, setSignInStatus] = useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false)

  const uniqueUserId = generateUniqueId();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleUserChange = (e) => setUserName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const [step, setStep] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatch(true);
      return; // Stop submission if passwords don't match
    }
    // Passwords match, proceed with submission
    axios
      .post("https://api.confidanto.com/signup", {
        userName,
        email,
        password,
        uniqueUserId,
      })
      .then((res) => {

        localStorage.setItem("email", email);
        localStorage.setItem("userName", userName);
        
        console.log(res);
        sendOtp()


        setShowModal(true)

      

        // if (
        //   res.data.msg === "An email has been sent! Please verify your email."
        // ) {

          // //alert("You've successfully registered! An email has been sent!");
          // setSignInStatus(!isSignIn);
          // navigate("/signup-steps");
        // }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      });
  };

  const sendOtp = () => {
    axios.post("https://api.confidanto.com/signup/send-otp",{
      email:localStorage.getItem("email")
    }).then(res=>{
      console.log("Otp Sent");
      // setStep(2)
      setShowModal(true)
      return true
    }).catch(err=>{
      console.log(err)
       return false
    })
  }
  const [inputOtp, setInputOtp] = useState()
  const verifyOtp = (e) => {
    e.preventDefault()

    axios.post("https://api.confidanto.com/signup/verify-otp",{
      email:localStorage.getItem("email"),
      otp:inputOtp
    }).then(res=>{

      console.log("Otp Verified");
      setSignInStatus(!isSignIn);
      navigate("/signup-steps");
    }).catch(err=>{
      alert("Invalid Otp")
    })
    console.log("InputOtp:",inputOtp);
  }



  const [countDownLimit, setCountDownLimit] = useState(120)
  const [countDownTemp, setCountDownTemp] = useState(countDownLimit)

  

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

  const handleClosePopup = () => {
    setSignInStatus(!isSignIn);
    navigate("/signup-steps");
  };

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [token, setToken] = useState(""); 
  const [error, setError] = React.useState(null);
  const [profile, setProfile] = useState(null);
  const handleLogin = async (googleData) => {
    const res = await fetch("http://localhost:3000/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // store returned user somehow
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Log the tokenResponse to get access_token
        console.log("Token Response:", tokenResponse);
        
        // Store the token
        setToken(tokenResponse.access_token);

        // Fetch user information with the token
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        console.log("User Info:", userInfo.data); // Log user info in console
        setUser(userInfo.data);

        // Send user info and token to the backend for signup
        await axios.post("http://localhost:3001/continue-with-google/signup", {
          userName: userInfo.data.name,
          email: userInfo.data.email,
          token: tokenResponse.access_token, // Send token as 'password'
        });
        
      } catch (error) {
        console.error("Error during signup:", error);
      }
    },
    onError: (error) => console.error("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };
  return (
    <>
      <style>
        {`
          body {
            overflow-y: hidden;
            font-family: "Calibri", sans-serif;
          }
        `}
      </style>

      
      {/* {showModal && <OTPModal resendOtp={resendOtp} verifyOtp={verifyOtp}/>} */}
      {showModal && <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-transparent py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {localStorage.getItem("email")}</p>
            </div>
          </div>

          <div>
            <form action="" method="post">
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs ">
                    <input
                        id="otp"
                        name="otp"
                        type="number"
                        autoComplete="otp"
                        required
                        className="block  py-3 w-full text-inherit text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Enter Otp"
                        value={inputOtp}
                        onChange={(e)=>{setInputOtp(e.currentTarget.value)}}
                      />
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    onClick={verifyOtp}>
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p> <button className="flex flex-row items-center text-blue-600" onClick={resendOtp}>Resend</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>}

      <div className="bg-white md:overflow-auto sm:overflow-y-scroll font-roboto">
        <a href="https://www.confidanto.com" rel="noopener noreferrer">
          <img
            src={confi}
            alt="Logo"
            className="h-6 w-32 lg:h-12 lg:w-auto mb-6 mt-8 ml-8"
            style={{ width: "234px", height: "46px" }}
          />
        </a>
        <div className="min-h-screen flex justify-center bg-cover bg-center bg-transparent w-full overflow-y-hidden">
          <div className="max-w-4xl bg-white bg-center bg-opacity-75 rounded-lg p-2 mx-4 lg:mx-0">
            <h2 className="mt-6 text-center text-4xl lg:text-6xl font-bold text-gray-900">
              Sign Up
            </h2>
            <div className="text-sm lg:text-base mt-4 text-center text-gray-500">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium underline text-indigo-600 hover:text-indigo-500"
              >
                Log In
              </Link>
            </div>
            <form className="mt-8 space-y-6" 
              // onSubmit={handleSubmit}
            
            >
              <div className="flex flex-col lg:flex-row justify-between space-x-0 lg:space-x-6">

                {step == 1? <>
                  <div className="lg:w-[700px] space-y-4">
                    <div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="block px-4 py-3 w-full text-inherit text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Full Name"
                        value={userName}
                        onChange={handleUserChange}
                      />
                    </div>
                    <div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block px-4 py-3 w-full text-left text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"} // Change type dynamically
                        autoComplete="new-password"
                        required
                        className="block px-4 py-3 w-full text-base text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        onMouseEnter={() => setShowPasswordConditions(true)}
                        onMouseLeave={() => setShowPasswordConditions(false)}
                      />
                      <button
                        type="button"
                        className="absolute top-6 right-2 focus:outline-none text-xl"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                      {showPasswordConditions && (
                        <div className="text-sm mt-1 text-gray-500">
                          <p
                            className={
                              password.length >= 6
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have at least 6 characters
                          </p>
                          <p
                            className={
                              /(?=.*[a-z])(?=.*[A-Z])/.test(password)
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have upper & lower case letters
                          </p>
                          <p
                            className={
                              /[\#\$\&\@]/.test(password)
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must have symbols (@#&$)
                          </p>
                          <p
                            className={
                              password.length >= 8
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            - Must be longer password
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} // Change type dynamically
                        autoComplete="new-password"
                        required
                        className="block px-4 py-3 w-full text-base text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-600 peer"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        onFocus={() => setPasswordMatch(true)}
                      />
                      {showPasswordMatch && (
                        <p className="text-red-500">
                          {password !== confirmPassword &&
                            "Password doesn't match"}
                        </p>
                      )}
                      <button
                        type="button"
                        className="absolute top-6 right-2 focus:outline-none text-xl"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <IoEyeOffOutline />
                        ) : (
                          <IoEyeOutline />
                        )}
                      </button>
                      <div className="flex mt-12 justify-start">
                        <button
                          type="submit"
                          className="group relative w-full lg:w-fit px-20 text-[#0f62e6] items-center flex justify-center py-2 border border-[#0f62e6] text-sm lg:text-base font-medium rounded-full hover:text-white bg-transparent hover:bg-[#0f62e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={handleSubmit}
                        >
                          Sign Up
                        </button>
                      </div>
                      <div className="text-sm lg:text-base mt-2 ml-2 text-left">
                        <Link
                          to="/"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </>:<>
                          
                <div className="lg:w-[700px] space-y-4">
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
                
                </>}
                <div className="flex lg:flex-col items-center justify-center w-full lg:w-auto">
                  {/* Vertical line */}
                  <div className="w-full h-px lg:h-40 lg:w-px bg-gray-300 lg:order-1"></div>
                  {/* Or text */}
                  <p className="mx-4 mb-0 text-center font-semibold text-gray-400 dark:text-white lg:order-2">
                    or
                  </p>
                  {/* Vertical line */}
                  <div className="w-full h-px lg:h-40 lg:w-px bg-gray-300 lg:order-3"></div>
                </div>
                <div className="flex lg:flex-col items-center justify-center w-full lg:w-auto mt-2 lg:mt-0 space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="w-full lg:w-auto lg:order-1">
                    <div className="google-btn w-full lg:w-[350px] h-10 bg-blue-500 hover:shadow-xl relative hover:shadow-outline active:bg-blue-600 mt-2">
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
                      {/* {token && <p>Token: {token}</p>} */}
                    </div>
                  </div>
                  {/*{profile ? (
                    <div>
                      {/*<img src={profile.picture} alt="user image" />
                      <h3>User Logged in</h3>
                      <p>Name: {profile.name}</p>
                      <p>Email Address: {profile.email}</p>
                      <br />
                      <br />
                      <button onClick={logOut}>Log out</button>
                    </div>
                  ) : (
                    <button
                        className="google-btn w-full lg:w-[350px] h-10 bg-blue-500 shadow-md relative hover:shadow-outline active:bg-blue-600"
                        type="button"
                        onClick={() => login()}
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
                  )}*/}

                  {/*<GoogleLogin
                    clientId="784240047961-lif8stmgjvuco5ep7db1f04obkskugnv.apps.googleusercontent.com"
                    buttonText="Log in with Google"
                    onSuccess={handleLogin}
                    onFailure={handleLogin}
                    cookiePolicy={"single_host_origin"}
                  />*/}
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
      {isSignIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-8">
          <div className="bg-white rounded-lg p-12 w-2/4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleClosePopup}
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
            {/* Form to change password */}
            <form>
              <div className="flex flex-col my-4 justify-center items-center">
                <img src={popupImage} alt="Confidanto" className="" />
                <h1 className="text-2xl text-gray-500 p-4">
                  Thanks for signing up!
                </h1>
                <h1 className="text-xl text-gray-500 p-4 px-0 text-center">
                  We have sent an email to <b>{email}</b>, so you can activate
                  your account.
                </h1>
                <h1 className="text-xl text-gray-500 p-4 px-0">
                  Do you need help? Contact us at support@confidanto.com.
                </h1>
              </div>
              <div className="flex justify-between mt-8">
                {/* Buttons to save or cancel changes */}
                <button
                  type="button"
                  className="px-8 py-2 border border-[#fb8500] hover:bg-[#fb8500] hover:text-white text-[#fb8500] rounded-lg mr-2"
                >
                  Resend Email
                </button>
                <button
                  type="button"
                  className="px-8 py-2 flex items-center bg-black border border-black text-white hover:bg-transparent hover:text-black rounded-lg"
                >
                  <span>
                    <img src={gmailIcon} className="h-5 mr-2" />
                  </span>
                  Open Gmail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


  
      
    </>
  );
};
const OTPModal = (props)=> {
  const [length, setLength] = useState(6)
  
  const inputRef = useRef(Array(length).fill(null));

  const [OTP, setOTP] = useState(Array(length).fill(''));

  const handleTextChange = (input, index) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);


    // check if the user has entered the first digit, if yes, automatically focus on the next input field and so on.


    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }


    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }


    // if the user has entered all the digits, grab the digits and set as an argument to the onComplete function.


    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  const onComplete = () => {
    console.log("otp",OTP);
  }


  return <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-transparent py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email ba**@dipainhouse.com</p>
            </div>
          </div>

          <div>
            <form action="" method="post">
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs space-x-2">

                  {Array.from({ length }, (_, index) => (
                    <div className=" h-16 ">
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        // value={OTP[index]}
                        onChange={(e) => handleTextChange(e.target.value, index)}
                        ref={(ref) => (inputRef.current[index])}
                        // className={`border border-solid border-border-slate-500 focus:border-blue-600 p-5 outline-none`}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        style={{ marginRight: index === length - 1 ? '10px' : '10px' }}
                      />
                  </div>                      
                  ))}
                  {/* <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div> */}
                    
                  {/* <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div>
                  <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div>
                  <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div>
                  <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div>
                  <div className=" h-16 ">
                    <input className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl  border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" />
                  </div> */}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    onClick={props.verifyOtp}>
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p> <button className="flex flex-row items-center text-blue-600" onClick={props.resendOtp}>Resend</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
}
export default Signup;
