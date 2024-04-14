// api/products/ 
const {Router} = require('express')
const router = Router()
const ProductManager = require(`${__dirname}/../dao/dbManager/productManager.js`)
const productManager = new ProductManager() 

//INICIAR

// GET
router.get('/', async (req, res)=>{
    try { 
        const {limit, page} = req.query
        // Page
        if(page){
            const productPage = await productManager.getPage(page)
            let PrevLink
            let NextLink

            if(productPage.totalDocs < page || page <= 0 ){
                res.status(404).json({error: "Page dont Exist"})
            }
            
            if(productPage.hasPrevPage && productPage.hasNextPage){      
                PrevLink = "http://localhost:8080/api/product?page=" + productPage.prevPage
                NextLink =  "http://localhost:8080/api/product?page=" +productPage.nextPage 
     
            }else if (!productPage.hasPrevPage && productPage.hasNextPage){
                PrevLink = null
                NextLink =  "http://localhost:8080/api/product?page=" +productPage.nextPage
            }else{
                PrevLink = "http://localhost:8080/api/product?page=" + productPage.prevPage
                NextLink =  null
            }
            
            res.status(200).json({ 
                status: "succes",
                payload: productPage.docs,
                totalPage: productPage.totalPages,
                prevPage: productPage.prevPage,
                nextPage: productPage.nextPage,
                page: productPage.page,
                hasPrevPage: productPage.hasPrevPage,
                hasNextPage: productPage.hasNextPage,
                prevLink: PrevLink,
                nextLink: NextLink

            })

        }
        /*Agregar Filtros de: Categoria, disponibilidad, precio (asc y desc) */

        if(limit){
            const products = await productManager.getProduct() 
            const element = products.length    
            if(limit ==0 ){
                res.status(200).json({Error: 'Ingresaron 0'})
                
            }
            
            if(limit <= element && limit > 0){ 
                res.status(200).json(products.slice(0,limit))
                
            }else{
                res.status(200).json({Error: 'No existen tantos productos',TotalProducts: element})
                
            }
            
           
        }  

    }catch(err){
        res.json({error: 'Error al obtener productos'})
        //throw err
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

