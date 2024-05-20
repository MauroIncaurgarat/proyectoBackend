// api/cart/ 
const {Router} = require('express')
const router = Router()

const { CartController } = require(`../controllers/cart.controller`)
const { CartService } = require(`../services/cartService`)
const { ProductService } = require(`../services/productService`)

//INSTANCIAS CONTROLLER
const withCartController = callback => {
    return (req, res) => {
        const productService = new ProductService(
            req.app.get('product.storage')
        )
        const cartService = new CartService(
          req.app.get('cart.storage')
        )
        
        const cartController = new CartController(cartService,productService)
        return callback(cartController, req, res)
    }
}


router.get('/:cId', withCartController((cartController, req, res) => cartController.getCartPopulateById(req,res)))

router.post('/', withCartController((cartController, req, res) => cartController.addCart(req,res)))
router.post('/:cId/product/:pId', withCartController((cartController, req, res) => cartController.addProductToCart(req,res)))

router.delete('/:cId/product/:pId',  withCartController((cartController, req, res) => cartController.deleteProductToCart(req, res)))
router.delete('/:cId', withCartController((cartController, req, res) => cartController.cleanCart(req,res)))

router.put('/:cId', withCartController((cartController, req, res) => cartController.upDateCart(req,res)))
router.put('/:cId/products/:pId',withCartController((cartController, req, res) => cartController.changeQuantity(req,res)))

module.exports = router

/*

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
*/



