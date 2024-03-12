const productRouter = require(`${__dirname}/routes/product.router.js`)
const cartRouter = require(`${__dirname}/routes/carts.router.js`)
const viewsRouter = require(`${__dirname}/routes/views.router.js`)

const handlebars = require('express-handlebars')
const express = require('express')
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
app.listen(8080, ()=>{
    console.log(' Servidor Listo !') 
})


