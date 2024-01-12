import React, { useEffect, useRef, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import { jwtDecode } from 'jwt-decode';
import WebSocketComponent from '../components/WebSocketComponent';
import { VscSend } from "react-icons/vsc";
import ListingComponent from '../components/ListingComponent';
import { useNavigate } from 'react-router-dom';

const HomePage = (props) => {
    const {jwtIsValid, setJwt, jwt, username, notifications, setNotifications} = {...props};
    const [authority, setAuthority] = useState(null);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        if (jwt && jwt !== "") {
            const jwtDecoded = jwtDecode(jwt);
            setAuthority(jwtDecoded.authorities[0].authority);
        }
    }, []);

    useEffect(() => {
        fetchListings();
    }, [username]);

    const fetchListings = () => {
        let tmpUsername = "";
        if (username && username !== undefined)
            tmpUsername = "/" +username;
        fetch(`/api/listings/getAll${tmpUsername}`, {
            headers: {
              "Content-Type": "application/json",
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
                setListings(data);
            }
          });
    }

    return (
        <div className='bg-blue-50 min-h-screen'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayImageChangeRequestsButton={jwtIsValid && authority === "ROLE_ADMIN"} displayMyRentalsButton={jwtIsValid && authority === "ROLE_CLIENT"} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} displayChatButton={jwtIsValid && authority == "ROLE_CLIENT"} displayAdminPage={jwtIsValid && authority === "ROLE_ADMIN"} displayRentScooterButton={jwtIsValid && authority !== "ROLE_ADMIN"} authority={authority} displayProfileButton={jwtIsValid && authority !== "ROLE_ADMIN"} displayLogoutButton={jwtIsValid} displayRegisterButton={!jwtIsValid} displayLoginButton={!jwtIsValid} setJwt={setJwt}/>
            <div className='pt-8'>
                <div className='w-5/6 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
                    {listings.map((listing, index) => {
                        return (
                            <ListingComponent key={index} listing={listing} canReserveScooter={jwtIsValid && authority === "ROLE_CLIENT"} jwtIsValid={jwtIsValid}/>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomePage;