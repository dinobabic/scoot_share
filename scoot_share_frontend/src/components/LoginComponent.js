import React, { useState } from 'react';
import { BsFillPersonFill } from "react-icons/bs";
import {RiLockPasswordLine} from "react-icons/ri"
import { useNavigate } from 'react-router-dom';


const LoginComponent = (props) => {
    const {setJwt, setUsername} = {...props};
    const [user, setUser] = useState({
        "username": "",
        "password":""
    });
    const navigate = useNavigate();

    function handleInputChange(attribute, value) {
        let newUser = {...user};
        newUser[attribute] = value
        setUser(newUser);
    }
    function loginUser(event) {
        event.preventDefault();
        fetch("/api/auth/authenticate", {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(user)
          })
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
          })
          .then((data) => {
            if (data == undefined) {
                document.querySelector(".error-invalid-credentials").classList.remove("hidden");
                document.querySelector(".error-invalid-credentials").classList.add("flex");
            }
            else {
                setUsername(user.username);
                setJwt(data.token)
                navigate("/")
            }
            
          })
    }

    function cancel() {
        navigate("/");
    }

    return (
        <>
            <div className='flex-row mx-auto justify-center w-4/5 md:w-3/5 lg:w-2/5 my-20 rounded-lg shadow-lg'>
                <div className='bg-blue-500 h-2 rounded-lg'></div>
                <div className='mb-10 flex justify-center align-center mt-8'>
                    <p className='font-monoy text-3xl font-semibold'>Prijavi se</p>
                </div>
                <div className='mb-10 justify-center align-center mt-8 error-invalid-credentials hidden'>
                    <p className='font-monoy text-xl font-semibold text-red-500'>Greška prilikom prijave. Pokušajte ponovo.</p>
                </div>
                <form  className='flex-row px-20'>
                    <div className='flex rounded-sm shadow-md mb-10'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <BsFillPersonFill size={35} />
                        </div>
                        <div className='w-full'>
                            <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    placeholder='Korisničko Ime'
                                    type="text"
                                    value={user.username}
                                    onChange={(event) => handleInputChange("username", event.target.value)}/>
                        </div>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10 relative'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <RiLockPasswordLine size={35} />
                        </div>
                        <div className='w-full'>
                            <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    placeholder='Lozinka'
                                    type="password"
                                    value={user.password}
                                    onChange={(event) => handleInputChange("password", event.target.value)}/>
                        </div>
                    </div>
                    <div className="flex  justify-between px-10 py-8">
                    <button type='button' className='text-xl font-semibold px-8 py-3 bg-red-400 text-white rounded-xl' onClick={cancel}>Odustani</button>
                        <button
                            type="submit"
                            className="text-xl font-semibold px-8 py-3 bg-blue-500 text-white rounded-xl"
                            onClick={loginUser}> 
                            Potvrdi
                        </button>
                    </div>
                </form>
            </div>
        </> 
    );
};






export default LoginComponent;