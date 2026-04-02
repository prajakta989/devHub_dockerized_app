import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useSelector } from "react-redux";
import { initialiseSocketConnection } from "../utils/socket";

const Chat = () => {
  const params = useParams();
  const UserId = params.targetId;
  const [user, setUser] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessges] = useState([]);
  const loggedInUser = useSelector((store) => store.user);
  const id = loggedInUser?._id;
  const name = loggedInUser?.firstName;

  const getChatUser = async () => {
    try {
      const user = await axios.get(BASE_URL + "/user/" + UserId, {
        withCredentials: true,
      });
      setUser(user?.data);
      console.log("userrr", user);
    } catch (err) {
      console.log(err);
    }
  };

  const getMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + UserId, {
        withCredentials: true,
      });

      console.log(chat?.data?.messages);

      const chatmessages = chat?.data?.messages.map((message) => {
        return {
          sender: message.sender._id,
          firstName: message.sender.firstName,
          lastName: message.sender.lastName,
          text: message.text,
        };
      });

      setMessges(chatmessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChatUser();
    getMessages();
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    const socket = initialiseSocketConnection();
    socket.emit("joinChat", { name, id, UserId });

    socket.on("receivedMessage", ({ name, text }) => {
      console.log(name + ":" + text);
      setMessges((prev) => [...prev, { name: name, text: text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, UserId]);

  const handleSend = () => {
    const socket = initialiseSocketConnection();
    socket.emit("sendMessage", { name, id, UserId, text: newMessage });
    setNewMessage("");
  };

  
  

  return (
    <div className="w-1/2  mx-auto h-[74vh] flex flex-col my-2 shadow-lg ">
      <div className="px-4 py-4 shadow-lg bg-base-200">
        <h1>
          {user ? (
            `${user.firstName} ${user.lastName}`
          ) : (
            <div className="h-6 w-32 bg-base-300 rounded animate-pulse"></div>
          )}
        </h1>
      </div>
      <div className="flex-1 p-5 overflow-y-scroll">
        {messages.map((msg, i) => {
          console.log(loggedInUser?.firstName === msg.firstName);
          
          return (
            <div
              className={
                "chat " +
                (loggedInUser?.firstName === msg?.firstName
                  ? "chat-start"
                  : "chat-end")
              }
            >
              {/* <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                  />
                </div>
              </div> */}
              <div className="chat-header">
                {msg.firstName}
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          );
        })}
      </div>
      <div className="shadow-lg bg-base-200 py-4 px-2 flex">
        <input
          className="flex-1 border border-gray-600 outline-none p-2 rounded "
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <button
          className="btn btn-outline btn-primary ml-2"
          onClick={() => handleSend()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
