import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const GenerateEmails = () => {
    const [email, setEmail] = useState('');
    const [purpose, setPurpose] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const convertNewLinesToBreaks = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const generateEmail = async () => {
        setLoading(true);
        setError('');
        try {
            const {data: {emailContent}} = await axios.post('http://localhost:4000/api/generate-email', { purpose });
            console.log(emailContent);
            setResponse(emailContent);
        } catch (error) {
            setError('Failed to generate email.');
        }
        setLoading(false);
    };

    const sendEmail = async () => {
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

            await axios.post('http://localhost:4000/api/send-email', { email, subject, body});
            alert('Email sent!');
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
                    What email would you like to send?
                </Typography>
                <Box component="form" width={1}>
                    <TextField
                        label="Recipient Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email Purpose"
                        fullWidth
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendEmail}
                        sx={{ mt: 2 }}
                    >
                        Send Email
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default GenerateEmails;
