const { HttpCode, HttpError } = require('../error-handling/http_error')

module.exports = function (schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body)
        if (error) {
            throw new HttpError(HttpCode.BAD_REQUEST, error.details[0].message)
        }
        next()
    }
}
