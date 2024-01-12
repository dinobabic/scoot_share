import React, { useEffect } from 'react';
import NavigationComponent from '../components/NavigationComponent';
import LoginComponent from '../components/LoginComponent';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
    const {jwtIsValid, setJwt, setUsername} = {...props};
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtIsValid) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <NavigationComponent displayHomeButton={true} displayLoginButton={false} displayLogoutButton={false} displayRegisterButton={true} setJwt={setJwt}/>
            <LoginComponent setJwt={setJwt} setUsername={setUsername}/>
        </>
    )
};


export default LoginPage;
