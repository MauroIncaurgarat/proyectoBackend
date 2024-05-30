// api/cart/ 
const {Router} = require('express')
const router = Router()

const { TicketController } = require(`../controllers/ticket.controller`)
const { CartController } = require(`../controllers/cart.controller`)

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

//TICKET
//GET
router.get('/:cId/purchase', withTicketController((ticketController, req, res) => ticketController.purchase(req,res)))


module.exports = router
