import React, { useState } from 'react';
import { BsFillPersonFill, BsCreditCard2BackFill } from "react-icons/bs";
import {AiOutlineMail, AiOutlineIdcard, AiFillFileText} from "react-icons/ai";
import {RiLockPasswordLine} from "react-icons/ri"
import { useNavigate } from 'react-router-dom';

const RegistrationComponent = (props) => {
    const {setJwt} = {...props};
    const [user, setUser] = useState({
        "firstName": "",
        "lastName": "",
        "nickname": "",
        "password": "",
        "repeat_password": "",
        "cardNumber": "",
        "email": "",
        "idCard": null,
        "certificateOfNoCriminalRecord": null,
        "username": ""
    });
    const navigate = useNavigate();

    function handleInputChange(attribute, value) {
        let newUser = {...user};
        if (attribute === "cardNumber") {
            if (value.split(" ").join("").length % 4 === 0) {
                if (user[attribute].length < value.length) {
                    value += " ";
                }
                else {

                    value = value.substr(0, value.length - 1)
                }
            }
        }
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

    function handleFileInputChange(event, attribute) {
        const reader = new FileReader();
        if (event.target.files[0])  {
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                let newUser = {...user};
                newUser[attribute] = event.target.result;
                setUser(newUser);
            }
        }
    }

    function registerUser(event) {
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
        if (!isValidEmail(user.email)) {
            hasError = true;
            const error = document.querySelector(".email-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".email-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.idCard == null) {
            hasError = true;
            const error = document.querySelector(".id-card-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".id-card-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.idCard == null) {
            hasError = true;
            const error = document.querySelector(".criminal-record-error");
            error.classList.remove("hidden");
            error.classList.add("flex");
        }
        else {
            const error = document.querySelector(".criminal-record-error");
            error.classList.add("hidden");
            error.classList.remove("flex");
        }
        if (user.password == null || user.password.length < 8) {
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
            const formData = new FormData();
            formData.append("idCard", user.idCard);
            formData.append("criminalRecord", user.certificateOfNoCriminalRecord);
            const {firstName, lastName, nickname, cardNumber, email, password, username} = {...user};
            const newUser = {firstName, lastName, nickname, cardNumber, email, password, username};
            formData.append("user", JSON.stringify(newUser));

             const fetchData = {
                headers: {
                    Authorization: `Bearer `
                },
                method: "POST",
                body: formData
            };

            fetch("/api/auth/register", fetchData)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    setJwt(data.token);
                    navigate("/");
                })
        }
    }

    function isValidEmail(email) {
    // Regular expression for basic email format validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    // Test the email against the regular expression
    return emailPattern.test(email);
    }

      function resetForm() {
        navigate("/")
      }

    return (
        <>
            <div className='flex-row mx-auto justify-center w-4/5 md:w-3/5 lg:w-2/5 my-20 rounded-lg shadow-lg'>
                <div className='bg-blue-500 h-2 rounded-lg'></div>
                <div className='mb-10 flex justify-center align-center mt-8'>
                    <p className='font-monoy text-4xl font-semibold'>Dobrodošli u ScootShare!</p>
                </div>
                <form className='flex-row px-20'>
                    <div className='flex rounded-sm shadow-md mb-10'>
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
                    <div className='justify-end -mt-8 mb-8 hidden first-name-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno ime.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10'>
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
                    <div className='justify-end -mt-8 mb-8 hidden last-name-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno prezime.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10 relative'>
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
                    <div className='justify-end -mt-8 mb-8 hidden nickname-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravan nadimak.</p>
                    </div>
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
                    <div className='justify-end -mt-8 mb-8 hidden username-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravno korisničko ime.</p>
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
                    <div className='flex rounded-sm shadow-md mb-10'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                            <AiOutlineMail size={35} />
                        </div>
                        <div className='w-full'>
                            <input className='w-full h-full pl-4 focus:outline-none text-xl'
                                placeholder='Email'
                                type="email"
                                value={user.email}
                                onChange={(event) => handleInputChange("email", event.target.value)}/>
                        </div>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden email-error'>
                        <p className='text-md text-red-500'>Molimo unesite ispravan email.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                            <AiOutlineIdcard size={35} />
                        </div>
                        <div className='w-full flex justify-center items-center'>
                            <label className='pl-4 focus:outline-none text-xl w-full text-center cursor-pointer'>
                                {user.idCard == null ? "Osobna Iskaznica" : "Osobna Iskaznica: Uneseno"}
                                <input className='hidden'
                                    type="file"
                                    accept='image/*'
                                    onChange={(event) => handleFileInputChange(event, "idCard")}/>
                            </label>
                        </div>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden id-card-error'>
                        <p className='text-md text-red-500'>Molimo unesite kopiju osobne iskaznice.</p>
                    </div>
                    <div className='flex rounded-sm shadow-md mb-10'>
                        <div className='flex justfiy-center align-middle bg-gray-200 p-2'>
                            <AiFillFileText size={35} />
                        </div>
                        <div className='w-full flex justify-center items-center'>
                            <label className='pl-4 focus:outline-none text-xl w-full text-center cursor-pointer'>
                                {user.certificateOfNoCriminalRecord == null ? "Potvrda o nekažnjavanju" : "Potvrda o nekažnjavanju: Uneseno"}
                                <input className='hidden'
                                    type="file"
                                    accept='application/pdf'
                                    onChange={(event) => handleFileInputChange(event, "certificateOfNoCriminalRecord")}/>
                            </label>
                        </div>
                    </div>
                    <div className='justify-end -mt-8 mb-8 hidden criminal-record-error'>
                        <p className='text-md text-red-500'>Molimo unesite potvrdu o nekažnjavanju.</p>
                    </div>
                    <div className='flex justify-between px-10 py-8'>
                        <button type='button' className='text-xl font-semibold px-8 py-3 bg-red-400 text-white rounded-xl' onClick={resetForm}>Odustani</button>
                        <button type='submit' className='text-xl font-semibold px-8 py-3 bg-blue-500 text-white rounded-xl' onClick={registerUser}>Potvrdi</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegistrationComponent;