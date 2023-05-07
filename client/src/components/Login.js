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
                        setError("invalid username or password, please try again.");
                        break;
                    case "auth/too-many-requests":
                        setError("too many failed attempts, please try again later.");
                        break;
                    default:
                        setError(`unable to login due to unknown error, please contact an administrator: ${reason['code']}`)
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
                    <Typography component="h1" variant="body1">
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
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container justifyContent="center">
                            <Grid item>
                                <GoogleButton
                                    onClick={() => {doSocialSignIn('google') }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}