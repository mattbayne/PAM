import React from 'react';
import {doSignOut} from "../firebase/FirebaseFunctions";
import '../App.css'
import {Navigate} from "react-router-dom";

function LogOutButton() {
    return <button type='button' onClick={doSignOut}>Sign Out</button>
}

const LogOut = () => {
    doSignOut()
    return <Navigate to='/login' />
}

export {LogOutButton};
export default LogOut;