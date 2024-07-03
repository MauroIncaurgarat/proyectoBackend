const winston = require ('winston')
const dotenv = require('dotenv')

dotenv.config({
    path: './../../.env'
})

const customLevelsOptions = {
    levels : {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

const prodLogger = winston.createLogger({
    
    levels: customLevelsOptions.levels,

    transport: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({level: 'error', filename: `./../../logsarchive/app.log` })
    ]
    
})

const devLogger = winston.createLogger({

    levels: customLevelsOptions.levels,
    
    transport: [
        new winston.transports.Console({level: 'debug'}),
    ]

})

const logger = process.env.NODE_ENV === 'production'
    ? prodLogger
    : devLogger


/**
 * @type {import('express').RequestHandler}
 */

const useLogger = (req, __ , next) => {
    req.logger = logger
    req.logger.http(`Request al endpoint: ${req.url}`)
    next();
}

module.exports={useLogger}