
function itineraryDirective(name, events) {
    return `Generate an HTML formatted itinerary for this week, using this JSON string list of events that were pulled \
from the google calendar API: ${events}. Include a word of the day, neat historical fact, and/or other small details \
appropriate for such an itinerary. Days with no scheduled events can have a suggested activity, but it must be clear \
those are not planned activities from the calendar. Structure the itinerary such that every day of the week is \
represented and well labeled. Address the itinerary to be sent as an email to ${name}. The output must be nicely \
formatted HTML. The response should only contain the HTML, with no additional text.`
}

module.exports = {
    itineraryDirective
};
