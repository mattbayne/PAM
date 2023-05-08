
function itineraryDirective(name, events) {
    return `Generate a whimsical itinerary for this week, using this JSON string list of events that were pulled from \
the google calendar API: ${events}. Include a word of the day, neat historical fact, and/or other small details \
appropriate for such an itinerary. On days with no scheduled events, add a suggested activity, but make it clear that \
those are not planned activities from the calendar. Structure the itinerary such that every day of the week is \
represented and well labeled. Address the itinerary to be sent as an email to ${name}. The output should be pure HTML.`
}

module.exports = {
    itineraryDirective
};
