import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import GoogleButton from "react-google-button";
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {doSignInWithEmailAndPassword, doSocialSignIn} from "../firebase/FirebaseFunctions";
import {useContext, useState} from "react";
import {AuthContext} from "../firebase/Auth";
import {Navigate} from "react-router-dom";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                PAM
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    const {currentUser} = useContext(AuthContext);
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState(null)
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        doSignInWithEmailAndPassword(data.get('email'), data.get('password')).then(
            ()=>setLoggingIn(true),
            (reason)=>{
                switch(reason['code']) {
                    case "auth/wrong-password":
                        setError("Invalid Username/Password, please try again.");
                        break;
                    case "auth/too-many-requests":
                        setError("Too many failed attempts, please try again later.");
                        break;
                    default:
                        setError(`Unable to login due to unknown error, please contact an administrator: ${reason['code']}`)
                        break
                }
                setLoggingIn(false)
            })
    };

    if (currentUser) {
        return <Navigate to='/' />
    }

    if (loggingIn) {
        return <h5>Loading...</h5>
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h2" fontSize="30px">
                        Log in
                    </Typography>
                    {(error !== null) ? <Typography component="h2" color="red"><i>{error}</i></Typography> : "" }
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Box textAlign="center">
                            <Link href="/signup" variant="body2" fontSize="15px">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                        <br />
                        <Grid container justifyContent="center">
                            <Box bgcolor="lightgray" p={2}>
                                <Grid item>
                                    <GoogleButton
                                        onClick={() => {doSocialSignIn('google') }}
                                    />
                                </Grid>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}