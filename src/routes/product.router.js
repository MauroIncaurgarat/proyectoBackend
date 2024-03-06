// api/products/ 
const {Router} = require('express')

const router = Router()

const ProductManager = require(`${__dirname}/../productManager.js`)

const filename = (`${__dirname}/../../assets/products.json`)
const fileId = (`${__dirname}/../../assets/LastId.json`)
const productManager = new ProductManager(filename,fileId) 

//INICIAR
productManager.initialize()

// GET
router.get('/', async (req, res)=>{
    try { 
        const newlimit = +req.query.limit
        const products = await productManager.readProductFromFile()     
        const element = products.length
        
        if(newlimit)
            newlimit <= element && newlimit > 0
                ? res.status(200).json(products.slice(0,newlimit))
                : res.status(200).json({Error: 'No existen tantos productos',
                            TotalProducts: element})
        else{ 
            newlimit == 0
                ? res.status(200).json({Error: 'Ingresaron 0'})
                : res.status(200).json(products)
        }
    }

    catch(err){
        res.json({error: 'Error al obtener productos'})
        //throw err
    }
})

router.get('/:pId', async (req, res)=>{
   
    try{    
        const ProductId = await productManager.getProductById(+req.params.pId)
        return res.status(200).json(ProductId)

    }catch(err){   
        res.status(404).json({error: err.message})    
    }
})

// POST 
router.post('/',async (req,res)=>{
    /*No puedo validar number and stock*/
    try{   
        //Ejecutar Add Product
        await productManager.addProduct(req.body.title, req.body.description, +req.body.price, req.body.thumbnail, req.body.code, +req.body.stock )
        
        res.status(200).json('Producto enviado')
    }
    catch(err){
        res.status(400).json({Error: err.message})
    }
})

// PUT
router.put('/:pId',async (req,res)=>{
    try { 
        await productManager.getProductById(+req.params.pId)
        
        await productManager.upDateProduct(req.body,+req.params.pId)

        res.status(200).json('Producto Actualizado !')

    }catch(err){
        res.status(404).json({Error: err.message})
    }
})

//DELETE
router.delete('/:pId', async(req,res)=>{
    try {   
        await productManager.deletProductFile(+req.params.pId)
        res.status(200).json(`Producto ${+req.params.pId} Eliminado !`)

    }catch(err){
        res.status(404).json({Error: err.message})
    }  
})

module.exports = router

