import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from "../../firebase/Auth";
import Link from "@mui/material/Link";
import moment from 'moment';
import {ItineraryButton} from "./Itinerary";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";

function Calendar() {
    const {currentUser} = useContext(AuthContext);
    const email = currentUser['_delegate']['email'];
    const [auth, setAuth] = useState(false);
    const [authUrl, setAuthUrl] = useState(null)
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState({
        summary: '',
        location: '',
        start: {
            dateTime: '',
            timeZone: 'America/New_York'
        },
        end: {
            dateTime: '',
            timeZone: 'America/New_York'
        },
        description: ''
    });
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const oauthRes = await axios.get(`http://localhost:3001/calendarAuth/${email}`);
                if (oauthRes['data']['auth']) {
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
    }, [email]);

    // TODO: Make this slightly prettier
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!auth) {
        return (
            <div>
                <Link href={authUrl}>Authorize Google Calendar API</Link>
            </div>
        )
    }

    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');
    const days = [];
    let day = startOfWeek;

    while (day <= endOfWeek) {
        days.push(day.format("ddd MMM DD YYYY"));
        day = day.clone().add(1, 'd');
    }

    const dayEvents = {};
    const day0 = days[0];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day0) {
            if (!dayEvents[`${day0}`]) {
                dayEvents[`${day0}`] = [];
            }
            dayEvents[`${day0}`].push(event);
        }
    })

    const day1 = days[1];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day1) {
            if (!dayEvents[`${day1}`]) {
                dayEvents[`${day1}`] = [];
            }
            dayEvents[`${day1}`].push(event);
        }
    })

    const day2 = days[2];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day2) {
            if (!dayEvents[`${day2}`]) {
                dayEvents[`${day2}`] = [];
            }
            dayEvents[`${day2}`].push(event);
        }
    })


    const day3 = days[3];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day3) {
            if (!dayEvents[`${day3}`]) {
                dayEvents[`${day3}`] = [];
            }
            dayEvents[`${day3}`].push(event);
        }
    })

    const day4 = days[4];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day4) {
            if (!dayEvents[`${day4}`]) {
                dayEvents[`${day4}`] = [];
            }
            dayEvents[`${day4}`].push(event);
        }
    })

    const day5 = days[5];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day5) {
            if (!dayEvents[`${day5}`]) {
                dayEvents[`${day5}`] = [];
            }
            dayEvents[`${day5}`].push(event);
        }
    })

    const day6 = days[6];
    events.forEach(event => {
        let endDate;
        if (event.end.dateTime) {
            endDate = new Date(event.end.dateTime);
        } else {
            endDate = new Date(event.end.date);
        }
        endDate = endDate.toString().substr(0,15)
        if(endDate === day6) {
            if (!dayEvents[`${day6}`]) {
                dayEvents[`${day6}`] = [];
            }
            dayEvents[`${day6}`].push(event);
        }
    })

    const handleClick = async () => {
        setOpen(true);
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleAddEvent = async () => {
        if (!event.summary || !event.location || !event.start.dateTime || !event.end.dateTime || !event.description) {
            alert('Please fill out all the fields!');
            return;
        }
        try {
            const formattedEvent = {
                summary: event.summary,
                location: event.location,
                start: {
                    dateTime: new Date(event.start.dateTime).toISOString(),
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: new Date(event.end.dateTime).toISOString(),
                    timeZone: 'America/New_York'
                },
                description: event.description
            };
            const newEvent = await axios.post(`http://localhost:3001/calendarAuth/event/${email}`, formattedEvent);
            const response = newEvent.data
            if (response['data']['auth']) {
                const eventData = {
                    summary: event.summary,
                    location: event.location,
                    start: {
                        dateTime: new Date(event.start.dateTime).toISOString(),
                        timeZone: 'America/New_York'
                    },
                    end: {
                        dateTime: new Date(event.end.dateTime).toISOString(),
                        timeZone: 'America/New_York'
                    },
                    description: event.description
                }
                setOpen(false);
                setEvent({});
                setEvents([...events, eventData])
                alert('Event added successfully!');
                setOpen(false);
            } else {
                alert('Error adding event!');
            }
        } catch (err) {
            console.log(err);
        }
    };



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleDateTimeChange = (date, type) => {
        const dateTimeString = date.toISOString();
        setEvent(prevEvent => ({
            ...prevEvent,
            [type]: {
                dateTime: dateTimeString,
                timeZone: "America/New_York",
            },
        }));
    };

    const startDateTime = event.start ? event.start.dateTime : '';
    const endDateTime = event.end ? event.end.dateTime : '';

    return (
        <div>
            {authUrl ? (
                <a href={authUrl}>
                    <button>GoogleAuth</button>
                </a>
            ) : (
                ""
            )}
            <Box textAlign="center">
                <ItineraryButton />
            </Box>
            <br/>
            <Box textAlign="right">
                <Button variant='outlined' onClick={handleClick}>Add Event</Button>
                <Dialog open={open} onClose={handleCancel}>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the details of the new event.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="summary"
                            label="Summary"
                            type="text"
                            fullWidth
                            value={event.summary}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="location"
                            label="Location"
                            type="text"
                            fullWidth
                            value={event.location}
                            onChange={handleInputChange}
                        />
                        <Box marginBottom={2} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start Date and Time"
                                    inputFormat="yyyy-MM-dd hh:mm a"
                                    value={startDateTime}
                                    onChange={(newValue) => handleDateTimeChange(newValue, "start")}
                                    sx={{width: '48%'}}
                                />
                                <Box sx={{width: '4%'}} />
                                <DateTimePicker
                                    label="End Date and Time"
                                    inputFormat="yyyy-MM-dd hh:mm a"
                                    value={endDateTime}
                                    onChange={(newValue) => handleDateTimeChange(newValue, "end")}
                                    sx={{width: '48%'}}
                                />
                            </LocalizationProvider>
                        </Box>
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            value={event.description}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <Box textAlign="center">
                        <Button onClick={handleAddEvent} color="primary">
                            Add
                        </Button>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                    </Box>
                </Dialog>
            </Box>
            <h1>My Events</h1>
            {events.length > 0 ? (
                <div>
                    {days.map((day) => (
                        <div key={day}>
                            <h2>{day}</h2>
                            {dayEvents[day] && dayEvents[day].length > 0 ? (
                                <table className="calendar-table">
                                    <thead>
                                    <tr>
                                        <th>Summary</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dayEvents[day].map((event, i) => (
                                        <tr key={`${day}:${i}`}>
                                            <td className="center">{event.summary}</td>
                                            <td className="center">
                                                {event.start && event.start.dateTime ? (
                                                    new Date(event.start.dateTime)
                                                        .toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        .replace(/ /g, "")
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="center">
                                                {event.end && event.end.dateTime ? (
                                                    new Date(event.end.dateTime)
                                                        .toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        .replace(/ /g, "")
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="center">{event.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No events on this day.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading events...</p>
            )}
        </div>
    );
}
export default Calendar;