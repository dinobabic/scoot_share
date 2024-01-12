import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import UpdateProfileComponent from '../components/UpdateProfileComponent';
import { useNavigate } from 'react-router-dom';
import RatingComponent from '../components/RatingComponent';

const UserProfilePage = (props) => {
    const {jwtIsValid, setJwt, username, jwt, notifications, setNotifications} = {...props};
    const [ratings, setRatings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/ratings/getRatingsReceiver/${username}`, {
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
                setRatings(data);
            }
        });
    }, []);

    return (
        <div className='min-h-screen bg-blue-50 pb-20'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayMyRentalsButton={jwtIsValid} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} displayChatButton={true} displayHomeButton={true} displayRentScooterButton={true}  displayLogoutButton={true} displayRegisterButton={false} displayLoginButton={false} setJwt={setJwt}/>   
            <RatingComponent username={username} jwt={jwt}/>
            <UpdateProfileComponent username={username} jwt={jwt}/>
        </div>
    );
};

export default UserProfilePage;