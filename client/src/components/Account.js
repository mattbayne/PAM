import React from 'react';
import '../App.css'
import ChangePassword from './ChangePassword'
import {LogOutButton} from "./LogOut";

function Account() {
    return (
        <div>
            <h2>Account Page</h2>
            <ChangePassword/>
            <LogOutButton/>
        </div>
    );
}

export default Account;
