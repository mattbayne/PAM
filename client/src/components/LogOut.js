import React from 'react';
import {doSignOut} from "../firebase/FirebaseFunctions";
import '../App.css'
import {Navigate} from "react-router-dom";
import Button from "@mui/material/Button";

function LogOutButton() {
    return (
        <Button variant="outlined" onClick={doSignOut}>
            Sign Out
        </Button>
    )
}

const LogOut = () => {
    doSignOut()
    return <Navigate to='/login' />
}

export {LogOutButton};
export default LogOut;