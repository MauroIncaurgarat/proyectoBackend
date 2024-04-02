const productRouter = require(`${__dirname}/routes/product.router.js`)
const cartRouter = require(`${__dirname}/routes/carts.router.js`)
const viewsRouter = require(`${__dirname}/routes/views.router.js`)


const ChatManager = require(`${__dirname}/dao/dbManager/chatManager.js`)
const chatManager = new ChatManager() 


const { Server } = require('socket.io')
const handlebars = require('express-handlebars')
const express = require('express')
const mongoose = require('mongoose')

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
    //conecto a MONGO ATLAS
    await mongoose.connect('mongodb+srv://mauroincaurgarat:coderpass@codercluster.cr5kfef.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', 
    {
        dbName: 'ecommerce'   
    })

    //Guardoo el servidor
    const httpServer = app.listen(8080, ()=>{
        console.log(' Servidor Listo !') })

    //WEB SERVER
    //Instancio servidor p WS
    const io = new Server(httpServer) //por convención
    // SET
    app.set('ws',io)


    //Evento aparece cuando el cliente se conecta
    io.on('connection',(clientSocket)=>{
        console.log(`nuevo cliente ${clientSocket.id}`)

        clientSocket.on('message', (data)=> {
            chatManager.addChat(data)

            io.emit('message',data)
        })

    })

    
}

main()