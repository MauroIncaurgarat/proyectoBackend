const productRouter = require(`${__dirname}/routes/product.router.js`)

//const productCarts = require(`${__dirname}/routes/carts.router.js`)
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/../public`)) //Recurso Publico

app.use('/api/product', productRouter) //Router Productos


app.listen(8080, ()=>{
    console.log(' Servidor Listo !')
    
})


