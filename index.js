// if we're in development, we require an specific configuration located at '.env'
// at production, that configuration is setted directly and we don't use that file
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

const cache = require('memory-cache')
const formatEvents = require('./lib/format-events')
const makeRequest = require('./lib/make-request')
const microCors = require('micro-cors')
const { send } = require('micro')
const querystring = require('querystring')

const cacheExpiration = parseInt(process.env.CACHE_EXPIRATION)
const cors = microCors({
    allowMethods: ['GET']
})
const options = {
    'categories': process.env.CATEGORIES,
    'location.latitude': process.env.LAT,
    'location.longitude': process.env.LON,
    'location.within': process.env.RADIUS
}
const whiteList = process.env.WHITE_LIST ? process.env.WHITE_LIST.split(',') : []

async function handler (req, res) {
    try {
        // we look for the data in the memory cache
        // if it's not present, we fetch, format and store the data into the cache
        if (!cache.get('data')) {
            const whiteListPromises = whiteList.map(organizerId => {
                return makeRequest(`https://www.eventbriteapi.com/v3/events/search/?token=${process.env.TOKEN}&organizer.id=${organizerId}`)
            })
            const allPromises = whiteListPromises.concat([
                makeRequest(`https://www.eventbriteapi.com/v3/events/search/?token=${process.env.TOKEN}&${querystring.stringify(options)}`)
            ])

            const data = await Promise.all(allPromises)
                .then(data => data.reduce(
                    (output, rawData) => output.concat(rawData.events),
                    []
                ))
                .then(formatEvents)

            cache.put('data', data, cacheExpiration)
        }

        send(res, 200, cache.get('data'))
    } catch (error) {
        send(res, 500, error.message)
    }
}

module.exports = cors(handler)
