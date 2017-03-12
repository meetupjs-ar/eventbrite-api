const makeRequest = require('./make-request')

module.exports = function formatEvents (events) {
    const promises = events.map(event => {
        return makeRequest(`https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.TOKEN}`)
            .then(venue => {
                return {
                    date: new Date(event.start.local),
                    eventName: event.name.text,
                    eventLink: event.url,
                    place: venue.name,
                    placeAddress: venue.latitude !== 0 ? `${venue.latitude},${venue.longitude}` : `${venue.address_1}`
                }
            })
    })

    return Promise.all(promises)
}
