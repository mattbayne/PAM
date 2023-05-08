import React, {useState, useEffect, useContext} from 'react';
import Button from "@mui/material/Button";
import '../../App.css';
import axios from "axios";
import {AuthContext} from "../../firebase/Auth";


const fname = "nicholai.lesperance@gmail.com~itinerary_8-5-2023.pdf"

export const ItineraryButton = () => {
    const {currentUser} = useContext(AuthContext);
    const {email, displayName} = currentUser['_delegate'];
    const [generating, setGenerating] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [genError, setGenError] = useState(null);
    const [sendError, setSendError] = useState(null);
    const [sent, setSent] = useState(false)

    useEffect(()=>{
        async function checkExists() {
            try {
                const url = `http://localhost:3001/api/get-itinerary-file`
                console.log(`req email: `, url)
                const res = await axios.get(url, {params: { email: email }},)
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
        }
        else {
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

export default ItineraryButton;