const makeRequest = require('./make-request')
const querystring = require('querystring')

module.exports = function formatEvents (events) {
    // por cada evento generamos una promise porque tenemos que ir a buscar la información del venue
    const promises = events.map(event => {
        return makeRequest(`https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.TOKEN}`)
            .then(venue => {
                const fullAddress = venue.address.localized_multi_line_address_display.join(', ')
                const query = querystring.stringify({q: `${fullAddress}`})

                return {
                    date: new Date(event.start.local),
                    eventName: event.name.text,
                    eventLink: event.url,
                    place: venue.name,
                    placeAddress: `http://maps.google.com/?${query}`
                }
            })
    })

    return Promise.all(promises)
}
