import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:3001/events');
                console.log(res)
                setEvents(res.data.items);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div>
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
