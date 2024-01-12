import React, { useEffect, useState } from 'react';
import ShareComponent from './ShareComponent';
import { useNavigate } from 'react-router-dom';

const ScooterListComponent = (props) => {
    const {scooters, setScooterListing, setViewListing, jwt} = {...props};
    const navigate = useNavigate();

    const rentScooter = (index) => {
        setScooterListing(scooters[index]);
    }

    const viewListing = (index) => {
        const scooterToViewListing = scooters[index];
        fetch(`/api/listings/getOneListingByScooterId/${scooterToViewListing.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            setViewListing(data);
        })
    }

    const chatWithRenter = async (index) => {
        const scooterToViewListing = scooters[index];
        let response = await fetch(`/api/listings/getOneListingByScooterId/${scooterToViewListing.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        });
        response = await response.json();
        
        response = await fetch(`/api/rentals/getRentalForListing/${response.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        });
        response = await response.json();

        response = await fetch(`/api/messages/createChatRoom/${response.scooterRenterUsername}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        });

        navigate("/chat");
    }

    return (
        <div className='max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 rounded-md shadow-md bg-white'>
            <p className='text-2xl font-semibold text-center my-4'>Vaši Romobili</p>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Slike
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>     
                    {scooters && scooters.map((scooter, index) => {
                        return (
                            <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <div className='grid grid-cols-3 gap-2'>
                                        {scooter.images.map((image, imageIndex) => {
                                            return (
                                                <img src={image} key={imageIndex} className='w-36 h-36'/>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {scooter.hasListing ? 
                                        scooter.listingIsActive ?
                                            <p className='text-green-500 cursor-pointer' onClick={() => viewListing(index)}>Romobil je već u najmu, pregled oglasa</p>
                                        :
                                        <div>
                                            <p className='text-green-500'>Romobil je iznajmljen</p>
                                            <p className='cursor-pointer font-semibold' onClick={() => chatWithRenter(index)}>Kontaktiraj unajmitelja</p>
                                        </div>
                                    : <p className='text-green-500 cursor-pointer' onClick={() => rentScooter(index)}>Spreman za iznajmljivanje</p>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ScooterListComponent;