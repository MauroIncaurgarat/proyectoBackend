const {Router} = require('express')
const router = Router()

const ProductManager = require(`${__dirname}/../productManager.js`)
const filename = (`${__dirname}/../../assets/products.json`)
const fileId = (`${__dirname}/../../assets/LastId.json`)
const productManager = new ProductManager(filename,fileId) 


router.get('/', async(__,res)=>{

    try{
        const products = await productManager.getProduct()

        const productData = products.map( product => ({

            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock
        
        }))

        res.render('home',{
            products : productData,
            pageTitle : 'Lista Productos'
        })


    }catch(err){
        console.log(err)
        res.status(500).end('Error interno Servidor / Home-Productos')
    }

})

module.exports = router