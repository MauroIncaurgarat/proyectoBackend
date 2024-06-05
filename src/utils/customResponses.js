const express = require('express')

/**
 * 
 * @type {express.RequestHandler}
 */

const configureCustomResponses = (_,res,next) => {
    res.sendSucces = (payload, code = 200) => res.status(code).json({status: 'Succes', payload})
    res.sendError = (payload, code = 500) => res.status(code).json({status: 'Error', payload})
    next()
}

module.exports = {configureCustomResponses}