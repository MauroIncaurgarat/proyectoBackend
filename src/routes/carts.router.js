// api/cart/ 
const {Router} = require('express')
const router = Router()
//MIDDLEWARES
const {userIsLoggedIn} = require(`${__dirname}/../middlewares/auth.middleware.js`)
const {roleUser} = require(`${__dirname}/../middlewares/rule.middleware.js`)

//CONTROLLERS
const { TicketController } = require(`../controllers/ticket.controller`)
const { CartController } = require(`../controllers/cart.controller`)

//SERVICES
const { CartService } = require(`../services/cartService`)
const { ProductService } = require(`../services/productService`)
const { TicketService } = require('../services/ticketService')
const { UserService } = require(`../services/userService`)

//INSTANCIAS CONTROLLER
const withTicketController = callback => {
    return (req, res) => {
        const ticketService = new TicketService(
            req.app.get('ticket.storage')
        )
        const cartService = new CartService(
            req.app.get('cart.storage')
        )
        const productService = new ProductService(
            req.app.get('product.storage')
        )
        const userService = new UserService(
            req.app.get('user.storage')
          )
        const ticketController = new TicketController(ticketService, cartService, productService, userService)
        return callback(ticketController, req, res)
    }
}

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

//CARTS
//GET
router.get('/:cId',userIsLoggedIn, withCartController((cartController, req, res) => cartController.getCartPopulateById(req,res)))
//POST
router.post('/',userIsLoggedIn,roleUser, withCartController((cartController, req, res) => cartController.createCart(req,res)))
router.post('/:cId/product/:pId',userIsLoggedIn, roleUser, withCartController((cartController, req, res) => cartController.addProductToCart(req,res)))
//DELETE
router.delete('/:cId/product/:pId',userIsLoggedIn,roleUser,  withCartController((cartController, req, res) => cartController.deleteProductToCart(req, res)))
router.delete('/:cId',userIsLoggedIn,roleUser, withCartController((cartController, req, res) => cartController.cleanCart(req,res)))
//PUT
router.put('/:cId',userIsLoggedIn, roleUser, withCartController((cartController, req, res) => cartController.upDateCart(req,res)))
router.put('/:cId/products/:pId',userIsLoggedIn, roleUser,withCartController((cartController, req, res) => cartController.changeQuantity(req,res)))

//TICKET
//GET
router.get('/:cId/purchase',userIsLoggedIn, withTicketController((ticketController, req, res) => ticketController.purchase(req,res)))


module.exports = router
