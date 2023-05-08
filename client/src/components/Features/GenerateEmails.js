import React, {useContext, useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {AuthContext} from "../../firebase/Auth";

const GenerateEmails = () => {
    const [email, setEmail] = useState('');
    const [purpose, setPurpose] = useState('');
    const [name, setName] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const {currentUser, avatar, setAvatar} = useContext(AuthContext);
    const user = currentUser['_delegate'];
    const {displayName} = user;

    const convertNewLinesToBreaks = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const resetForm = () => {
        setEmail('');
        setPurpose('');
        setResponse('');
        setName('');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const generateEmail = async () => {
        if (!email.trim() || !purpose.trim()) {
            setError('Recipient email, recipient name, and email purpose cannot be empty.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const {data: {emailContent}} = await axios.post('http://localhost:3001/api/generate-email', { purpose, recipientName: name, displayName });
            console.log(emailContent);
            setResponse(emailContent);
        } catch (error) {
            setError('Failed to generate email.');
        }
        setLoading(false);
    };

    const sendEmail = async () => {
        setOpen(false);
        setError('');
        try {
            const arr = response.split('\n');
            const firstEmptyLineIndex = arr.findIndex(line => line.trim() === '');

            if (firstEmptyLineIndex !== -1) {
                arr.splice(firstEmptyLineIndex, 1);
            }

            const [subject, ...bodyLines] = arr;
            const body = bodyLines.join('\n');

            // console.log('body', body);

            await axios.post('http://localhost:3001/api/send-email', { email, subject, body});
            alert('Email sent!');
            resetForm();
        } catch (error) {
            setError('Failed to send email.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '30vh',
                padding: 4,
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <Typography variant="h4" mb={4}>
                    Enter text that
                </Typography>
                <Box component="form" width={1}>
                    <TextField
                        label="Recipient Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="i.e., someone@gmail.com"
                    />
                    <TextField
                        label="Recipient Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Dear (Recipient Name)"
                    />
                    <TextField
                        label="Email Purpose"
                        fullWidth
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="i.e., Schedule Meeting with Academic Advisor"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={generateEmail}
                        sx={{ mt: 2 }}
                    >
                        Generate Email Draft
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                {/*<Typography variant="subtitle1">Response from ChatGPT:</Typography>*/}
                {loading ? (
                    <>
                        <CircularProgress />
                        <Typography variant="body2" mt={2}>
                            Generating email...
                        </Typography>
                    </>
                ) : response && (
                    <TextField
                        multiline
                        rows={15}
                        rowsMax={20}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        InputProps={{ readOnly: !response }}
                    />
                )}
                {error && (
                    <Typography variant="body2" color="error" mt={2}>
                        {error}
                    </Typography>
                )}
                {response && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                            sx={{ mt: 2 }}
                        >
                            Send Email
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Confirm Sending Email
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    The generated email is a draft that may be unfinished and require additional information. Are you sure you want to send this email?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    No
                                </Button>
                                <Button
                                    onClick={sendEmail}
                                    color="primary"
                                    autoFocus
                                >
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>

        </Box>
    );
};

export default GenerateEmails;
