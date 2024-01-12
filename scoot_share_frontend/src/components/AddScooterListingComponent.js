import React, { useEffect, useState } from 'react';

const AddScooterListingComponent = (props) => {
    const {scooterListing, setScooterListing, jwt, scooters, setScooters} = {...props};
    const [listing, setListing] = useState({
        "scooterId": scooterListing.id,
        "location": "",
        "returnLocation": "",
        "returnByTime": new Date(),
        "pricePerKilometer": "",
        "lateReturnPenalty": "",
    });

    useEffect(() => {
        setListing({...listing, "scooterId": scooterListing.id});
    }, [scooterListing, setScooterListing]);

    const updateListing = (value, attribute) => {
        if (attribute === "returnByTime") {
            let oldListing = {...listing};
            oldListing[attribute] = new Date(value);
            setListing(oldListing); 
            return;
        }
        let oldListing = {...listing};
        oldListing[attribute] = value;
        setListing(oldListing);
    };

    const addListing = (event) => {
        event.preventDefault();
        let newListing = {...listing};
        newListing.returnByTime = new Date(listing.returnByTime);

        fetch(`/api/listings/add`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(newListing)
        });
        let newScooters = [...scooters];
        newScooters.forEach((scooter) =>{
            if (scooter.id === listing.scooterId) {
                scooter.hasListing = true;
                scooter.listingIsActive = true;
            }
        });
        setScooters(newScooters);
        setScooterListing(null);
    };

    const cancel = () => {
        setScooterListing(null);
    };

    return (
        <form className='flex flex-col mt-14 shadow-lg rounded-lg w-4/5 md:w-3/5 lg:w-2/5 mx-auto py-4 px-10 bg-white'>
            <div className='mb-8'>
                <p className='text-center text-2xl font-semibold'>Dodajte Romobil u Najam</p>
            </div>

            <p className='text-xl font-semibold'>Oznaka Romobila: {scooterListing.id}</p>

            <div className='my-6 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className='text-md font-semibold' htmlFor='location'>Lokacija Preuzimanja</label>
                    <input id='location' type='text' value={listing.location} 
                        className='w-3/5 rounded-sm shadow-md py-2 px-4 text-xl focus:outline-none'
                        onChange={(event) => updateListing(event.target.value, "location")} />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-md font-semibold' htmlFor='return-loaction'>Lokacija Povratka</label>
                    <input id='return-loaction' type='text' value={listing.returnLocation} 
                        className='w-3/5 rounded-sm shadow-md py-2 px-4 text-xl focus:outline-none'
                        onChange={(event) => updateListing(event.target.value, "returnLocation")} />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-md font-semibold' htmlFor='returnByDate'>Datum Povratka</label>
                    <input id='returnByDate' type='date' value={listing.returnByTime.toISOString().split('T')[0]} 
                        className='w-3/5 rounded-sm shadow-md py-2 px-4 text-xl focus:outline-none'
                        onChange={(event) => updateListing(event.target.value, "returnByTime")} />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-md font-semibold' htmlFor='pricePerKilometer'>Cijena po Kilometru (u eurima)</label>
                    <input id='pricePerKilometer' type='text' value={listing.pricePerKilometer} 
                        className='w-3/5 rounded-sm shadow-md py-2 px-4 text-xl focus:outline-none'
                        onChange={(event) => updateListing(event.target.value, "pricePerKilometer")} />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-md font-semibold' htmlFor='lateReturnPenalty'>Kazna za Kašnjenje (u eurima)</label>
                    <input id='lateReturnPenalty' type='text' value={listing.lateReturnPenalty} 
                        className='w-3/5 rounded-sm shadow-md py-2 px-4 text-xl focus:outline-none'
                        onChange={(event) => updateListing(event.target.value, "lateReturnPenalty")} />
                </div>
            </div>


            <div className='flex justify-center gap-8'>
                <button 
                    onClick={addListing}
                    type='submit' 
                    className='rounded-xl bg-blue-500 cursor-pointer text-white font-semibold py-3 px-6'>
                    Dodaj 
                </button>
                <button 
                    onClick={cancel}
                    type='submit' 
                    className='rounded-xl bg-red-500 cursor-pointer text-white font-semibold py-3 px-6'>
                    Odustani 
                </button>
            </div>
        </form>
    );
};

export default AddScooterListingComponent;