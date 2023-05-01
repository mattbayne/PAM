import React, {useState, useEffect, useContext} from 'react';
import firebaseApp from './Firebase';
import {Navigate, Outlet} from "react-router-dom";


export const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect (() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoadingUser(false);
        });
    }, []);

    return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>;
};

export function AuthenticatedRoute() {
    const {currentUser} = useContext(AuthContext);
    return (currentUser != null) ? <Outlet /> :  <Navigate to='/login' />
}

export function UnauthenticatedRoute() {
    const {currentUser} = useContext(AuthContext);
    return (currentUser == null) ? <Outlet /> :  <Navigate to='/' />
}
