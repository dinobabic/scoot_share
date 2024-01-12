import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const AdminUserRowComponent = (props) => {
    const {jwt, username, authority, firstName, lastName, nickname, idCard, certificateOfNoCriminalRecord, email} = {...props};

    function donwloadIdCard() {
        const a = document.createElement("a");
        a.href = idCard;
        a.download = "image.jpg";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function downloadCriminalRecord() {
        const a = document.createElement("a");
        a.href = certificateOfNoCriminalRecord;
        a.download = "criminalRecord.pdf";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function deleteUser() {
        fetch(`/api/admin/deleteUser/${username}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
        .then((response) => {
            window.location.reload();
        })
    }

    function updateRoleToClient() {
        fetch(`/api/admin/acceptUser/${username}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "PUT"
        })
        .then((response) => {
            window.location.reload();
        })
    }

    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {firstName}
            </th>
            <td className="px-6 py-4">
                {lastName}
            </td>
            <td className="px-6 py-4">
                {nickname}
            </td>
            <td className="px-6 py-4">
                {username}
            </td>
            <td className="px-6 py-4">
                {email}
            </td>
            <td className="px-6 py-4">
                <label className='focus:outline-none cursor-pointer' onClick={donwloadIdCard}>
                    Osobna Iskaznica
                </label>
            </td>
            <td className="px-6 py-4">
                <label className='focus:outline-none cursor-pointer'
                onClick={downloadCriminalRecord}>
                    Potvrda o nekažnjavanju
                </label>
            </td>
            <td className="px-6 py-4">
                {authority === "ROLE_PENDING_REGISTRATION" ?
                    <label className='focus:outline-none cursor-pointer text-red-500'
                        onClick={updateRoleToClient}>
                        Potvrdi
                    </label>
                    :
                    <label className='focus:outline-none cursor-pointer text-green-500'>
                        Potvrđeno
                    </label>
                }
            </td>
            <td className="px-6 py-4">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                onClick={deleteUser}>Izbriši</a>
            </td>
         </tr>
    );
};

export default AdminUserRowComponent;