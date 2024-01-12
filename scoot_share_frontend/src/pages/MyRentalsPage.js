import React, { useEffect, useState } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const MyRentalsPage = (props) => {
    const {jwtIsValid, setJwt, username, jwt, notifications, setNotifications} = {...props};
    const [rentals, setRentals] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndexImages, setCurrentIndexImages] = useState([]);
    const navigate = useNavigate();
    const [imageChangeRequest, setImageChangeRequest] = useState({
        "scooterId": "",
        "oldImage": "",
        "replacementImage": "",
        "message": ""
    });

    useEffect(() => {
        fetch(`/api/rentals/getRentalsForUser/${username}`, {
            headers: {
              "Authorization": `Bearer ${jwt}`,
              "Content-Type": "application/json"
            },
            method: "GET",
          })
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
          })
          .then((data) => {
            setRentals(data);
          })
    }, []);

    useEffect(() => {
        if (rentals) {
            fetchListings();
            setLoading(false);
        }
    }, [rentals, setRentals]);

    const fetchListings = async () => {
        const tmpListings = [];
      
        const fetchPromises = rentals.map((rental) => {
          return fetch(`/api/listings/getOneListing/${rental.listingId}`, {
            headers: {
              "Authorization": `Bearer ${jwt}`,
              "Content-Type": "application/json"
            },
            method: "GET",
          })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            tmpListings.push(data);
          });
        });
      
        try {
          await Promise.all(fetchPromises);
          setListings(tmpListings);
        } catch (error) {
          console.error("Error fetching listings:", error);
        }
      };

    useEffect(() => {
        if (listings) {
            let tmpCurrentIndexImages = [];
            listings.forEach((listing) => {
                tmpCurrentIndexImages.push({"id": listing.id, "index": 0});
            });

            setCurrentIndexImages(tmpCurrentIndexImages);
        }
    }, [listings]);

    const changeCurrentImage = (action, listing) => {
        if (action === "increase") {
            const tmpCurrentIndexImages = [...currentIndexImages];
            tmpCurrentIndexImages.forEach((el) => {
                if (el.id === listing.id && el.index < listing.scooterImages.length - 1) {
                    el.index += 1;
                }
            });
            setCurrentIndexImages(tmpCurrentIndexImages);
        }
        else {
            const tmpCurrentIndexImages = [...currentIndexImages];
            tmpCurrentIndexImages.forEach((el) => {
                if (el.id === listing.id && el.index > 0) {
                    el.index -= 1;
                }
            });
            setCurrentIndexImages(tmpCurrentIndexImages);
        }
    }

    const chatWithOwner = (owner) => {
        fetch(`/api/messages/createChatRoom/${owner}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        });

        navigate("/chat");
    }

    const displayReplaceImageButton = (el, action) => {
        if (action) {
            document.querySelector(`.${el}`).classList.remove("hidden");
        }
        else {
            document.querySelector(`.${el}`).classList.add("hidden");
        }
    }

    const changeImageRequest = (listing, imageIndex) => {
        document.querySelector(".new-image").classList.remove("hidden");
        let newImageChangeRequest = imageChangeRequest;
        newImageChangeRequest.scooterId = listing.scooterId;
        newImageChangeRequest.oldImage = listing.scooterImages[imageIndex];
        setImageChangeRequest(newImageChangeRequest);
    }

    const handleFileInputChange = (event, attribute) => {
        const reader = new FileReader();
        if (event.target.files[0])  {
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                let newImageChangeRequest = {...imageChangeRequest};
                newImageChangeRequest[attribute] = event.target.result;
                setImageChangeRequest(newImageChangeRequest);
            }
        }
    }

    const updateImageChangeRequest = (value) => {
        let newImageChangeRequest = {...imageChangeRequest};
        newImageChangeRequest.message = value;
        setImageChangeRequest(newImageChangeRequest);
    }

    const closeImageModal = () => {
        document.querySelector(".new-image").classList.add("hidden");
        setImageChangeRequest({
            "scooterId": "",
            "oldImage": "",
            "replacementImage": "",
            "message": ""
        });
        document.querySelector(".message-error").classList.add("hidden");
        document.querySelector(".replacement-image-error").classList.add("hidden");
        document.querySelector(".success-message").classList.add("hidden");
    }

    const changeImage = () => {
        let error = false;
        if (imageChangeRequest.message === "") {
            document.querySelector(".message-error").classList.remove("hidden");
            error = true;
        }
        else {
            document.querySelector(".message-error").classList.add("hidden");
        }

        if (imageChangeRequest.replacementImage === "") {
            document.querySelector(".replacement-image-error").classList.remove("hidden");
            error = true;
        }
        else {
            document.querySelector(".replacement-image-error").classList.add("hidden");
        }

        if (error) 
            return;

        fetch(`/api/imageChanges/save`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(imageChangeRequest)
        })
        .then((response) => {
        if (response.ok) {
            return response.json()
        }
        })
        .then((data) => {
            document.querySelector(".success-message").classList.remove("hidden");
            setImageChangeRequest({
                "scooterId": "",
                "oldImage": "",
                "replacementImage": "",
                "message": ""
            });
            document.querySelector(".message-error").classList.add("hidden");
            document.querySelector(".replacement-image-error").classList.add("hidden");
        })
    }

    const returnScooter = (rental) => {
        fetch(`/api/rentals/returnScooter`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(rental)
        });

        let tmpRentals = rentals.filter((tmp) => tmp.listingId !== rental.listingId);
        setRentals(tmpRentals);
    }

    return (
        <div className='min-h-screen bg-blue-50 pb-20'>
            <NavigationComponent displayTransactionsButton={jwtIsValid} displayProfileButton={true} setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} displayChatButton={true} displayHomeButton={true} displayRentScooterButton={true}  displayLogoutButton={true} displayRegisterButton={false} displayLoginButton={false} setJwt={setJwt}/>   
            <div id="default-modal" tabIndex="-1" aria-hidden="true" className="new-image hidden absolute z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-200 bg-opacity-50">
              <div className="relative p-4 w-full max-w-2xl max-h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                          <p className='text-2xl font-semibold'>Unesite novu sliku i razlog zamjene</p>
                          <button onClick={closeImageModal}
                            type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                              </svg>
                              <span className="sr-only">Close modal</span>
                          </button>
                      </div>
                      <div className="p-4 md:p-5 space-y-4 flex flex-col gap-4">
                        <div className='flex rounded-sm shadow-md'>
                            <div className='w-full flex justify-center items-center'>
                                <label className='pl-4 focus:outline-none text-xl w-full text-center cursor-pointer font-semibold py-2 shadow-lg rounded-md'>
                                    {imageChangeRequest.replacementImage === "" ? "Zamjenska Slika" : "Zamjenska Slika: Uneseno"}
                                    <input className='hidden'
                                        type="file"
                                        accept='image/*'
                                        value={imageChangeRequest.value}
                                        onChange={(event) => handleFileInputChange(event, "replacementImage")}/>
                                </label>
                            </div>
                        </div>
                        <div className='justify-end hidden replacement-image-error'>
                            <p className='text-md text-red-500'>Molimo unesite zamjensku sliku.</p>
                        </div>
                        <div className='flex flex-row gap-4 items-center'>
                            <label className='text-md font-semibold min-w-fit'>Razlog zamjene</label>
                            <input 
                                onChange={(event) => updateImageChangeRequest(event.target.value)}
                                type='text' value={imageChangeRequest.message} className='w-full focus:outline-none rounded-md shadow-lg text-xl py-2 px-4'/>
                        </div>
                        <div className='justify-end hidden message-error'>
                            <p className='text-md text-red-500'>Molimo unesite razlog zamjene.</p>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <p className='font-semibold text-lg text-green-500 hidden success-message'>Vaš zahtjev je pohranjen. Bit ćete obavješteni o ishodu.</p>
                            <button className='text-white bg-slate-800 font-semibold text-lg rounded-lg cursor-pointer py-2 px-3'
                                onClick={changeImage}>Zamijeni</button>
                            <button className='text-white bg-red-600 font-semibold text-lg rounded-lg cursor-pointer py-2 px-3'
                                onClick={closeImageModal}>Odustani</button>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            {loading ? 
                <div role="status" className='flex flex-row justify-center mt-4'>
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            :
            listings && currentIndexImages && currentIndexImages.length > 0 &&
                rentals.map((rental) => {
                    return (
                        listings.filter((listing) => listing.id === rental.listingId).map((listing, index) => {
                            const imageIndex = currentIndexImages.filter((el) => el.id === listing.id)[0].index;
                            return (
                                <div key={index} className='w-4/6 mx-auto mt-16'>
                                    <div className='flex flex-row gap-16'>
                                        <div className='flex flex-row gap-6 items-center'>
                                            <FaArrowLeft 
                                                onClick={() => changeCurrentImage("decrease", listing)}
                                                className={`left-arrow text-2xl ${imageIndex === 0 ? "text-gray-300" : "cursor-pointer"}`}/>
                                            <div 
                                                onClick={() => changeImageRequest(listing, imageIndex)}
                                                onMouseOver={() => displayReplaceImageButton(`button_${listing.id}_${imageIndex}`, true)}
                                                onMouseLeave={() => displayReplaceImageButton(`button_${listing.id}_${imageIndex}`, false)} 
                                                className='relative'>
                                                <button className={`button_${listing.id}_${imageIndex} hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80 shadow-md font-semibold text-lg bg-white rounded-lg p-2`}>Klikni na sliku za zamjenu</button>
                                                <img src={listing.scooterImages[imageIndex]} className='max-h-96 shadow-lg cursor-pointer'/>
                                            </div>
                                            <FaArrowRight 
                                                onClick={() => changeCurrentImage("increase", listing)}
                                                className={`right-arrow text-2xl ${imageIndex === listing.scooterImages.length - 1 ? "text-gray-300" : "cursor-pointer"}`} />
                                        </div>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Lokacija preuzimanja: <span className='font-semibold'>{listing.location}</span></p>
                                            </div>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Lokacija povratka: <span className='font-semibold'>{listing.returnLocation}</span></p>
                                            </div>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Vrijeme povratka: <span className='font-semibold'>{`${(new Date(listing.returnByTime).getFullYear())}-${(new Date(listing.returnByTime)).getDate()}-${(new Date(listing.returnByTime)).getMonth()+1}`}</span></p>
                                            </div>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Cijena po kilometru: <span className='font-semibold'>{listing.pricePerKilometer}€</span></p>
                                            </div>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Kazna u slučaju kašnjenja: <span className='font-semibold'>{listing.lateReturnPenalty}€</span></p>
                                            </div>
                                            <div className='flex gap-4 items-center'>
                                                <FaArrowRightLong className='text-xl text-gray-400'/>
                                                <p className='text-xl'>Početak najma: <span className='font-semibold'>{`${(new Date(rental.rentalTimeStart).getFullYear())}-${(new Date(rental.rentalTimeStart)).getDate()}-${(new Date(rental.rentalTimeStart)).getMonth()+1}`}</span></p>
                                            </div>
                                            <div className='flex flex-row gap-8 mt-6'>
                                                <button 
                                                    onClick={() => returnScooter(rental)}
                                                    className='bg-green-500 text-white font-semibold text-xl rounded-lg py-2 px-3 hover:bg-green-700'>Vrati romobil</button>
                                                <button 
                                                    onClick={() => chatWithOwner(rental.scooterOwner)}
                                                    className='bg-slate-800 text-white font-semibold text-xl rounded-lg py-2 px-3 hover:bg-slate-700'>Kontaktiraj vlasnika</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    );
                })
            }
        </div>
    );
};

export default MyRentalsPage;