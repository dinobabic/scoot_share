import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { jwtDecode } from 'jwt-decode';

const ListingDetailsPage = (props) => {
    const {jwt, jwtIsValid, setJwt, username, notifications, setNotifications} = {...props};
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [newChatRoomUser, setNewChatRoomUser] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [owner, setOwner] = useState(null);
    const [authority, setAuthority] = useState(null);

    useEffect(() => {

        const jwtDecoded = jwtDecode(jwt);
        setAuthority(jwtDecoded.authorities[0].authority);

        const listingId = window.location.href.split("/")[4];
        fetch(`/api/listings/getOneListing/${listingId}`, {
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
                setListing(data);
            }
          });
    }, []);

    useEffect(() => {
      if (listing) {
        fetch(`/api/scooters/getOwnerUsername/${listing.scooterId}`, {
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
          setOwner(data.username);
        });
      }
    }, [listing, setListing]);

    const navigateAndCreateChatRoom = () => {
      console.log(authority);
      if (!jwtIsValid) {
        navigate("/login");
      }
      if (authority !== "ROLE_CLIENT") {
        return;
      }
      if (listing) {
        fetch(`/api/scooters/getOwnerUsername/${listing.scooterId}`, {
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
            setNewChatRoomUser(data.username);
          });
      }
    }

    useEffect(() => {
        if (newChatRoomUser) {
            fetch(`/api/messages/createChatRoom/${newChatRoomUser}`, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${jwt}`
                },
                method: "GET",
              });
            navigate("/chat");
        }
    }, [newChatRoomUser, setNewChatRoomUser]);

    const changeCurrentImageIndex = function (action) { 
      if (action === "increase") {
        if (currentImageIndex < listing.scooterImages.length-1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
      else {
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      }
    }

    const rentScooter = () => {
      if (!jwtIsValid) {
        navigate("/login");
      }
      if (authority !== "ROLE_CLIENT") {
        return;
      }

      else {
        fetch(`/api/rentals/save`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          },
          method: "POST",
          body: JSON.stringify({
            "listingId": listing.id,
            "scooterRenterUsername": username,
            "rentalTimeStart": new Date(),
            "rentalTimeEnd": ""
          })
        });
      }

      navigate("/my-rentals");
    }

    return (
        <div className='bg-blue-50 min-h-screen'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayMyRentalsButton={jwtIsValid} displayRentScooterButton={jwtIsValid} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} setJwt={setJwt} displayLoginButton={!jwtIsValid} displayRegisterButton={!jwtIsValid} displayChatButton={jwtIsValid} displayHomeButton={true} displayLogoutButton={jwtIsValid} displayProfileButton={jwtIsValid} />   
            {listing &&
            <div className='w-6/6 lg:w-4/6 mx-auto mt-16'>
              <div className='flex flex-row gap-16'>
                <div className='flex flex-row gap-6 items-center'>
                  <FaArrowLeft 
                    onClick={() => changeCurrentImageIndex("decrease")}
                    className={`left-arrow text-2xl ${currentImageIndex === 0 ? "text-gray-300" : "cursor-pointer"}`}/>
                  <img src={listing.scooterImages[currentImageIndex]} className='max-h-96 shadow-lg'/>
                  <FaArrowRight 
                    onClick={() => changeCurrentImageIndex("increase")}
                    className={`right-arrow text-2xl ${currentImageIndex === listing.scooterImages.length - 1 ? "text-gray-300" : "cursor-pointer"}`} />
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Lokacija preuzimanja: <span className='font-semibold'>{listing.location}</span></p>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Lokacija povratka: <span className='font-semibold'>{listing.returnLocation}</span></p>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Vrijeme povratka: <span className='font-semibold'>{`${(new Date(listing.returnByTime).getFullYear())}-${(new Date(listing.returnByTime)).getDate()}-${(new Date(listing.returnByTime)).getMonth()+1}`}</span></p>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Cijena po kilometru: <span className='font-semibold'>{listing.pricePerKilometer}€</span></p>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Kazna u slučaju kašnjenja: <span className='font-semibold'>{listing.lateReturnPenalty}€</span></p>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <FaArrowRightLong className='text-xl text-gray-400'/>
                    <p className='text-xl'>Vlasnik: <span className='font-semibold cursor-pointer hover:text-slate-600' onClick={() => navigate(`/profile/${owner}`)}>{owner}</span></p>
                  </div>
                  <div className='flex mt-6 gap-16'>
                    <button 
                      onClick={rentScooter}
                      className='bg-green-500 text-white font-semibold text-xl rounded-lg py-2 px-3 hover:bg-green-700'>Unajmi romobil</button>
                    <button 
                    onClick={() => navigateAndCreateChatRoom()}
                    className='bg-slate-800 text-white font-semibold text-xl rounded-lg py-2 px-3 hover:bg-slate-700'>Pošalji poruku vlasniku</button>
                  </div>
                </div>
              </div>
            </div>}
        </div>
    );
};

export default ListingDetailsPage;