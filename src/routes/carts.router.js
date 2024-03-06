// api/cart/ 
const {Router} = require('express')
const CartManager = require(`${__dirname}/../cartManager.js`)
const ProductManager = require(`${__dirname}/../productManager.js`)

const router = Router()

const filename = (`${__dirname}/../../assets/carts.json`)
const fileId = (`${__dirname}/../../assets/lastIdCart.json`)

const cartManager = new CartManager(filename,fileId)

cartManager.initialize()

router.post('/', async (_,res)=>{

    try {
        cartManager.addCart()
        res.status(200).json('Se Creo Carrito !')
    }catch(err){
        throw new Error (err) 
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
        ProductManager.getProductById()


    }catch{

    }


})

module.exports = router

