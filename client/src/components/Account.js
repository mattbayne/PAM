import React, {useContext, useEffect, useState} from 'react';
import '../App.css'
import axios from "axios";
import ChangePassword from './ChangePassword'
import {LogOutButton} from "./LogOut";
import {
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {AuthContext} from "../firebase/Auth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
const noUser = require('../img/noUser.webp')

const defaultData = {};

function FormDialog(props) {
    const {onSubmit} = props;
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = () => {
        onSubmit(url)
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Change profile picture
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Profile Picture</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Provide a url/uri path to your profile image.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="url"
                        label="Profile Picture URL"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={url}
                        onChange={(val)=>setUrl(val.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function ProfileImage(props) {
    let src;
    if (props['profileImage'] === null) {
        src = noUser
    } else {
        src = props['profileImage']
    }

    return (
        <Box
            component="img"
            sx={{
                // height: 233,
                // width: 350,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
            }}
            alt="user avatar"
            src={src}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src=noUser;
            }}
        />
    )
}


function AccountCard() {
    const {currentUser, avatar, setAvatar} = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)

    const user = currentUser['_delegate'];
    const {displayName, email} = user;


    useEffect(()=>{
        async function getData() {
            try {
                const rawResult = await axios.get(`http://localhost:3001/user/${email}`)
                setData(rawResult['data'])
            } catch(e) {
                setData(defaultData)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [email, loading])

    async function updateProfilePic(picture) {
        const rawResult = await axios.post(
            `http://localhost:3001/user/${email}/picture`,
            {profileImage: picture})
        setAvatar(picture);
        return rawResult
    }

    return (
        <React.Fragment>
            <CardContent>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    {loading ? <h1>Loading...</h1> :
                        (
                            <div>
                                <Box textAlign="center">
                                    <ProfileImage profileImage={avatar} />
                                </Box>
                                {(data) ? "" : ""}
                                <br />
                                <br/>
                                <Box textAlign="center">
                                    <FormDialog onSubmit={updateProfilePic} />
                                </Box>
                                <br/>
                                <h2>Welcome back, {displayName}!</h2>
                                <br/>
                                <Box textAlign="center">
                                    <ChangePassword/>
                                    <br/>
                                    <br/>
                                    <LogOutButton/>
                                </Box>
                            </div>
                        )
                    }
                </Grid>

            </CardContent>
        </React.Fragment>
    )
}


function Account() {

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh',  }}
        >
            <Box sx={{ minWidth: 275, margin: "30px"}}>
                <Card className="m-5 p-5" variant="outlined">
                    <AccountCard />
                </Card>
            </Box>
        </Grid>
    );
}

export default Account;
