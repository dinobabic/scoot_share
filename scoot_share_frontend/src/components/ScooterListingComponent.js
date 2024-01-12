import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import ShareComponent from './ShareComponent';

const ScooterListingComponent = (props) => {
    const {viewListing, jwt, setScooters, setViewListing, scooters} = {...props};
    const [currentImage, setCurrentImage] = useState(0);

    function deleteListing() {
        fetch(`api/listings/${viewListing.scooterId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
        let newScooters = [...scooters];
        newScooters.forEach((scooter) => {
            if (scooter.id === viewListing.scooterId) {
                scooter.hasListing = false;
            }
        });
        setViewListing(null);
        setScooters(newScooters);
    }

    const decreaseIndex = () => {
        if (currentImage > 0) {
            setCurrentImage(currentImage-1);
        }
    }

    const increaseIndex = () => {
        if (currentImage < viewListing.scooterImages.length - 1) {
            setCurrentImage(currentImage + 1);  
        }
    }

    return (
        <div className='w-4/5 md:w-3/5 lg:w-2/5 shadow-lg rounded-lg py-4 px-8 flex flex-col gap-4 bg-white'>
            <p className='text-2xl font-semibold text-center'>Oglas za romobil {viewListing.scooterId}</p>
            {viewListing && viewListing.scooterImages.length > 0 && <div className='flex items-center justify-center my-8'>
                <FaArrowLeft onClick={decreaseIndex} className={currentImage == 0 ? 'text-gray-200' : 'cursor-pointer text-slate-800'}/>
                <img src={viewListing.scooterImages[currentImage]} className='w-36'/>
                <FaArrowRight onClick={increaseIndex} className={currentImage == viewListing.scooterImages.length -1 ? 'text-gray-200' : 'cursor-pointer text-slate-800'}/>
            </div>}
            <div className='flex flex-col gap-2'>
                <label className='text-md font-semibold'>
                    Lokacija Preuzimanja
                </label>
                <input disabled={true} value={viewListing.location} className='w-3/5 font-semibold text-lg rounded-md shadow-md py-2 px-4 focus:outline-none'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-md font-semibold'>
                    Lokacija Povratka
                </label>
                <input disabled={true} value={viewListing.returnLocation} className='w-3/5 font-semibold text-lg rounded-md shadow-md py-2 px-4 focus:outline-none'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-md font-semibold'>
                    Vrijeme Povratka
                </label>
                <input disabled={true} value={(new Date(viewListing.returnByTime)).toLocaleString()} className='w-3/5 font-semibold text-lg rounded-md shadow-md py-2 px-4 focus:outline-none'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-md font-semibold'>
                    Cijena po prijeđenom kilometru
                </label>
                <input disabled={true} value={viewListing.pricePerKilometer + "€"} className='w-3/5 font-semibold text-lg rounded-md shadow-md py-2 px-4 focus:outline-none'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-md font-semibold'>
                    Kazna za kašnjenje
                </label>
                <input disabled={true} value={viewListing.lateReturnPenalty + "€"} className='w-3/5 font-semibold text-lg rounded-md shadow-md py-2 px-4 focus:outline-none'/>
            </div>

            <ShareComponent description={"Pogledajte oglas za moj romobil!"} url={`www.scootshare.com/listings/${viewListing.listingId}`} />
            <div className='flex justify-end'>
                <button className='py-2 px-4 text-lg text-white bg-red-500 font-semibold rounded-lg' onClick={deleteListing}>Ukloni Oglas</button>
            </div>
        </div>
    );
};

export default ScooterListingComponent;