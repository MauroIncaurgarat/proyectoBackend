const {Router} = require('express')
const router = Router()

const ProductManager = require(`${__dirname}/../dao/dbManager/productManager.js`)
const productManager = new ProductManager() 

router.get('/', async(__,res)=>{

    try{
        const products = await productManager.getProduct()
        console.log(products)
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
            pageTitle : 'Lista Productos',
            useWS: false,
            scripts: false
        })  
    }catch(err){
        console.log(err)
        res.status(500).end('Error interno Servidor / Home-Productos')
    }

})

module.exports = router