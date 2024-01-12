import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import { FaArrowRightLong } from 'react-icons/fa6';
import RatingComponent from '../components/RatingComponent';

const ViewUserProfilePage = (props) => {
    const {jwtIsValid, setJwt, username, jwt, notifications, setNotifications} = {...props};
    const [user, setUser] = useState(null);

    useEffect(() => {
        const username = window.location.href.split("/")[4];
        fetch(`/api/users/viewUser/${username}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`
            },
            method: "GET",
        })
        .then((response) => {
        if (response.ok) {
            return response.json();
        }
        })
        .then((data) => {
        setUser(data);
        });
    }, []);

    return (
        <div className='min-h-screen bg-blue-50 pb-20'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayProfileButton={true} displayMyRentalsButton={jwtIsValid} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} displayChatButton={true} displayHomeButton={true} displayRentScooterButton={true}  displayLogoutButton={true} displayRegisterButton={false} displayLoginButton={false} setJwt={setJwt}/>   
            <div className='w-5/6 mx-auto mt-16 flex justify-center'>
                {user &&
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-8 items-center'>
                            <FaArrowRightLong className='text-xl text-gray-400'/>
                            <p className='text-lg'>Korsiničko ime: <span className='font-semibold'>{user.username}</span></p>
                        </div>
                        {user.showFirstName &&
                            <div className='flex gap-8 items-center'>
                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                <p className='text-lg'>Ime: <span className='font-semibold'>{user.firstName}</span></p>
                            </div>
                        }  
                        {user.showLastName &&
                            <div className='flex gap-8 items-center'>
                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                <p className='text-lg'>Prezime: <span className='font-semibold'>{user.lastName}</span></p>
                            </div>
                        }  
                        {user.showNickname &&
                            <div className='flex gap-8 items-center'>
                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                <p className='text-lg'>Nadimak: <span className='font-semibold'>{user.nickname}</span></p>
                            </div>
                        }  
                        {user.showEmail &&
                            <div className='flex gap-8 items-center'>
                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                <p className='text-lg'>Email: <span className='font-semibold'>{user.email}</span></p>
                            </div>
                        }  
                    </div>
                }
            </div>
            {user && <RatingComponent username={user.username} jwt={jwt}/>}
        </div>
    );
};

export default ViewUserProfilePage;