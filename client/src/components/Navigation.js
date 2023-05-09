// import React, {useContext} from 'react';
// import {NavLink} from 'react-router-dom';
// import {AuthContext} from "../firebase/Auth";
// import SignOutButton from "./LogOut";
// import '../App.css'
//
// const Navigation = ()=>{
//     const {currentUser} = useContext(AuthContext);
//     return <div>{currentUser ? <NavigationAuth /> : <NavigationNoAuth /> }</div>
// }
//
// const NavigationAuth = ()=>{
//     return (
//         <nav className='navigation'>
//             <ul>
//                 <li>
//                     <NavLink to='/'>Landing</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to='/private'>Private</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to='/changepassword'>Change Password</NavLink>
//                 </li>
//             </ul>
//         </nav>
//     );
// }
//
// const NavigationNoAuth = ()=> {
//     return (
//         <nav className='navigation'>
//             <ul>
//                 <li>
//                     <NavLink to='/'>Landing</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to='/signup'>Sign-up</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to='/signin'>Sign-In</NavLink>
//                 </li>
//             </ul>
//         </nav>
//     );
// }
//
// export default Navigation;
//

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../img/logo.jpeg'
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../firebase/Auth";
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";
import noUser from '../img/noUser.webp'


const pages = ['Products', 'Pricing', 'Blog'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    // const [avatar, setAvatar] = useState(null)

    const { currentUser, avatar } = useContext(AuthContext);
    const settings = currentUser
        ? ["Account", "Dashboard", "Logout"]
        : ["Login", "Signup"];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{backgroundColor: 'black'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 0, width: '150px', height: '150px', display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                        <NavLink to="/">
                            <img src={logo} alt='logo' style={{ maxWidth: '100%', maxHeight: '100%' }} draggable="false" />
                        </NavLink>
                    </Box>
                    <Typography
                        variant="h1"
                        noWrap
                        fontSize="45px"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            ml: 2,
                        }}
                    >
                        Personalized Assistant & Manager
                    </Typography>
                    <NavLink to='/' style={{color: 'inherit'}}>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    </NavLink>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        PAM
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open navigation menu">
                            {currentUser ? (
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="You"
                                            src={avatar || noUser}
                                            imgProps={{ referrerPolicy: "no-referrer" }}
                                    />
                                </IconButton>
                            ) : (
                                <IconButton onClick={handleOpenUserMenu}
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2, p: 0 }}
                                >
                                    <MenuIcon sx={{fontSize: '2.5rem'}} />
                                </IconButton>
                            )}

                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >

                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    {setting === "Login" && (
                                        <NavLink to="/login" style={{color: '#076efd'}}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </NavLink>
                                    )}
                                    {setting === "Signup" && (
                                        <NavLink to="/signup" style={{color: '#076efd'}}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </NavLink>
                                    )}
                                    {setting === "Logout" && (
                                        <NavLink to="/logout" style={{color: '#076efd'}}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </NavLink>
                                    )}
                                    {setting === "Account" && (
                                        <NavLink to="/account" style={{color: '#076efd'}}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </NavLink>
                                    )}
                                    {setting === "Dashboard" && (
                                        <NavLink to="/" style={{color: '#076efd'}} >
                                            <Typography textAlign="center">{setting}</Typography>
                                        </NavLink>
                                    )}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
