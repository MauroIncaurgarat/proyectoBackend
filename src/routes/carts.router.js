// api/cart/ 
const {Router} = require('express')
const CartManager = require(`../dao/dbManager/cartManager`)
const ProductManager = require(`../dao/dbManager/productManager`)

const router = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()

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
        const cartId = await cartManager.getCartById(req.params.cId)
        return res.status(200).json(cartId)

    }catch(err){   
        res.status(404).json({error: err.message})    
    }
})

router.post('/:cId/product/:pId', async (req,res)=>{

    try{
        //Busco el Producto y verifico existencia Producto ID
        const ProductId = await productManager.getProductById(req.params.pId)
        //Busco el Carro y verifico existencia Carro ID
        const CartId = await cartManager.getCartById(req.params.cId)

   
        //Agrego el Producto al Carro
        await cartManager.addProductToCart(req.params.pId, CartId)

        return res.status(200).json('Agregado con exito')

    }catch(err){
        res.status(404).json({error: err.message})
    }


})

module.exports = router

