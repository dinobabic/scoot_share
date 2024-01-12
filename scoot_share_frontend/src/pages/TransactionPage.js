import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import { IoIosStar } from "react-icons/io";
 
const TransactionPage = (props) => {
    const {jwt, username, setJwt, notifications, setNotifications, jwtIsValid} = {...props};
    const [transactions,setTransactions]=useState([]);
    const [rating, setRating] = useState({
        "ratingSender": username,
        "ratingReceiver": "",
        "grade": "",
        "comment": "",
        "ratingTime": ""
    });

    useEffect(() => {
        fetch(`/api/transactions/${username}`, {
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
                data.forEach((element) => element.timeOfTransaction = new Date(element.timeOfTransaction));
                setTransactions(data.sort((a, b) => b.timeOfTransaction - a.timeOfTransaction));
            }
        });
    }, [])

    const displayRatingModal = (transaction) => {
        let newRating = {...rating};
        newRating.ratingReceiver = transaction.rentalDto.scooterRenterUsername;
        newRating.grade = 1;
        setRating(newRating);
        document.querySelector(".rating-modal").classList.remove("hidden");
        document.querySelector(".rating-modal").classList.add("flex");
    } 

    const updateRatingGrade = (grade) => {
        for (let i = 1; i <= 5; i++) {
            document.querySelector(`.star-${i}`).classList.add("text-gray-500");
            document.querySelector(`.star-${i}`).classList.remove("text-yellow-300");
        }
        for (let i = 1; i <= grade; i++) {
            document.querySelector(`.star-${i}`).classList.remove("text-gray-500");
            document.querySelector(`.star-${i}`).classList.add("text-yellow-300");
        }
        let oldRating = {...rating};
        oldRating.grade = grade;
        setRating(oldRating);
    }

    const closeRatingModal = () => {
        document.querySelector(".rating-modal").classList.add("hidden");
        updateRatingGrade(1);
        setRating({
            "ratingSender": username,
            "ratingReceiver": "",
            "grade": 1,
            "comment": "",
            "ratingTime": ""
        });
    }

    const rateClient = () => {
        let newRating = {...rating};
        newRating.ratingTime = new Date();
        fetch(`/api/ratings/save`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(newRating)
        });
        setRating({
            "ratingSender": username,
            "ratingReceiver": "",
            "grade": 1,
            "comment": "",
            "ratingTime": ""
        });
        document.querySelector(".rating-modal").classList.add("hidden");
        updateRatingGrade(1);
    }

    return (
        <div className='min-h-screen bg-blue-50'>
           <NavigationComponent displayChatButton={true} displayMyRentalsButton={jwtIsValid} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} setJwt={setJwt} displayHomeButton={true} displayLogoutButton={true} displayProfileButton={true}  displayRentScooterButton={jwtIsValid} />
            <div className='w-5/6 md:w-3/5 lg:w-2/5 mx-auto py-16 flex flex-col gap-10'>
                {transactions.map((transaction, index) => {
                    return (
                        <div className='shadow-lg rounded-sm py-8 px-8 bg-white' key={index}>
                            <div className='flex flex-col gap-8'>
                                <p className='text-2xl font-semibold text-center mb-4'>Transakcija {transactions.length - index}</p>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Vlasnik romobila: </p>
                                    <input type='text' disabled={true} value={transaction.rentalDto.scooterOwner}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Klijent: </p>
                                    <input type='text' disabled={true} value={transaction.rentalDto.scooterRenterUsername}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Početak najma: </p>
                                    <input type='date' disabled={true} value={(new Date(transaction.rentalDto.rentalTimeStart)).toISOString().split('T')[0]}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Kraj najma: </p>
                                    <input type='date' disabled={true} value={(new Date(transaction.rentalDto.rentalTimeEnd)).toISOString().split('T')[0]}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Naplaćena kazna: </p>
                                    <input type='text' disabled={true} value={transaction.wasLate ? "Da" : "Ne"}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Prijeđeno kilometara: </p>
                                    <input type='text' disabled={true} value={String(transaction.kilometersPassed).substring(0, 5)}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                <div className='flex flex-row gap-4 items-center'>
                                    <p className='text-lg font-semibold w-2/6'>Ukupna cijena: </p>
                                    <input type='text' disabled={true} value={String(transaction.totalPrice).substring(0, 5)}  className='bg-slate-300 py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                                </div>
                                {transaction.rentalDto.scooterOwner === username &&
                                <div className='self-end'>
                                    <button onClick={() => displayRatingModal(transaction)} className='py-2 px-3 bg-slate-800 text-white font-semibold text-xl cursor-pointer rounded-md'>
                                        Ocjeni Klijenta
                                    </button>
                                </div>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div id="default-modal" tabIndex="-1" aria-hidden="true" className="rating-modal fixed inset-0 z-50 hidden items-center justify-center bg-gray-200 bg-opacity-50">
                <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <p className='text-2xl font-semibold'>Ocjenite korisnike {rating.ratingReceiver}</p>
                        <button 
                            onClick={closeRatingModal}
                            type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-row gap-4 items-center'>
                                <p className='text-lg font-semibold w-1/5'>Ocjena: </p>
                                <IoIosStar onClick={() => updateRatingGrade(1)} className='text-yellow-300 cursor-pointer text-3xl star-1'/>
                                <IoIosStar onClick={() => updateRatingGrade(2)} className='text-gray-500 cursor-pointer text-3xl star-2'/>
                                <IoIosStar onClick={() => updateRatingGrade(3)} className='text-gray-500 cursor-pointer text-3xl star-3'/>
                                <IoIosStar onClick={() => updateRatingGrade(4)} className='text-gray-500 cursor-pointer text-3xl star-4'/>
                                <IoIosStar onClick={() => updateRatingGrade(5)} className='text-gray-500 cursor-pointer text-3xl star-5'/>
                            </div>
                            <div className='flex flex-row gap-4 items-center'>
                                <p className='text-lg font-semibold w-1/5'>Komentar: </p>
                                <input 
                                    onChange={(event) => {
                                        let oldRating = {...rating};
                                        oldRating.comment = event.target.value;
                                        setRating(oldRating); 
                                    }}
                                    type='text' value={rating.comment}  className='focus:outline-none py-2 px-4 text-xl rounded-md shadow-md w-2/5'/>
                            </div>
                            <div className='self-end'>
                                <button onClick={rateClient} className='py-2 px-3 bg-slate-800 text-white font-semibold text-xl cursor-pointer rounded-md'>
                                    Ocjeni Klijenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default TransactionPage;