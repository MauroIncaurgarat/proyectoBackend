const express = require('express')

const ProductManager = require('./productManager.js')

const app = express()
const filename = (`${__dirname}/../assets/products.json`)
const fileId = (`${__dirname}/../assets/LastId.json`)
const productManager = new ProductManager(filename,fileId) 
app.use(express.urlencoded({extended:true}))


app.get('/products', async (req, res)=>{
    try { 
        const newlimit = +req.query.limit
        const products = await productManager.readProductFromFile()     
        const element = products.length
        console.log(newlimit)
        
        if(newlimit)
            newlimit <= element && newlimit > 0
                ? res.json(products.slice(0,newlimit))
                : res.json({Error: 'No existen tantos productos',
                            TotalProducts: element})
        else{ 
            newlimit == 0
                ? res.json({Error: 'Ingresaron 0'})
                :res.json(products)
        }
    }

    catch(err){
        res.json({error: 'Error al obtener productos'})
        //throw err
    }
    
})

app.get('/products/:pId', async (req, res)=>{
   
    try{    
        const productId = await productManager.getProductById(+req.params.pId)

        if(!productId){
            res.json({Error: 'No existe Id' })
            return
        }

        res.json(productId)
        return

    }catch(err){   
        res.json({error: err})    
    }
})

productManager.initialize()
    .then(()=>{ 
        app.listen(8080, ()=>{
        console.log(' Servidor Listo !')
        })
    })
    .catch( err => {
        console.log(err)
    })

/* URL TEXTING

    http://localhost:8080/products  --> Ver todos los productos

    http://localhost:8080/products?limit=2  --> Ver 2 elementos
    http://localhost:8080/products?limit=500 --> Error limite superado
    http://localhost:8080/products?limit=0 --> Error se ingreso 0


    http://localhost:8080/products/2 --> Ver Producto Id 2
    http://localhost:8080/products/7 --> Error, no existe Id



*/