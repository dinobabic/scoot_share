import React, { useEffect, useState } from 'react';
import { BsFillPersonFill, BsCreditCard2BackFill } from "react-icons/bs";
import {AiOutlineMail, AiOutlineIdcard, AiFillFileText} from "react-icons/ai";
import {RiLockPasswordLine} from "react-icons/ri"

const UpdateProfileComponent = (props) => {
    const {username, jwt} = {...props};
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${username}`, {
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
        })
        .then((user) => {
            user["password"] = "";
            user["repeat_password"] = "";
            setUser(user);
        })
    }, []);

    function handleInputChange(attribute, value) {
        let newUser = {...user};
        if (attribute === "repeat_password" || attribute === "password") {
            const errorPassword = document.querySelector(".repeat-password-error");
            if (value !== user.password) {
                errorPassword.classList.remove("hidden");
                errorPassword.classList.add("flex");
            }
            else {
                errorPassword.classList.add("hidden");
                errorPassword.classList.remove("flex");
            }
        }
        newUser[attribute] = value;
        setUser(newUser);
    }

    function updateUser(event) {
        event.preventDefault();
        let hasError = false;
        if (user.firstName === "") {
            hasError = true;
            const error = document.querySelector(".first-name-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".first-name-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.lastName === "") {
            hasError = true;
            const error = document.querySelector(".last-name-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".last-name-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.nickname === "") {
            hasError = true;
            const error = document.querySelector(".nickname-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".nickname-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.username === "") {
            hasError = true;
            const error = document.querySelector(".username-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".username-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.cardNumber === "") {
            hasError = true;
            const error = document.querySelector(".card-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".card-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.password == null || (user.password.length < 8 && !user.password.length == 0)) {
            hasError = true;
            const error = document.querySelector(".password-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".password-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.password !== user.repeat_password) {
            hasError = true;
            const error = document.querySelector(".repeat-password-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".repeat-password-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }

        if (!hasError) {
            const {firstName, lastName, nickname, cardNumber, email, password, username, showFirstName, showLastName, showNickname, showEmail} = {...user};
            const newUser = {firstName, lastName, nickname, cardNumber, email, password, username, showFirstName, showLastName, showNickname, showEmail};
            fetch(`/api/users/update`, {
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                method: "PUT",
                body: JSON.stringify(newUser)
            });
        }
    }

    const changeVisibility = (attribute, value) => {
        let newUser = {...user};
        newUser[attribute] = value;
        setUser(newUser);
    }

    return (
        user && 
        <>
            <div className='flex-row mx-auto justify-center w-4/5 md:w-3/5 lg:w-2/5 mt-20 rounded-lg shadow-lg bg-white'>
                <div className='bg-blue-500 h-2 rounded-lg'></div>
                <div className='mb-10 flex justify-center align-center mt-8'>
                    <p className='font-monoy text-4xl font-semibold'>Podatci dostupni za ažuriranje</p>
                </div>
                <form className='flex-row px-20'>
                    <div className='flex justify-between items-center mb-10'>
                        <div className='flex rounded-sm shadow-md w-4/6'>
                            <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <BsFillPersonFill size={35} />
                            </div>
                            <div className='w-full'>
                                <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    placeholder='Ime'
                                    type="text"
                                    value={user.firstName}
                                    onChange={(event) => handleInputChange("firstName", event.target.value)}/>
                            </div>
                        </div>
                        {user.showFirstName ?
                            <p 
                                onClick={() => changeVisibility("showFirstName", false)}
                                className='text-green-500 hover:text-red-500 cursor-pointer text-md font-semibold'>Vidljivo</p>
                        :
                            <p 
                            onClick={() => changeVisibility("showFirstName", true)}
                                className='text-red-500 hover:text-green-500 cursor-pointer text-md font-semibold'>Skriveno</p>
                        }
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden first-name-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno ime.</p>
                    </div>
                    <div className='flex justify-between items-center mb-10'>
                        <div className='flex rounded-sm shadow-md w-4/6'>
                            <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <BsFillPersonFill size={35} />
                            </div>
                            <div className='w-full'>
                                <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    placeholder='Prezime'
                                    type="text"
                                    value={user.lastName}
                                    onChange={(event) => handleInputChange("lastName", event.target.value)}/>
                            </div>
                        </div>
                        {user.showLastName ?
                            <p
                                onClick={() => changeVisibility("showLastName", false)}
                                className='text-green-500 hover:text-red-500 cursor-pointer text-md font-semibold'>Vidljivo</p>
                        :
                            <p 
                                onClick={() => changeVisibility("showLastName", true)}
                                className='text-red-500 hover:text-green-500 cursor-pointer text-md font-semibold'>Skriveno</p>
                        }
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden last-name-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno prezime.</p>
                    </div>
                    <div className='flex justify-between items-center mb-10'>
                        <div className='flex rounded-sm shadow-md w-4/6 relative'>
                            <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <BsFillPersonFill size={35} />
                            </div>
                            <div className='w-full'>
                                <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    placeholder='Nadimak'
                                    type="text"
                                    value={user.nickname}
                                    onChange={(event) => handleInputChange("nickname", event.target.value)}/>
                            </div>
                        </div>
                        {user.showNickname ?
                            <p 
                                onClick={() => changeVisibility("showNickname", false)}
                                className='text-green-500 hover:text-red-500 cursor-pointer text-md font-semibold'>Vidljivo</p>
                        :
                            <p 
                                onClick={() => changeVisibility("showNickname", true)}
                                className='text-red-500 hover:text-green-500 cursor-pointer text-md font-semibold'>Skriveno</p>
                        }
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden nickname-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravan nadimak.</p>
                    </div>
                    <div className='flex justify-between items-center mb-10'>
                        <div className='flex rounded-sm shadow-md w-4/6 relative'>
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
                        <p className='text-green-500 text-md font-semibold'>Uvijek vidljivo</p>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden username-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno korisničko ime.</p>
                    </div>
                    <div className='flex justify-between items-center mb-10'>
                        <div className='flex rounded-sm shadow-md w-4/6'>
                            <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                                <AiOutlineMail size={35} />
                            </div>
                            <div className='w-full'>
                                <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                    disabled
                                    placeholder='Email'
                                    type="email"
                                    value={user.email}
                                    onChange={(event) => handleInputChange("email", event.target.value)}/>
                            </div>
                        </div>
                        {user.showEmail ?
                            <p 
                                onClick={() => changeVisibility("showEmail", false)}
                                className='text-green-500 hover:text-red-500 cursor-pointer text-md font-semibold'>Vidljivo</p>
                        :
                            <p 
                                onClick={() => changeVisibility("showEmail", true)}
                                className='text-red-500 hover:text-green-500 cursor-pointer text-md font-semibold'>Skriveno</p>
                        }
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
                    <div className='justify-end -mt-8 mb-8 hidden password-error'>
                        <p className='text-md text-red-500'>Lozinka mora imati barem 8 znakova.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10 relative'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                            <RiLockPasswordLine size={35} />
                        </div>
                        <div className='w-full'>
                            <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                placeholder='Potvrdi lozinku'
                                type="password"
                                value={user.repeat_password}
                                onChange={(event) => handleInputChange("repeat_password", event.target.value)}/>
                        </div>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden repeat-password-error'>
                        <p className='text-md text-red-500'>Lozinke se ne podudaraju.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                            <BsCreditCard2BackFill size={35} />
                        </div>
                        <div className='w-full'>
                            <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                placeholder='Broj kartice'
                                type="text"
                                value={user.cardNumber}
                                onChange={(event) => handleInputChange("cardNumber", event.target.value)}/>
                        </div>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden card-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravan broj kartice.</p>
                    </div>
                    <div className='flex justify-center px-10 py-8'>
                        <button type='button' className='text-xl font-semibold px-8 py-3 bg-blue-500 text-white rounded-xl' onClick={updateUser} >Potvrdi</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateProfileComponent;