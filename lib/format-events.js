const makeRequest = require('./make-request')

module.exports = function formatEvents (events) {
    // por cada evento generamos una promise porque tenemos que ir a buscar la información del venue
    const promises = events.map(event => {
        return makeRequest(`https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.TOKEN}`)
            .then(venue => {
                return {
                    date: new Date(event.start.local),
                    eventName: event.name.text,
                    eventLink: event.url,
                    place: venue.name || venue.address.address1
                }
            })
    })

    return Promise.all(promises)
}
