import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { MdVideoCall, MdAttachFile, MdImage, MdInsertDriveFile } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const socket = io("https://api.confidanto.com");

const ChatBox = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.post("https://api.confidanto.com/header-data", {
          email: localStorage.getItem("email"),
        });
        setUserData(res.data.userData);

        const historyRes = await axios.get(
          `https://api.confidanto.com/chatbox-api/api/messages/${res.data.userData.email}`
        );
        setMessages(historyRes.data);
      } catch (error) {
        console.error("Error fetching user data or chat history:", error);
      }
    };

    fetchInfo();

    if (messages.length === 0) {
      const welcomeMessage = {
        from: "manager",
        text: "Hello! I'm John, your account manager. You can reach me at john@example.com or call me at +1234567890. How can I assist you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      const notificationMessage = {
        from: "system",
        text: "How can I assist you today?",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, notificationMessage]);
      setShowInput(true);
    }

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    if (userData?.email) {
      socket.on(`adminMessage:${userData.email}`, (newAdminMessage) => {
        setMessages((prevMessages) => [...prevMessages, newAdminMessage]);
      });
    }

    return () => {
      socket.off("newMessage");
      if (userData?.email) {
        socket.off(`adminMessage:${userData.email}`);
      }
    };
  }, [isOpen, userData]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && userData?.email) {
      const newMessage = {
        from: "user",
        text: inputValue,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);

      try {
        await axios.post("https://api.confidanto.com/chatbox-api/api/messages", {
          email: userData.email,
          text: inputValue,
        });

        socket.emit("sendMessage", {
          email: userData.email,
          text: inputValue,
        });
      } catch (error) {
        console.error("Error saving message to database:", error);
      }

      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleVideoCallClick = () => {
    toggleAttachmentOptions();
    navigate("/ScheduleCall");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const newMessage = {
        from: "user",
        text: `Sent an attachment: ${file.name}`,
        fileUrl: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
    }
    setShowAttachmentOptions(false);
  };

  return isOpen ? (
    <div className="fixed bottom-20 right-4 w-full sm:w-1/2 md:w-1/3 bg-white shadow-xl rounded-lg overflow-hidden max-h-[80vh]">
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between rounded-t-lg">
        <h3 className="text-lg font-semibold">Chat with us</h3>
        <button onClick={toggleChat} className="text-white focus:outline-none text-xl">
          &times;
        </button>
      </div>
      <div className="p-4 max-h-60 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.from === "admin" ? "justify-start" : "justify-end"}`}>
            <div
              className={`inline-block p-2 rounded-lg text-sm max-w-xs ${
                message.from === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
              {message.fileUrl && (
                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
                  {message.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img src={message.fileUrl} alt={message.text} className="max-w-full h-auto rounded-lg" />
                  ) : (
                    <span className="text-blue-600 underline">{message.text}</span>
                  )}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInput && (
        <div className="p-2 border-t border-gray-200 flex items-center space-x-2 relative bottom-0">
          <button className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none" onClick={toggleAttachmentOptions}>
            <MdAttachFile className="w-6 h-6" />
          </button>
          {showAttachmentOptions && (
            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2 flex space-x-2">
              <button className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none" onClick={handleVideoCallClick}>
                <MdVideoCall className="w-6 h-6" title="Start Video Call" />
              </button>
              <label className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer">
                <MdImage className="w-6 h-6" title="Attach Image" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <label className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer">
                <MdInsertDriveFile className="w-6 h-6" title="Attach File" />
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          )}
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      )}
    </div>
  ) : null;
};

export default ChatBox;
