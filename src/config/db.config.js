const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

module.exports = {
    dbName: process.env.MONGO_NAME,//'ecommerce',
    mongoUrl: process.env.MONGO_URL//'mongodb+srv://mauroincaurgarat:coderpass@codercluster.cr5kfef.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster'
}