//API/MOCKING
const {Router} = require('express')
const router = Router()

//CONTROLLERS
const { MockingController } = require(`../controllers/mocking.controller`)

//SERVICE
const { ProductService } = require(`../services/productService`)

//INSTANCIAS CONTROLLER
const withMockingController = callback => {
    return (req, res) => {
        const service = new ProductService(
            req.app.get('product.storage')
        )
        const mockingController = new MockingController(service)
        return callback(mockingController, req, res)
    }
}

//GET
router.get('/', withMockingController( (mockingController, req ,res)=> mockingController.addMockingProduct(req , res)))

module.exports = router