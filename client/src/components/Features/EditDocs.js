import React, {useContext, useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {
    Grid,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,} from "@mui/material";
import {AuthContext} from "../../firebase/Auth";

const EditDocs = () => {

    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [style, setStyle] = useState('');
    const [tone, setTone] = useState('');
    const [text, setText] = useState('');
    const {currentUser} = useContext(AuthContext);
    const user = currentUser['_delegate'];
    const {displayName} = user;


    const resetForm = () => {
        setStyle('');
        setTone('');
        setResponse('');
        setText('');
    };

    const proofreadText = async () => {
        if (!style.trim() || !tone.trim() || !text.trim()) {
            setError('Style, tone, and text cannot be empty.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const {data: {proofreadText}} = await axios.post('http://localhost:3001/api/proofread-text', { text, style, tone });
            setResponse(proofreadText);
        } catch (error) {
            setError('Failed to proofread text.');
        }
        setLoading(false);
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
                    Paste in Text for PAM to Proofread for Grammar, Spelling, Style, and Tone
                </Typography>
                <Box component="form" width={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }} required>
                                <FormLabel component="legend" sx={{ fontSize: '1.25rem' }}>Style:</FormLabel>
                                <RadioGroup
                                    aria-label="style"
                                    name="style"
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                >
                                    {['N/A', 'Formal', 'Casual', 'Informative', 'Conversational', 'Persuasive', 'Descriptive', 'Technical', 'Narrative', 'Analytical', 'Blog'].map((option) => (
                                        <FormControlLabel key={option} value={option.toLowerCase()} control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }} required>
                                <FormLabel component="legend" sx={{ fontSize: '1.25rem' }}>Tone:</FormLabel>
                                <RadioGroup
                                    aria-label="tone"
                                    name="tone"
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                >
                                    {['N/A', 'Friendly', 'Serious', 'Enthusiastic', 'Professional', 'Humorous', 'Neutral', 'Assertive', 'Compassionate', 'Confident', 'Encouraging'].map((option) => (
                                        <FormControlLabel key={option} value={option.toLowerCase()} control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <TextField
                        label="Text goes here"
                        fullWidth
                        multiline
                        rows={5}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={proofreadText}
                        sx={{ mt: 2 }}
                    >
                        Proofread Text
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
                {loading ? (
                    <>
                        <CircularProgress />
                        <Typography variant="body2" mt={2}>
                            Proofreading text...
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
            </Box>

        </Box>
    );
};

export default EditDocs;
