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

//Modificar para que traiga los productos con populate
router.get('/:cId', async (req, res)=>{
   
    try{       
        const cartId = await cartManager.getCartPopulateById(req.params.cId)
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

        return res.status(200).json('Producto agregado con exito')

    }catch(err){
        res.status(404).json({error: err.message})
    }


})

router.delete('/:cId/product/:pId', async (req,res)=>{

    try{
        //Busco el Producto y verifico existencia Producto ID
        await productManager.getProductById(req.params.pId)
        //Busco el Carro y verifico existencia Carro ID
        await cartManager.getCartById(req.params.cId)
   
        //Eliminar el Producto al Carro
        await cartManager.deleteProductToCart(req.params.pId, req.params.cId)

        return res.status(200).json('Eliminado con exito')

    }catch(err){
        res.status(404).json({error: err.message})
    }


})

router.delete('/:cId', async (req,res)=>{

    try{
        //Busco el Carro y verifico existencia Carro ID
        const CartId = await cartManager.getCartById(req.params.cId)
   
        //Eliminar el Producto al Carro
        await cartManager.clearCart(CartId)

        return res.status(200).json('Cart clean')

    }catch(err){
        res.status(404).json({error: err.message})
    }


})

router.put('/:cId', async (req, res)=>{ 
    try{

        await cartManager.upDateCart(req.params.cId, req.body)

        return res.status(200).json(`Carrito ${req.params.cId} actualizado`)

    }catch(err){   
        res.status(404).json({error: err.message})    
    }
    
})

router.put('/:cId/products/:pId', async (req, res)=>{ 
    try{       
        //Verifico existencia Producto ID
        await productManager.getProductById(req.params.pId)
        //Verifico existencia Carro ID
        await cartManager.getCartById(req.params.cId)
        
        const newQuantity = +req.body.quantity
    
        await cartManager.changeQuantity(req.params.cId,req.params.pId,newQuantity)

        return res.status(200).json("Cantidad Modificada!")

    }catch(err){   
        res.status(404).json({error: err.message})    
    }
    
})


module.exports = router

