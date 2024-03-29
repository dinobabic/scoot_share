import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';

const AdminImageChangeRequestsPage = (props) => {
    const {setJwt, jwt, username, notifications, setNotifications} = {...props};
    const [imageChangeRequests, setImageChangeRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/imageChanges/getAll`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`,
            },
            method: "GET",
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((response) => {
            setImageChangeRequests(response);
            setLoading(false);
        });
    }, []);

    const saveChangeRequest = (request) => {
        fetch(`/api/imageChanges/performReplacement/${request.id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`,
            },
            method: "PUT",
        });
        let tmpRequests = imageChangeRequests;
        tmpRequests = tmpRequests.filter((tmpRequest) => tmpRequest.id !== request.id);
        setImageChangeRequests(tmpRequests);
    }

    const deleteChangeRequest = (request) => {
        fetch(`/api/imageChanges/deleteById/${request.id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`,
            },
            method: "DELETE",
        });
        let tmpRequests = imageChangeRequests;
        tmpRequests = tmpRequests.filter((tmpRequest) => tmpRequest.id !== request.id);
        setImageChangeRequests(tmpRequests);
    }

    return (
        <div className='min-h-screen bg-blue-50'>
            <NavigationComponent displayHomeButton={true} displayImageChangeRequestsButton={false} displayAdminPage={true} jwt={jwt} setNotifications={setNotifications} notifications={notifications} username={username} displayLogoutButton={true} displayRegisterButton={false} displayLoginButton={false} setJwt={setJwt}/>  
            <div className='w-5/6 mx-auto mt-16'>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                Stara Slika
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Nova Slika
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Razlog Zamjene
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Odluka
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? 
                            <tr>
                                <td></td>
                                <td>
                                    <div role="status" className='flex flex-row justify-center mt-4'>
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        :
                        imageChangeRequests.map((request, index) => {
                            return (
                                <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td>
                                        <div className='flex justify-center my-4'>
                                            <img src={request.oldImage} className='h-48'/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='flex justify-center my-4'>
                                            <img src={request.replacementImage} className='h-48'/>
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <p className='text-lg'>{request.message}</p>
                                    </td>
                                    <td className='text-center'>
                                        <div className='flex justify-center flex-row gap-2'>
                                            <p 
                                                onClick={() => saveChangeRequest(request)}
                                                className='font-semibold text-xl hover:text-green-500 cursor-pointer'>Prihvati</p>
                                            <p 
                                                onClick={() => deleteChangeRequest(request)}
                                                className='font-semibold text-xl hover:text-red-500 cursor-pointer'>Odbaci</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminImageChangeRequestsPage;