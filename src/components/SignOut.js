import React from 'react';
import {doSignOut} from "../firebase/FirebaseFunctions";
import '../App.css'

const SignOutButton = () => {
    return (
        <button type='button' onClick={doSignOut}>Sign Out</button>
    );
}

export default SignOutButton;