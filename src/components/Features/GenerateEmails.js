import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
    })
);

async function getResults(prompt) {
    let completion;
    try {
        completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });
    } catch (e) {
        console.log(e.response.data);
    }

    return completion;
}

const GenerateEmails = () => {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        const res = await getResults(inputValue);
        setResponse(res.data.choices[0].message.content);
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
                <Typography variant="h4" mb={4}>
                    What email would you like to send?
                </Typography>
                <Box component="form" width={1}>
                    <TextField
                        label="Enter your prompt"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchData}
                        sx={{ mt: 2 }}
                    >
                        Submit
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
                <Typography variant="subtitle1">
                    Response from ChatGPT:
                </Typography>
                {loading ? (
                    <CircularProgress/>
                ) : (
                    <Typography variant="body1" mt={2}>
                        {response}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default GenerateEmails;
