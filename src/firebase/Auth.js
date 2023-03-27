import React, {useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import firebaseAppConfig from './Firebase';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseAppConfig);

export const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect (() => {
        getAuth(app).onAuthStateChanged(setCurrentUser)
    }, []);

    return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>;
}