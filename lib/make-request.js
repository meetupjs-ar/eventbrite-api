const got = require('got')

// it returns directly the JSON of the response's body
module.exports = function makeRequest (url) {
    return got(url).then(res => JSON.parse(res.body))
}
