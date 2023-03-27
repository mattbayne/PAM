import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from "../firebase/Auth";
import SignOutButton from "./SignOut";
import '../App.css'

const Navigation = ()=>{
    const {currentUser} = useContext(AuthContext);
    return <div>{currentUser ? <NavigationAuth /> : <NavigationNoAuth /> }</div>
}

const NavigationAuth = ()=>{
    return (
        <nav className='navigation'>
            <ul>
                <li>
                    <NavLink to='/'>Landing</NavLink>
                </li>
                <li>
                    <NavLink to='/private'>Private</NavLink>
                </li>
                <li>
                    <NavLink to='/changepassword'>Change Password</NavLink>
                </li>
            </ul>
        </nav>
    );
}

const NavigationNoAuth = ()=> {
    return (
        <nav className='navigation'>
            <ul>
                <li>
                    <NavLink to='/'>Landing</NavLink>
                </li>
                <li>
                    <NavLink to='/signup'>Sign-up</NavLink>
                </li>
                <li>
                    <NavLink to='/signin'>Sign-In</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;

