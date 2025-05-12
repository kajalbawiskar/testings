/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { confi } from "../assets/index";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { SlLogin } from "react-icons/sl";
import { DigitalMarketing, GoogleLogo } from "./logo";

const GetStarted = () => {
  const navigate = useNavigate();

  console.log(localStorage.getItem("userName"));

  const userName = localStorage.getItem("userName").split(' ');
  const firstName = userName[0];
  const handleSubmit = (e) => {
    navigate("/login");
  };

  return (
    <div className="bg-white overflow-auto">
      <a href="https://www.confidanto.com" rel="noopener noreferrer">
        <img
          src={confi}
          alt="Logo"
          className="h-6 w-32 lg:h-12 lg:w-auto ml-8 pt-2"
        />
      </a>
      <div className="max-h-screen flex justify-center items-center bg-cover bg-center bg-transparent w-full">
        <div className="w-4/6 h-fit bg-white bg-opacity-75 rounded-lg px-8 pb-4 mt-4 mb-4 shadow-xl">
          <h2 className="mt-2 text-center text-3xl lg:text-4xl font-bold text-gray-900">
            Hello {firstName} 👋 <br />
            Welcome to Confidanto
          </h2>
          <p className="mt-4 text-center text-lg lg:text-xl font-medium text-gray-500">
            You're about to start your FREE trial with Confidanto platform.
            <br />
            Please take two minutes to finish setting up your account.
          </p>
          <div className="flex justify-center w-full">
            <img src={DigitalMarketing} alt="Loading" className="h-[350px] w-full" />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full lg:w-1/4 text-white items-center flex justify-center py-2 border border-[#0f62e6] text-sm lg:text-base font-semibold rounded-full hover:text-[#0f62e6] bg-[#0f62e6] hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
