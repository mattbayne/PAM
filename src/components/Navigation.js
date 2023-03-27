import React from 'react';
import {NavLink} from 'react-router-dom';

function Navigation() {
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

