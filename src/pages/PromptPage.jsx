import React, { useRef, useState, useEffect } from "react";
import { FaArrowUp, FaPaperclip } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { processPromptChatBox } from "./Tools/promptHelper";
import autoCorrectPrompt from "./Tools/AutoCorrectPrompt";

function PromptPage() {
  const [messages, setMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [typingMessage, setTypingMessage] = useState(null);
  const contentRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const addUserMessage = async (message) => {
    let obj = {
      id: Date.now(),
      from: "user",
      content: message,
      loading: false,
    };    
    setMessages((prevItems) => [...prevItems, obj]);
    setTimeout(() => {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }, 0);
  };

  const addPromptButton = async () => {
    if (!userPrompt.trim()) return; // Prevent empty messages
  
    const correctedPrompt = await autoCorrectPrompt(userPrompt);
    
    await addUserMessage(correctedPrompt); 
    setUserPrompt(""); // Clear input after sending
  
    await fetchGptResponse(correctedPrompt); // Pass corrected prompt to GPT
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userPrompt.trim() !== "") {
      addPromptButton();
    }
  };

  const fetchGptResponse = async (correctedPrompt) => {
    let loadingObj = {
      id: messages.length,
      from: "gpt",
      content: "...",
      loading: true,
    };
    setMessages((prevItems) => [...prevItems, loadingObj]);
  
    setTimeout(async () => {
      let data = await processPromptChatBox(correctedPrompt);
      setMessages((prevItems) => prevItems.slice(0, -1));
  
      simulateTypingEffect(data.answer);
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }, 2000);
  };
  

  const simulateTypingEffect = (text) => {
    let index = 0;
    setTypingMessage("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingMessage((prev) => (prev || "") + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setTypingMessage(null);

        let obj = {
          id: messages.length,
          from: "gpt",
          content: text,
          loading: false,
        };
        setMessages((prevItems) => [...prevItems, obj]);
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file) {
      if (file.size > maxSize) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="m-4 h-[95%] bg-white">
      <div
        className={`mx-28 my-2 h-5/6 flex flex-col ${
          messages.length === 0
            ? "items-center justify-center"
            : "items-center justify-around"
        }`}
      >
        {messages.length === 0 ? (
          <h2 className="text-3xl font-semibold my-4">
            How can I help you today?
          </h2>
        ) : (
          <div
            className="chatmessages w-full p-2 pt-3 h-full overflow-auto"
            ref={contentRef}
          >
            {messages.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`p-2 text-xl flex flex-row items-center ${
                    item.from === "user" ? "justify-end" : "justify-start"
                  } `}
                >
                  {item.loading ? (
                    <div className="loading">
                      <span className="dots text-[#3B82F6]"></span>
                    </div>
                  ) : (
                    <div
                      className={`p-2 px-4 text-base text-gray-800 rounded-2xl ${
                        item.from !== "gpt"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-white text-gray-800 shadow-md"
                      } `}
                    >
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
            {typingMessage && (
              <div className="p-2 text-xl flex flex-row items-center justify-start">
                <div className="p-2 px-4 text-base text-gray-800 rounded-2xl bg-white text-gray-800 shadow-md">
                  {typingMessage}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="inputBox w-full relative flex justify-center items-center">
          <div className="w-full relative flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
              multiple
            />

            <button
              className="absolute left-2 text-xl text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors duration-200"
              onClick={handleFileButtonClick}
            >
              <FaPaperclip className="text-lg" />
            </button>

            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something to ConfiAI..."
              className="w-full border-2 border-gray-200 pl-12 pr-16 py-4 px-4 bg-transparent focus:outline-none focus:border-gray-400 shadow-sm hover:border-gray-400 rounded-full transition-colors duration-200 font-semibold"
            />

            <button
              className={`absolute right-2 text-xl p-3 ${
                userPrompt.length > 0
                  ? "bg-[#4e47e5] hover:bg-[#3d37b8] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } rounded-full transition-all duration-200 transform hover:scale-105`}
              onClick={addPromptButton}
              disabled={userPrompt.length <= 0}
            >
              <IoSendSharp
                className={`text-lg ${userPrompt.length > 0 ? "-rotate-90" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[95%] mx-auto">
        <p className="text-sm text-center text-gray-500 pt-2">
          ConfiAI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

export default PromptPage;
