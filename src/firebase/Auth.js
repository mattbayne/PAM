import React, {useState, useEffect} from 'react';
import firebaseAppInit from './Firebase';
import { getAuth } from 'firebase/auth';

firebaseAppInit();

export const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect (() => {
        getAuth().onAuthStateChanged(setCurrentUser)
    }, []);

    return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>;
}