import { nanoid } from "nanoid";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = {
  current: io("https://socket-chat-vpu4.onrender.com"),
};

export const Chat = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [message, setMessage] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    socket.current.on("change online", (numbOfUsers) => {
      if (numbOfUsers !== 0) {
        setOnlineUsers(numbOfUsers);
      }
    });

    socket.current.on("fetch messages", (messages) => {
      setAllMessages(messages);
    });

    return () => {
      socket.current.off("disconnect", currentUser.id);
    };
  }, []);

  useEffect(() => {
    socket.current.on("add message", (message) => {
      setAllMessages([message, ...allMessages]);
    });

    socket.current.on("change online", (numbOfUsers) => {
      if (numbOfUsers !== 0) {
        setOnlineUsers(numbOfUsers);
      }
    });
  }, [allMessages]);

  useEffect(() => {
    socket.current.on("change online", (changeOnline) => {
      console.log(changeOnline);
      if (changeOnline !== 0) {
        setOnlineUsers(changeOnline);
      }
    });
  }, [onlineUsers]);

  const handleClick = (e) => {
    e.preventDefault();

    socket.current.emit("add user", currentUser);
  };

  const submitHandleClick = (e) => {
    e.preventDefault();

    socket.current.emit("new message", message);

    setAllMessages([message, ...allMessages]);
  };

  return (
    <div>
      <p>Online users: {onlineUsers && onlineUsers}</p>

      <form>
        <label>Enter name</label>
        <input
          type="text"
          value={currentUser.name}
          onChange={(e) =>
            setCurrentUser({ name: e.currentTarget.value, id: nanoid() })
          }
        />
        <button onClick={handleClick}>Submit</button>
      </form>

      <ul>
        {allMessages.map(({ message, author }, idx) => (
          <li key={idx}>
            <span>{author}</span> : <span>{message}</span>
          </li>
        ))}
      </ul>

      <form>
        <label>Enter your message</label>
        <input
          type="text"
          value={message.message}
          onChange={(e) =>
            setMessage({
              message: e.currentTarget.value,
              author: currentUser.name,
            })
          }
        />
        <button onClick={submitHandleClick}>Send message</button>
      </form>
    </div>
  );
};
