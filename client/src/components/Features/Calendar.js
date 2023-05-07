import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from "../../firebase/Auth";
import Link from "@mui/material/Link";


function Calendar() {
    const {currentUser} = useContext(AuthContext);
    const email = currentUser['_delegate']['email'];
    const [auth, setAuth] = useState(false);
    const [authUrl, setAuthUrl] = useState(null)
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const oauthRes = await axios.get(`http://localhost:3001/calendarAuth/${email}`);
                console.log(oauthRes)
                if (oauthRes['data']['auth']) {
                    console.log("authenticated, populating events")
                    setEvents(oauthRes['data']['events'])
                    setAuth(true)
                } else {
                    setAuthUrl(oauthRes['data']['authUrl'])
                    setAuth(false)
                }
                setLoading(false)
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, []);

    // TODO: Make this slightly prettier
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!auth) {
        console.log("not auth'd, making a link")
        return (
            <div>
                <Link href={authUrl}>Authorize Google Calendar API</Link>
            </div>
        )
    }

    return (
        <div>
            {authUrl ? <a href={authUrl}><button>GoogleAuth</button></a> : ""}
            <h1>My Events</h1>
            {events !== undefined && events.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.summary}</td>
                            <td>{event.start.dateTime}</td>
                            <td>{event.end.dateTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading events...</p>
            )}
        </div>
    );
}

export default Calendar;
