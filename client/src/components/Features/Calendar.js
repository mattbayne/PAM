import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from "../../firebase/Auth";
import Link from "@mui/material/Link";
import moment from 'moment';

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
        console.log('endDate', endDate)
        console.log('day2', day2)
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

    console.log('allgroupedevents', dayEvents)

    return (
        <div>
            {authUrl ? (
                <a href={authUrl}>
                    <button>GoogleAuth</button>
                </a>
            ) : (
                ""
            )}
            <h1>My Events</h1>
            {events !== undefined && events.length > 0 ? (
                <div>
                    {days.map((day) => (
                        <div>
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
                                    {dayEvents[day].map((event) => (
                                        <tr>
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
};
export default Calendar;