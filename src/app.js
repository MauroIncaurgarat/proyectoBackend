const productRouter = require(`${__dirname}/routes/product.router.js`)
const cartRouter = require(`${__dirname}/routes/carts.router.js`)
const viewsRouter = require(`${__dirname}/routes/views.router.js`)
const sessionRouter = require(`${__dirname}/routes/session.router.js`)
const sessionMiddleware = require(`${__dirname}/session/mongoStorage.js`)
const {dbName, mongoUrl} = require(`${__dirname}/dbConfig.js`)

const handlebars = require('express-handlebars')
const express = require('express')
const mongoose = require('mongoose')
//const { $where } = require('./dao/models/product.model')


const app = express()
        //CONFIGURACIONES
//configurar handlebars
app.engine('handlebars', handlebars.engine()) //Express utilice el motor handelbars
app.set('views', `${__dirname}/views`) //Donde estan las vistas ?
app.set('view engine', 'handlebars')

//Permitir envío de informacion mediante formularios y JSON
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(sessionMiddleware)

//Recurso Publico
app.use(express.static(`${__dirname}/../public`)) 


        //ROUTERS API
app.use('/api/product', productRouter) //Router Productos
app.use('/api/cart', cartRouter) //Router Productos
app.use('/api/sessions', sessionRouter)

        //ROUTERS HTML
app.use('/', viewsRouter);


        //SERVIDOR
const main = async () => { 
    //conecto a MONGO ATLAS
    await mongoose.connect(mongoUrl, {dbName: dbName })
        .then(()=>{
                app.listen(8080, ()=>{
                        console.log(' Servidor Listo !') 
                })   
        })
    
}

main()