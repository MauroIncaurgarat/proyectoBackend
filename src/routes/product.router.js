// api/products/ 
const {Router} = require('express')
const router = Router()
const ProductManager = require(`${__dirname}/../dao/dbManager/productManager.js`)
const productManager = new ProductManager() 

//INICIAR

// GET
router.get('/', async (req, res)=>{
    try { 
        const {limit, page, price, stock} = req.query
      
        //MEJORAR MANEJO ERROR
        /*if({}){
            res.status(404).json({error: 'Error peticion'})
        }*/
        // Page
        if(page){
            const productPage = await productManager.getPage(page)
            res.status(200).json({ productPage })
        }

        //FILTRO DE DISPONIBILIDAD
        if(stock){
            if(stock ==1 || stock ==0){
                const stockProduct = await productManager.stockFilter(stock)
                res.status(200).json(stockProduct)
            }else{
                res.status(404).json({error: 'Filtro de stock incorrecto. Debe ser 1 / 0'})
            }
            
                
        }

        //FILTRO PRECIO ASCENDENTE O DESCENDENTE
        if(price){

           if(price == "asc"||price == "desc"){
                const result = await productManager.priceFilter(price)
                res.status(200).json(result)
            }else{
                res.status(404).json({error: 'Filtro de precio incorrecto. Debe ser asc / desc'})
            }
        }

        //Limite
        if(limit){
            const products = await productManager.getProduct() 
            const element = products.length    
            if(limit == 0 ){
                res.status(200).json({Error: 'Ingresaron 0'})
            }
            if(limit <= element && limit > 0){ 
                res.status(200).json(products.slice(0,limit))  
            }else{
                res.status(200).json({Error: 'No existen tantos productos',TotalProducts: element})   
            }
        }  
    }catch(err){
        res.status(404).json({error: err.message})
    }
})

router.get('/:pId', async (req, res)=>{
   
    try{    
        const ProductId = await productManager.getProductById(req.params.pId)
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
        await productManager.upDateProduct(req.params.pId,req.body)
        res.status(200).json('Producto Actualizado !')

    }catch(err){
        res.status(404).json({Error: err.message})
    }
})

//DELETE
router.delete('/:pId', async(req,res)=>{
    try {         
        await productManager.deletProductById(req.params.pId)
        res.status(200).json(`Producto ${req.params.pId} Eliminado !`)
    }catch(err){
        res.status(404).json({Error: err.message})
    }  
})

module.exports = router

