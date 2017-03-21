// si estamos en desarrollo, requerimos el archivo '.env'
// en producción, esa configuración se recibe directamente como variables de entorno
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

const cache = require('memory-cache')
const formatEvents = require('./lib/format-events')
const makeRequest = require('./lib/make-request')
const microCors = require('micro-cors')
const { send } = require('micro')
const querystring = require('querystring')

const blackList = process.env.BLACK_LIST ? process.env.BLACK_LIST.split(',') : []
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
        // si el resultado del API no fue previamente cacheado
        if (!cache.get('data')) {
            // creamos un array de promesas con las peticiones a los eventos que sabemos que
            // no entran en el rango
            const whiteListPromises = whiteList.map(organizerId => {
                return makeRequest(`https://www.eventbriteapi.com/v3/events/search/?token=${process.env.TOKEN}&organizer.id=${organizerId}`)
            })
            // creamos un array de 1 solo elemento con los eventos que correspondan a la configuración
            const allPromises = whiteListPromises.concat([
                makeRequest(`https://www.eventbriteapi.com/v3/events/search/?token=${process.env.TOKEN}&${querystring.stringify(options)}`)
            ])

            // esperamos que se resuelvan las peticiones
            const data = await Promise.all(allPromises)
                // generamos un array de 1 solo nivel por medio de un reduce
                // que solo concatena todos los eventos
                .then(data => data.reduce(
                    (output, rawData) => output.concat(rawData.events),
                    []
                ))
                // filtramos los eventos que no queremos que aparezcan
                .then(data => data.filter(event => !blackList.includes(event.id.toString())))
                // formateamos el array de eventos para que tenga solo los datos que necesitamos
                .then(formatEvents)

            // guardamos los datos en cache por el tiempo indicado por configuración
            cache.put('data', data, cacheExpiration)
        }

        send(res, 200, cache.get('data'))
    } catch (error) {
        send(res, 500, error.message)
    }
}

module.exports = cors(handler)
