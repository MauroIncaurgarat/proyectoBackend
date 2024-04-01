const productRouter = require(`${__dirname}/routes/product.router.js`)
const cartRouter = require(`${__dirname}/routes/carts.router.js`)
const viewsRouter = require(`${__dirname}/routes/views.router.js`)
const { Server } = require('socket.io')
const handlebars = require('express-handlebars')
const express = require('express')
const mongoose = require('mongoose')
const ProductManager = require(`${__dirname}/dao/dbManager/productManager.js`)

//const ProductManager = require('./dao/dbManager/productManager')

const app = express()

//configurar handlebars
app.engine('handlebars', handlebars.engine()) //Express utilice el motor handelbars
app.set('views', `${__dirname}/views`) //Donde estan las vistas ?
app.set('view engine', 'handlebars')

//Permitir envío de informacion mediante formularios y JSON
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Recurso Publico
app.use(express.static(`${__dirname}/../public`)) 

//ROUTERS API
app.use('/api/product', productRouter) //Router Productos
app.use('/api/cart', cartRouter) //Router Productos
//ROUTERS HTML
app.use('/', viewsRouter);


//SERVIDOR
const main = async () => { 
    await mongoose.connect('mongodb://localhost:27017', 
    {
        dbName: 'ecommerce'   
    })
    
    const productManager = new ProductManager()
    await productManager
    
    //Guardoo el servidor
    const httpServer = app.listen(8080, ()=>{
        console.log(' Servidor Listo !') })

    //WEB SERVER
    //Instancio servidor p WS
    const io = new Server(httpServer) //por convención
    
    //Evento aparece cuando el cliente se conecta
    io.on('connection',(clientSocket)=>{
        console.log(`nuevo cliente ${clientSocket.id}`)
        //Eventos que el servidor debe escuchar
    })

    // SET
    app.set('ws',io)
    //app.set('productManager',ProductManager )
}

main()