import React, { useState } from 'react';
import { useEffect } from 'react';
import AdminUserRowComponent from './AdminUserRowComponent';

const AdminUserListComponent = (props) => {
    const {jwt} = {...props};

    const [file, setFile] = useState("");
    const [users, setUsers] = useState(null);

    useEffect(() => {
        fetch("/api/admin/getAllUsers", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((users) => {
            setUsers(users);
        })
    }, []);

    return (
    <div className='mx-auto w-4/5 md:w-3/5 mt-16'>    
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className='flex justify-center my-10 text-3xl font-semibold'>
                Pregled svih korisnika
            </div>
            <div className="flex justify-center pb-4 bg-white dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pretraga korisnika"/>
                </div>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Ime
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Prezime
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nadimak
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Korisničko Ime
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Osobna iskaznica
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Potvrda o nekažnjavanju
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Registracija potvrđena
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Izrbiši korisnika
                        </th>
                    </tr>
                </thead>
                <tbody>     
                    {users && users.map((user) => {
                        return (
                            <AdminUserRowComponent jwt={jwt} username={user.username} key={user.email} authority={user.authority} email={user.email} firstName={user.firstName} lastName={user.lastName} nickname={user.nickname} idCard={user.idCard} certificateOfNoCriminalRecord={user.certificateOfNoCriminalRecord} />
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default AdminUserListComponent;