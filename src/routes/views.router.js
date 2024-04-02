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
    try{   
        if(!req.body.deleteId){          
           // 1 => Agregar en el product manager
            await productManager.addProduct(req.body.title, req.body.description, +req.body.price, req.body.thumbnail, req.body.code, +req.body.stock )
            
            //Necesito tener el elemento agregado con el ID para identificar luego en html
            const productArray = await productManager.getProduct()
            const ultimaPosicion = productArray.length - 1
            const lastProduct = productArray[ultimaPosicion]

            // 2 => Notificar a los clientes (browser) mediante wqebsocket que se agrego un producto nuevo
            req.app.get('ws').emit('newProduct', lastProduct)
        }
        if(req.body.deleteId){

            console.log(req.body.deleteId)
            await productManager.deletProductById(req.body.deleteId)
             //Notificar a los clientes (browser) mediante wqebsocket que se elimino un producto nuevo
            req.app.get('ws').emit('deleteProduct', req.body.deleteId)
        }
        res.status(200).json(req.body)
    }
    catch(err){
        res.status(400).json({Error: err.message})
    }
})

router.get('/chat', async(__,res)=>{

    res.render('chat',{
        pageTitle : 'aplicacion de chat',
        useWS: true,
        useSweetAlert: true,
        scripts: [
            'chat.js'
        ]
    })

})   

module.exports = router