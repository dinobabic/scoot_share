import React, { useEffect, useRef, useState } from 'react';
import WebSocketComponent from './WebSocketComponent';
import { VscSend } from 'react-icons/vsc';

const ChatComponent = (props) => {
    const {chatRooms, username, jwt} = {...props};
    const webSocketComponentRef = useRef();
    const [messages, setMessages] = useState([]);
    const [chatMessage, setChatMessage] = useState({
        "sender": username,
        "receiver": "",
        "sentAt": "",
        "content": ""
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const userIChatWith = useRef();
    const [newMessageNotification, setNewMessageNotification] = useState(null);

    useEffect(() => {
        if (selectedUser) {
            userIChatWith.current= selectedUser;
            let message = {...chatMessage};
            message.receiver = selectedUser;
            setChatMessage(message);

            if (newMessageNotification && selectedUser === newMessageNotification.sender) {
                const notification = document.querySelector(`.${newMessageNotification.sender}-notification`);
                notification.classList.add("hidden");
            }

            fetch(`/api/messages/getMessages/${username}/${selectedUser}`, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${jwt}`
                },
                method: "GET",
              })
              .then(response => {
                if (response.ok) {
                    return response.json();
                }
              })
              .then((data) => {
                if (messages) {
                    setMessages(data);
                }
              });
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, setMessages]);

    useEffect(() => {
        if (newMessage) {
            setMessages([...messages, newMessage]);
        }
    }, [newMessage, setNewMessage]);

    useEffect(() => {
        if (newMessageNotification) {
            const notification = document.querySelector(`.${newMessageNotification.sender}-notification`);
            notification.classList.remove("hidden");
        }
    }, [newMessageNotification, setNewMessageNotification]);

    const updateMessage = (event) => {
        let message = {...chatMessage};
        message.content = event.target.value;
        setChatMessage(message);
    }

    const sendMessage = (event) => {
        event.preventDefault();
        let message = {...chatMessage, "sentAt": new Date()};
        webSocketComponentRef.current.sendMessage(message);
        setMessages([...messages, message]);
        setChatMessage({
            "sender": username,
            "receiver": selectedUser,
            "sentAt": "",
            "content": ""
        });
    }

    const onMessageReceivedCustom = (message, userIChatWith) => {
        const newMessage = JSON.parse(message.body);
        if (userIChatWith.current === newMessage.sender) {
            setNewMessage(newMessage);
        }
        else {
            setNewMessageNotification(newMessage);
        }
    }

    const scrollToBottom = () => {
        const div = document.querySelector(".chat-div");
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }

    return (
        <div className='flex flex-col w-5/6 md:w-4/6 mx-auto mt-16 rounded-lg shadow-lg h-96 bg-white'>
            <p className='text-center text-2xl font-semibold py-4'>Vaši Razgovori</p>
            <div className='flex flex-row border-t-2 border-t-slate-200 h-80'>
                <div className='flex flex-col w-2/6 border-r-2 border-r-slate-200 overflow-y-auto h-fit'>
                    {chatRooms.map((room, index) => {
                        return (
                            room.users.filter((user) => user != username).map((user, index) => {
                                return (<div key={index} className='flex items-center gap-4 justify-center cursor-pointer border-b-2 border-b-slate-200 hover:bg-slate-100' onClick={() => setSelectedUser(user)}>
                                    <p className='font-semibold h-full py-4'>{user}</p>
                                    <div className={`hidden p-2 bg-green-600 rounded-full ${user}-notification`}></div>
                                </div>);
                            })
                        );
                    })}
                </div>
                {selectedUser ? 
                    <div className='flex flex-col justify-between w-4/6 px-4'>
                        <div className='chat-div flex flex-col gap-4 py-4 scrollbar-thin scrollbar-thumb-gray-200  overflow-y-auto'>
                            {messages.map((message, index) => {
                                if (!message) {
                                    return;
                                }
                                const date = new Date(message.sentAt);
                                const seenAt = !message.seenAt ? null : new Date(message.seenAt);
                                const messageId = "m-" + date.getHours().toString().padStart(2, "0") + date.getMinutes().toString().padStart(2, "0") + date.getSeconds().toString().padStart(2, "0");
                                return (
                                    <div 
                                        key={index} className={`group cursor-pointer items-center flex flex-col gap-6 justify-between max-w-fit rounded-lg shadow-lg px-6 py-2 ${message.sender === username ? "self-end justify-end" : ""}`}>
                                        <div className='flex flex-row gap-6 justify-between'>
                                            <p className='text-sm font-semibold max-w-4/5 break-all'>{message.content}</p>
                                            <div className='flex items-center gap-1'>
                                                <p className='text-xs self-end'>{date.getHours().toString().padStart(2, "0")}:{date.getMinutes().toString().padStart(2, "0")}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <form className='w-full flex items-center mb-2'>
                            <input 
                                value={chatMessage.content}
                                onChange={updateMessage}
                                type='text'
                                className='w-full shadow-md rounded-md border-2 border-slate-300 outline-none h-8 py-5 px-4 text-lg'/>
                            <button type='submit' onClick={sendMessage}>
                                <VscSend className='w-10 h-10 ml-2 text-slate-800 cursor-pointer'/>
                            </button>
                        </form>
                </div>
                : 
                <div className='flex justify-center w-4/6 h-full items-center'>
                      <p className='text-2xl font-semibold'>Odaberite nekog od iznajmljivača!</p>
                </div>
                }
            </div>
            <WebSocketComponent onMessageReceivedCustom={onMessageReceivedCustom} subscribeCustom={`/user/${username}/queue/messages`} webSocketComponentRef={webSocketComponentRef}
                    userIChatWith={userIChatWith}/>
        </div>
    );
};

export default ChatComponent;