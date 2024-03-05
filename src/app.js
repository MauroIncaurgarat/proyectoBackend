const productRouter = require(`${__dirname}/routes/product.router.js`)

//const productCarts = require(`${__dirname}/routes/carts.router.js`)
const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/product', productRouter) //Router Productos


app.listen(8080, ()=>{
    console.log(' Servidor Listo !')
    
})


/* URL TEXTING
    http://localhost:8080/products  --> Ver todos los productos

    http://localhost:8080/products?limit=2  --> Ver 2 elementos
    http://localhost:8080/products?limit=500 --> Error limite superado
    http://localhost:8080/products?limit=0 --> Error se ingreso 0

    http://localhost:8080/products/2 --> Ver Producto Id 2
    http://localhost:8080/products/7 --> Error, no existe Id

*/