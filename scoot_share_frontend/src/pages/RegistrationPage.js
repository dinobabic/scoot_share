import React from 'react';
import NavigationComponent from '../components/NavigationComponent';
import RegistrationComponent from '../components/RegistrationComponent';

const RegistrationPage = (props) => {
    const {jwtIsValid, setJwt} = {...props};
    return (
        <>
            <NavigationComponent displayHomeButton={true} displayLogoutButton={jwtIsValid} displayRegisterButton={false}  displayLoginButton={!jwtIsValid} setJwt={setJwt}/>
            <RegistrationComponent setJwt={setJwt}/>
        </>
    );
};

export default RegistrationPage;