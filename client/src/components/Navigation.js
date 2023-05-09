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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../img/logo.jpeg'
import {useContext, useState} from "react";
import {AuthContext} from "../firebase/Auth";
import { NavLink } from 'react-router-dom';
import noUser from '../img/noUser.webp'
import { useNavigate } from 'react-router-dom';
import DashboardContext from "./Dashboard/DashboardContext";



function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { setSelectedFunctionality } = useContext(DashboardContext);

    // const [avatar, setAvatar] = useState(null)

    const { currentUser, avatar } = useContext(AuthContext);
    const settings = currentUser
        ? ["Account", "Dashboard", "Logout"]
        : ["Login", "Signup"];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{backgroundColor: 'black'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 0, width: '150px', height: '150px', display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                        <img src={logo} alt='logo' style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }} draggable={"false"} onClick={() => setSelectedFunctionality('home')} />
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
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, cursor: 'pointer' }} onClick={() => setSelectedFunctionality('home')} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedFunctionality('home')}
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
                                        <NavLink onClick={() => setSelectedFunctionality('home')} style={{color: '#076efd'}} >
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
