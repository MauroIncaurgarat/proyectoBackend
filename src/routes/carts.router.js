// api/cart/ 
const {Router} = require('express')
const CartManager = require(`${__dirname}/../cartManager.js`)
const ProductManager = require(`${__dirname}/../productManager.js`)

const router = Router()
//Rutas de Carts
const cartFile = (`${__dirname}/../../assets/carts.json`)
const cartIdFile = (`${__dirname}/../../assets/lastIdCart.json`)
//Ruta Productos
const productFile = (`${__dirname}/../../assets/products.json`)
const productId = (`${__dirname}/../../assets/LastId.json`)
//Creamos instancias
const productManager = new ProductManager(productFile,productId) 
const cartManager = new CartManager(cartFile,cartIdFile)


cartManager.initialize()
productManager.initialize()

router.post('/', async (_,res)=>{

    try {
        cartManager.addCart()
        res.status(200).json('Se Creo Carrito !')
    }catch(err){
        res.status(404).json({error: err.message})
    }

})

router.get('/:cId', async (req, res)=>{
   
    try{       
        const cartId = await cartManager.getCartById(+req.params.cId)
        return res.status(200).json(cartId)

    }catch(err){   
        res.status(404).json({error: err.message})    
    }
})

router.post('/:cId/product/:pId', async (req,res)=>{

    try{
        //Busco el Producto y verifico existencia Producto ID
        const ProductId = await productManager.getProductById(+req.params.pId)
        //Busco el Carro y verifico existencia Carro ID
        const CartId = await cartManager.getCartById(+req.params.cId)
        
        //Agrego el Producto al Carro
        cartManager.addProductToCart(ProductId, CartId)

        return res.status(200).json('Agregado con exito')

    }catch(err){
        res.status(404).json({error: err.message})
    }


})

module.exports = router

