const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})
//Opciones de Sessions
module.exports = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}