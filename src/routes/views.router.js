const {Router} = require('express')
const router = Router()
const User = require(`${__dirname}/../dao/models/user.model`)
const ProductManager = require(`${__dirname}/../dao/dbManager/productManager.js`)
const CartManager = require(`../dao/dbManager/cartManager.js`)
const {userIsLoggedIn, userIsNotLoggedIn} = require(`${__dirname}/../middlewares/auth.middleware.js`)

const productManager = new ProductManager() 
const cartManager = new CartManager()

router.get('/', async(req,res)=>{

    try{   
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        res.render('index',{
            pageTitle : 'Home',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
           
        })  

    }catch(err){
        console.log(err)
        res.status(500).end('Error interno Servidor / Home')
    }

})

router.get('/login',userIsNotLoggedIn, async(__,res)=>{

    try{   
        res.render('login',{
            pageTitle : 'Login',
        })  

    }catch(err){
        console.log(err)
        res.status(500).end('Error Login')
    }

})

router.get('/register',userIsNotLoggedIn, async(req,res)=>{

    try{   
        res.render('register',{
            pageTitle : 'Register',
        })  

    }catch(err){
        console.log(err)
        res.status(500).end('Error register')
    }

})

router.get('/profile',userIsLoggedIn, async(req,res)=>{

    try{   
        const idFromSession = req.session.user._id

        const user = await User.findOne({_id: idFromSession})

        res.render('profile',{
            pageTitle : 'Register',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email
            }
        })  

    }catch(err){
        console.log(err)
        res.status(500).end('Error Profile')
    }
})


router.get('/products',userIsLoggedIn, async(req ,res)=>{

    try{   
        const idFromSession = req.session.user._id
        const user = await User.findOne({_id: idFromSession})

        const memoryProducts = await productManager.getProduct()
        // limito la vista a 10 productos
        const products = memoryProducts.slice(0,10)
        const productData = products.map( product => ({
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            id: product.id
        }))
        
        res.render('home',{
            products : productData,
            pageTitle : 'Catalogo Productos',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            scripts: false
        })  

    }catch(err){
        console.log(err)
        res.status(500).end('Error interno Servidor / Home-Productos')
    }

})

router.get('/products/',userIsLoggedIn, async(req,res)=>{

    try{
        const {page} = req.query
        
        if(page){ 
            const productPage = await productManager.getPage(page)

            if(productPage.totalPage < page || page <= 0 ){
                const producDefault = await productManager.getPage(1)
                res.render('page', {
                    pageTitle : 'Productos',
                    err : true,
                    products : producDefault,
                    script: false
                })
            }
          
            res.render('page', {
            pageTitle : 'Productos',
            products : productPage,
            err:false,
            script: false
            })
        }

    }catch(err){
       
        res.status(500).end('Error interno Servidor / Home-Productos')
    }

})

router.get('/carts/:cId',userIsLoggedIn, async(req,res)=>{

    try{
        const cart = await cartManager.getCartPopulateById(req.params.cId)
        const Newcart = cart.map(u => u.toObject({virtuals: true}))
        const array = Newcart[0].products
       
        res.render('cart', {
            pageTitle : 'Carrito',
            products : array,
            script: false
        })
        
    }catch(err){
        res.status(404).end({Error: err.message})
    }

})

module.exports = router