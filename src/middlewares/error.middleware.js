const {ErrorCodes} = require("./../utils/errorCodes")

/**
 * @type {import("express").ErrorRequestHandler}
 */

const ErrorHandler = (error, req ,res,next)=>{

    switch(error.code) {
        
        case ErrorCodes.INVALID_INPUT_DATA:

            res.status(400).send({status: 'error', error: error.name, cause: error.cause})
            break

        default:
            res.status(500).send({status: 'error', error: 'Unknown'})
    }
    next()
}
 
module.exports = {ErrorHandler}