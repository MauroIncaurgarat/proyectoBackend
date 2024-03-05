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

// PUT 
router.post('/', async(req,res)=>{

    console.log(req.body)
    res.end('producto enviado')
})



module.exports = router

/*
    Ruta POST --> Deberá agregar nuevo producto con los campos 
                  >>id: Number/String. Nunca deben repetirse
                    title: String
                    decription: String
                    code: String
                    price: title
                    Status: Boolean (True por defecto)
                    stock: Number
                    Category: String
                    Thumbnails: Arrat de string que contenga rutas de imagenes alamcenadas (No Obligatorio)

    Ruta PUT /:pid tomar un producto y actualizarlo de con los campos enviados desde el body.
                Ojo ID
    Ruta DELETE /:pid deberá eliminar el producti pid indicado
    
*/