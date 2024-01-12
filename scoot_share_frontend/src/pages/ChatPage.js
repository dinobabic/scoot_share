import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import ChatComponent from '../components/ChatComponent';

const ChatPage = (props) => {
    const {jwt, username, setJwt, notifications, setNotifications, jwtIsValid} = {...props};
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        fetch(`/api/messages/getChatRooms/${username}`, {
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
            if (data) {
                setChatRooms(data);
            }
          });
    }, []);

    return (
        <div className='bg-blue-50 min-h-screen'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayMyRentalsButton={jwtIsValid} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} setJwt={setJwt} displayHomeButton={true} displayLogoutButton={true} displayProfileButton={true}  displayRentScooterButton={jwtIsValid} />
            <ChatComponent chatRooms={chatRooms} username={username} jwt={jwt}/>
        </div>
    );
};

export default ChatPage;