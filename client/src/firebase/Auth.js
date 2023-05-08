import React, {useState, useEffect, useContext} from 'react';
import firebaseApp from './Firebase';
import {Navigate, Outlet} from "react-router-dom";
import axios from "axios";


export const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [avatar, setAvatar] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    // const [loadingUser, setLoadingUser] = useState(true);

    useEffect (() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            // setLoadingUser(false);
        });
    }, []);

    useEffect(()=>{
        console.log('changing avatar')
        async function updateAvatar() {
            console.log(currentUser)
            if (currentUser && currentUser['_delegate']) {
                const email = currentUser['_delegate']['email'];
                try {
                    const rawResult = await axios.get(`http://localhost:3001/user/${email}`)
                    const mongoPicture = rawResult['data']['profileImage']
                    if (mongoPicture) {
                        setAvatar(mongoPicture)
                    } else if (currentUser.providerData[0].providerId === 'google.com'){
                        console.log("did not find pic in mongo, defaulting to google")
                        console.log(currentUser['_delegate'])
                        setAvatar(currentUser['_delegate']['photoURL'])
                    } else {
                        setAvatar(null)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        updateAvatar()
    }, [currentUser])

    return <AuthContext.Provider value={{currentUser, avatar, setAvatar}}>{children}</AuthContext.Provider>;
};

export function AuthenticatedRoute() {
    const {currentUser} = useContext(AuthContext);
    return (currentUser != null) ? <Outlet /> :  <Navigate to='/login' />
}

export function UnauthenticatedRoute() {
    const {currentUser} = useContext(AuthContext);
    return (currentUser == null) ? <Outlet /> :  <Navigate to='/' />
}
