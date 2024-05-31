                                        //API/PRODUCT
const {Router} = require('express')
const router = Router()

//MIDDLEWARES
const {userIsLoggedIn} = require(`${__dirname}/../middlewares/auth.middleware.js`)
const {roleAdmin} = require(`${__dirname}/../middlewares/rule.middleware.js`)
//CONTROLLERS
const { ProductController } = require(`../controllers/product.controller`)
const { ProductService } = require(`../services/productService`)

//INSTANCIAS CONTROLLER
const withProductController = callback => {
    return (req, res) => {
        const service = new ProductService(
          req.app.get('product.storage')
        )
        const productController = new ProductController(service)
        return callback(productController, req, res)
    }
}

//GET
router.get('/', withProductController( (productController, req,res)=> productController.filterProduct(req, res)))
router.get('/:pId', withProductController( (productController, req,res)=> productController.getProductById(req, res)))
//POST
router.post('/',userIsLoggedIn, roleAdmin, withProductController( (productController, req,res)=> productController.addProduct(req, res)))
//PUT
router.put('/:pId',userIsLoggedIn, roleAdmin, withProductController( (productController, req,res)=> productController.upDateProduct(req,res)))
//DELETE
router.delete('/:pId',userIsLoggedIn, roleAdmin, withProductController( (productController, req,res)=> productController.deleteProductById(req, res)))

module.exports = router