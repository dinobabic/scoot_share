import React, { useEffect, useState } from 'react';

const AddScooterComponent = (props) => {
    const {jwt, setScooters, scooters} = {...props};
    const [scooter, setScooter] = useState({
        "images": []
    }); 

    const updateScooter = (event) => {
        const reader = new FileReader();
        if (event.target.files[0])  {
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                const error = document.querySelector(".error");
                error.classList.add("hidden");
                let oldScooter = {...scooter};
                oldScooter.images.push(event.target.result);
                setScooter(oldScooter); 
            }
        } 
    };

    const addScooter = (event) => {
        event.preventDefault();
        const error = document.querySelector(".error");
        if (scooter.images.length === 0) {
            error.classList.remove("hidden");
        }
        else {
            error.classList.add("hidden");
            fetch(`/api/scooters/add`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(scooter)
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                setScooters([...scooters, data]);
            });
            setScooter({
                "images": []
            });
        }
    };

    return (
        <div className='flex flex-col justify-center items-center w-5/6 md:w-4/6 lg:w-2/6 mx-auto rounded-md shadow-lg p-4 bg-white'>
            <form className='flex flex-col'>
                <div className='mb-8'>
                    <p className='text-center first-letter:text-xl font-semibold'>Dodajte novi Romobil</p>
                </div>
                <div className='mb-6'>
                    <label className='cursor-pointer font-semibold shadow-md rounded-md py-2 px-6 hover:bg-green-200'>Unesite Sliku romobila
                        <input 
                            className='hidden'
                            type="file" 
                            accept='image/*'
                            onChange={(event) => updateScooter(event)} />
                    </label>

                    <div className='mt-5 hidden error'>
                        <p className='text-red-500'>Unesite barem jednu sliku!</p>
                    </div>
                </div>

                <div className='mt-4 grid grid-cols-3 gap-2'>
                    {scooter.images.map((image, index) => {
                        return (
                            <img src={image} alt='Slika romobila' key={index} className='h-36 w-36' />
                        )
                    })}
                </div>

                <div className='flex justify-center'>
                    <button 
                        onClick={addScooter}
                        type='submit' 
                        className='rounded-xl bg-blue-500 cursor-pointer text-white font-semibold py-3 px-6'>
                        Dodaj Romobil
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddScooterComponent;