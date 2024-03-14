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


router.get('/realTimeProducts', async(__,res)=>{

    try{
        const products = await productManager.getProduct()
        const productData = products.map( product => ({

            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            id: product.id
        }))
        
        res.render('realTimeProducts',{
            
            products : productData,
            pageTitle : 'Productos Live',
            useWS: true,
            scripts: [
                'realTimeProduct.js'
            ]
        })
       
       return
    }catch(err){
        console.log(err)
        res.status(500).end('Error interno Servidor / Home-Productos')
    }
})
   

router.post('/realTimeProducts', async(req,res)=>{

    console.log(req.body)
    //Agregar al product manager
    try{   
        //Ejecutar Add Product
        await productManager.addProduct(req.body.title, req.body.description, +req.body.price, req.body.thumbnail, req.body.code, +req.body.stock )
        
        res.status(200).json('Producto enviado')
    }
    catch(err){
        res.status(400).json({Error: err.message})
    }
})

module.exports = router