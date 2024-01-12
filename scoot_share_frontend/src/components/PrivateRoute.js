import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
    const {children, jwt, jwtIsValid, clientRole, adminRole} = {...props};

    if (jwtIsValid && jwt !== "") {
        const jwtDecoded = jwtDecode(jwt);
        if (adminRole) {
            if (jwtDecoded.authorities[0].authority === "ROLE_ADMIN") {
                return (
                    children
                );
            }
            else {
                return (
                    <Navigate to={"/"}></Navigate>
                ); 
            }
        }
        else if (clientRole) {
           if (jwtDecoded.authorities[0].authority === "ROLE_CLIENT") {
                return (
                    children
                );
           }
           else {
            return (
                <Navigate to={"/"}></Navigate>
            );
           }
        }
    }
    else {
       return (
            <Navigate to={"/login"}></Navigate>
       );
    }
};

export default PrivateRoute;