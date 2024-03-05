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
        console.log(newlimit)
        
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
        const productId = await productManager.getProductById(+req.params.pId)
        
        if(!productId){
            res.status(404).json({Error: 'No existe Id' })
            return
        }

        return res.status(200).json(productId)

    }catch(err){   
        res.status(404).json({error: err})    
    }
})

// POST 
router.post('/',(req,res)=>{
    /*No puedo validar number and stock*/
    try{   
        const newProduct = req.body 
        if((Object.keys(newProduct)).length < 6) {     
            res.status(404).json("Ups, falta un parametro")
            return
        }  
        
        productManager.addProduct(newProduct.title, newProduct.description, +newProduct.price, newProduct.thumbnail, newProduct.code, +newProduct.stock )
        res.status(200).end('Producto enviado')
    }
    catch(err){
        res.status(404).json({Error: err})
    }
})

// PUT
router.put('/:pId',async (req,res)=>{
    try { 
        const productId = await productManager.getProductById(+req.params.pId)
        
        //Que exista el producto
        if(!productId){
            res.status(404).json({Error: 'No existe Id' })
            return
        }
        
        //Si mandan el code del producto debe coincidir
        if(req.body.code && productId.code !== req.body.code){
            res.status(406).json({Error: 'Code incorrect' })
            return
        }

        productManager.upDateProduct(req.body , +req.params.pId)
        res.status(200).json('Producto Actualizado !')

    }catch(err){
        res.status(404).json({Error: err})
    }
})

//DELETE
router.delete('/:pId', async(req,res)=>{

    try { 
        const productId = await productManager.getProductById(+req.params.pId)  
        //Que exista el producto
        if(!productId){
            res.status(404).json({Error: 'No existe Id' })
            return
        }

        productManager.deletProductFile(+req.params.pId)
        res.status(200).json(`Producto ${+req.params.pId} Eliminado !`)

    }catch(err){
        res.status(404).json({Error: err})
    }
    
})

module.exports = router
/*

    Ruta PUT /:pid tomar un producto y actualizarlo de con los campos enviados desde el body.
                Ojo ID


    Ruta DELETE /:pid deberá eliminar el producti pid indicado
    
*/
