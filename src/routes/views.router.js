const {Router} = require('express')
const router = Router()

const {userIsLoggedIn, userIsNotLoggedIn} = require(`${__dirname}/../middlewares/auth.middleware.js`)

const { UserService } = require(`../services/userService`)
const { ProductService } = require(`../services/productService`)
const { CartService } = require(`../services/cartService`)

const { ViewController } = require(`../controllers/view.controller`)

//INSTANCIAR CONTROLLER
const withViewController = callback => {
    return (req, res) => {
        //Servicio User
        const userService = new UserService(
          req.app.get('user.storage')
        )
        //Servicio Product
        const productService = new ProductService(
            req.app.get('product.storage')
        )
        //Servicio Cart
        const cartService = new CartService(
            req.app.get('cart.storage')
        )

        const viewController = new ViewController(userService, productService, cartService)
        return callback(viewController, req, res)
    }
}

//GET
router.get('/', withViewController((viewController, req,res)=>viewController.renderHome(req,res)))

router.get('/login',userIsNotLoggedIn, withViewController((viewController, req,res)=>viewController.renderLoggin(req,res)))

router.get('/reset_password',userIsNotLoggedIn, withViewController((viewController, req,res)=>viewController.renderResetPassword(req,res)))

router.get('/register',userIsNotLoggedIn, withViewController((viewController, req,res)=>viewController.renderRegister(req,res)))

router.get('/profile',userIsLoggedIn, withViewController((viewController, req,res)=>viewController.renderProfile(req,res)))

router.get('/products',userIsLoggedIn,  withViewController((viewController, req,res)=>viewController.renderDefaultProducts(req,res)))

router.get('/productos/',userIsLoggedIn, withViewController((viewController, req,res)=>viewController.renderPaginateProducts(req,res)))

router.get('/carts/:cId',userIsLoggedIn,withViewController((viewController, req,res)=>viewController.renderCart(req,res)))

module.exports = router