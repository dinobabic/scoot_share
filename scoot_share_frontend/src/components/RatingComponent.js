import React, { useEffect, useState } from 'react';
import { IoIosStar } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const RatingComponent = (props) => {
    const {username, jwt} = {...props}
    const [ratings, setRatings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (username && username !== "") {
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
        }
    }, [username]);

    return (
        <div className='w-4/5 md:w-3/5 mx-auto my-16 py-4 px-8 bg-white max-h-96 overflow-y-auto'>
                <p className='text-2xl font-semibold text-center mb-8'>Komentari i Ocjene</p>
                <div className='flex flex-col gap-8'>
                    {ratings.map((rating, index) => {
                        return (
                            <div key={index} className='shadow-md rounded-md py-4 px-4'>
                                <p className='text-xl font-semibold cursor-pointer mb-2' onClick={() => navigate(`/profile/${rating.ratingSender}`)}>{rating.ratingSender}</p>
                                <div className='flex gap-6'>
                                    <div className='flex gap-1 items-center'>
                                        <IoIosStar className={`text-yellow-300 cursor-pointer text-2xl`}/>
                                        <IoIosStar className={`${rating.grade >= 2 ? "text-yellow-300" : "text-gray-500"} cursor-pointer text-2xl`}/>
                                        <IoIosStar className={`${rating.grade >= 3 ? "text-yellow-300" : "text-gray-500"} cursor-pointer text-2xl`}/>
                                        <IoIosStar className={`${rating.grade >= 4 ? "text-yellow-300" : "text-gray-500"} cursor-pointer text-2xl`}/>
                                        <IoIosStar className={`${rating.grade >= 5 ? "text-yellow-300" : "text-gray-500"} cursor-pointer text-2xl`}/>
                                    </div>
                                    <input type='text' disabled={true} value={rating.comment}  className='bg-slate-300 py-2 px-4 text-xl rounded-lg shadow-md w-3/5'/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    );
};

export default RatingComponent;