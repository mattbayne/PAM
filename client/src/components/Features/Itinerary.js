import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import '../../App.css';
import axios from "axios";
import {AuthContext} from "../../firebase/Auth";

const Itinerary = () => {
    const [email, setEmail] = useState('');
    const [events, setEvents] = useState('');
    const [date, setDate] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const resetForm = () => {
        setEvents('');
        setDate('');
        setResponse('');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const generateItinerary = async () => {
        if (!events.trim() || !date.trim()) {
            setError('Itinerary events list and date of itinerary cannot be empty.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const {data: {itineraryContent}} = await axios.post('http://localhost:3001/api/generate-day-itinerary', { events, date });
            console.log(itineraryContent);
            setResponse(itineraryContent);
        } catch (error) {
            setError('Failed to generate itinerary.');
        }
        setLoading(false);
    };

    const sendItinerary = async () => {
        setOpen(false);
        setError('');
        try {
            const arr = response.split('\n');
            const firstEmptyLineIndex = arr.findIndex(line => line.trim() === '');

            if (firstEmptyLineIndex !== -1) {
                arr.splice(firstEmptyLineIndex, 1);
            }

            const [date, ...bodyLines] = arr;
            const body = bodyLines.join('\n');

            await axios.post('http://localhost:3001/api/send-email', { email, subject: date, body});
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
                <Typography variant="h2" mb={4} fontSize="40px">
                    Enter the Date and Event/Activities to be Included in your Itinerary
                </Typography>
                <Box component="form" width={1}>
                    <TextField
                        label="Date"
                        fullWidth
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="i.e., tomorrow"
                    />
                    <TextField
                        label="Events and Activities"
                        fullWidth
                        value={events}
                        onChange={(e) => setEvents(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Go to grocery store by 4pm"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={generateItinerary}
                        sx={{ mt: 2 }}
                    >
                        Generate Itinerary
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
                            Generating itinerary...
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
                            Send to Email
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Email Itinerary
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Enter an email address to send this itinerary to:
                                </DialogContentText>
                                <TextField
                                    label="Recipient Email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 2 }}
                                    placeholder="i.e., someone@gmail.com"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Back
                                </Button>
                                <Button
                                    onClick={sendItinerary}
                                    color="primary"
                                    autoFocus
                                >
                                    Email Itinerary
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/*<Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                            sx={{ mt: 2 }}
                        >
                            Schedule an Emailed Itinerary
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Schedule An Emailed Itinerary
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Select a time for your emailed itinerary to be sent.
                                </DialogContentText>
                                <Select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    <MenuItem value="0:00">12:00am</MenuItem>
                                    <MenuItem value="3:00">3:00am</MenuItem>
                                    <MenuItem value="6:00">6:00am</MenuItem>
                                    <MenuItem value="9:00">9:00am</MenuItem>
                                    <MenuItem value="12:00">12:00pm</MenuItem>
                                    <MenuItem value="15:00">3:00pm</MenuItem>
                                    <MenuItem value="18:00">6:00pm</MenuItem>
                                    <MenuItem value="21:00">9:00pm</MenuItem>
                                </Select>
                            </DialogContent>
                            <DialogActions>

                                <Button onClick={handleClose} color="primary">
                                    Back
                                </Button>
                                <Button
                                    onClick={scheduleItinerary}
                                    color="primary"
                                    autoFocus
                                >
                                    Schedule Email
                                </Button>
                            </DialogActions>
                        </Dialog> */}
                    </>
                )}
            </Box>

        </Box>
    );
};


export const ItineraryButton = () => {
    const {currentUser} = useContext(AuthContext);
    const {email, displayName} = currentUser['_delegate'];
    const [generating, setGenerating] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [genError, setGenError] = useState(null);
    const [sendError, setSendError] = useState(null);
    const [sent, setSent] = useState(false)

    useEffect(() => {
        async function checkExists() {
            try {
                const url = `http://localhost:3001/api/get-itinerary-file`
                console.log(`req email: `, url)
                const res = await axios.get(url, {params: {email: email}},)
                console.log(res)
                setFileName(res['data']['fileName'])
                setCompleted(true)
            } catch (e) {
                console.log(e)
            }
        }

        checkExists()
    }, [email])

    function generateItinerary() {
        async function beginGeneration() {
            setGenerating(true)
            try {
                const res = await axios.post(
                    `http://localhost:3001/api/generate-itinerary`,
                    {
                        email: email,
                        name: displayName,
                    }
                );
                console.log(res)
                setFileName(res['data']['path'])
                setGenerating(false)
                setCompleted(true)
                setSent(false)
            } catch (e) {
                setGenerating(false)
                setCompleted(false)
                setGenError(e)
            }
        }

        beginGeneration()
    }

    function sendEmail() {
        setSent(true)
        setSendError(null)

        async function sendPDF() {
            try {
                const res = await axios.post(
                    `http://localhost:3001/api/send-itinerary`,
                    {
                        email: email,
                        fileName: fileName,
                    }
                );
            } catch (e) {
                console.log(e)
                setSent(false)
                setSendError(e)
            }
        }

        sendPDF()
    }

    function generateButton(text) {
        return (
            <Button className="button-itinerary"
                    variant='outlined'
                    onClick={generateItinerary}
            >{text}</Button>
        )
    }

    if (generating) {
        return (
            <Button className="button-itinerary button--loading"
                    variant='outlined'
                    disabled
            >Generating...</Button>
        )
    }

    if (completed) {
        let sendButton;
        if (sendError) {
            sendButton = <Button variant='outlined' color='error' onClick={sendEmail}>Error: Resend?</Button>
        } else {
            sendButton = (sent) ? <Button variant='outlined' disabled={true}>Sent!</Button>
                : <Button variant='outlined' onClick={sendEmail}>Email my itinerary</Button>
        }

        return (
            <div>
                {generateButton("Regenerate Itinerary")}
                <Button variant='outlined' href={`http://localhost:3001/api/get-itinerary/${fileName}`}
                >Download itinerary
                </Button>
                {sendButton}
            </div>
        )
    }

    if (genError) {
        return generateButton("Error Generating. Retry?")
    }
    return generateButton("Generate Itinerary")
}

export default Itinerary;