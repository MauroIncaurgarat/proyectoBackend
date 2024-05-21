const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

module.exports = {
    appId: process.env.GITHUB_ID,
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
}