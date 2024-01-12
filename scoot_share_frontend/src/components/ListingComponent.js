import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ListingComponent = (props) => {
  const {jwtIsValid, canReserveScooter, listing} = {...props};
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className='flex flex-col justify-center items-center py-4 bg-white hover:shadow-md rounded-sm hover:cursor-pointer'>
      <img src={listing.scooterImages[0]} className='w-48'/>
      <p className="text-lg font-semibold">{listing.pricePerKilometer}€</p>
      <p className="text-lg font-semibold">{listing.location}</p>
    </div>
  );
};

export default ListingComponent;