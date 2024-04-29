const MongoStorage = require('connect-mongo')
const session = require('express-session')
const defaultOptions = require(`${__dirname}/defaultOptions`)

const {dbName, mongoUrl} = require (`${__dirname}/../config/db.config`)

const storage = MongoStorage.create({
    dbName,
    mongoUrl,
    ttl:3600
})

module.exports = session({
    store: storage,
    ...defaultOptions
})