import React from 'react';
import '../App.css'
import ChangePassword from './ChangePassword'
import SignOutButton from "./SignOut";

function Account() {
    return (
        <div>
            <h2>Account Page</h2>
            <ChangePassword/>
            <SignOutButton/>
        </div>
    );
}

export default Account;