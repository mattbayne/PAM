import React, {useEffect, useState} from 'react';
import '../App.css'
import Button from "@mui/material/Button";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import firebaseApp from "../firebase/Firebase";
import firebase from 'firebase/compat/app';
import Link from "@mui/material/Link";
import {doChangePassword} from "../firebase/FirebaseFunctions";

// function ChangePassword() {
//     return (
//         <Button>
//             Change Password
//         </Button>
//     );
// }

function ChangePassword(props) {
    const {onSubmit} = props;
    const [open, setOpen] = useState(false);
    const [currPass, setCurrPass] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [error, setError] = useState(null)
    const [provider, setProvider] = useState(null)
    const user = firebaseApp.auth().currentUser;

    useEffect(()=>{
        setProvider(user.providerData[0].providerId)
    }, [provider])

    async function validateCurrentPassword() {
        const credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email,
            currPass
        );
        await user.reauthenticateWithCredential(credential);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setError(null);
        setCurrPass("");
        setPass1("")
        setPass2("")
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            await validateCurrentPassword()
        } catch(e) {
            console.log(e)
            setCurrPass("")
            setError("Current password is incorrect, please try again.");
            return
        }
        if (pass1 === "") {
            setError("A new password must be provided");
            return
        }
        if (pass1 !== pass2) {
            setError("New passwords do not match, please try again.");
            return
        }
        try {
            await doChangePassword(user.email, currPass, pass1)
        } catch (e) {
            setError(e)
            console.log(e)
            return
        }
        alert("successfully changed password")
        setOpen(false);
    }

    if (provider !== 'password') {
        return (
            <div style={{display: 'inline-block'}}>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Change password
                </Button>
                <Dialog open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are signed in via {provider}; to change your password, go to:
                            <br />
                            <Link href="https://myaccount.google.com/signinoptions/password" target="_blank">
                                https://myaccount.google.com/signinoptions/password
                            </Link>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>


        )
    }

    return (
        <div style={{display: 'inline-block'}}>
            <Button variant="outlined" onClick={handleClickOpen}>
                Change password
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your current and new passwords.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="currPass"
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={currPass}
                        onChange={(val)=>setCurrPass(val.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="pass1"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={pass1}
                        onChange={(val)=>setPass1(val.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="pass2"
                        label="Re-enter New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={pass2}
                        onChange={(val)=>setPass2(val.target.value)}
                    />
                    {error ?
                        <Typography className="auth--error">{error}</Typography> :
                        ""
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Change Password</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default ChangePassword;
