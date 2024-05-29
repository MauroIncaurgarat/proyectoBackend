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

//GET
router.get('/:cId', withCartController((cartController, req, res) => cartController.getCartPopulateById(req,res)))
//POST
router.post('/', withCartController((cartController, req, res) => cartController.addCart(req,res)))
router.post('/:cId/product/:pId', withCartController((cartController, req, res) => cartController.addProductToCart(req,res)))
//DELETE
router.delete('/:cId/product/:pId',  withCartController((cartController, req, res) => cartController.deleteProductToCart(req, res)))
router.delete('/:cId', withCartController((cartController, req, res) => cartController.cleanCart(req,res)))
//PUT
router.put('/:cId', withCartController((cartController, req, res) => cartController.upDateCart(req,res)))
router.put('/:cId/products/:pId',withCartController((cartController, req, res) => cartController.changeQuantity(req,res)))

//GET
router.get('/:cId/purchase', withCartController((cartController, req, res) => cartController.purchase(req,res)))


module.exports = router

/*
modle.exports = async () => { 
    
    return router
}
*/
