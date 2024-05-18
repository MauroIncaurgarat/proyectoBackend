class ProductController {   

    constructor(service) {
        this.service = service
    }
    
    #handleError(res,err) {
       
        if(err.message === 'not found') {
            return res.status(404).json({error: 'Not found'})
        }

        if(err.message === 'invalid parameters'){
            return res.status(400).json({error: 'Invalid Parameters'})
        }

        return res.status(500).json({error : err})

    }

    //Agregar Productos
    async addProduct(req, res) {
        try{  
            const title = req.body.title
            const description = req.body.description 
            const price = +req.body.price 
            const thumbnail = req.body.thumbnail 
            const code = req.body.code 
            const stock = +req.body.stock 

            //Number Check
            if(isNaN(price)) {         
                throw new Error("Price must be a number")           
            }else if(isNaN(stock)){       
                throw new Error("Stock must be a number")
            }       
            //Falto un campo
            if(!title || !description || !price  || !thumbnail || !stock){       
                throw new Error( `Falta un Campo`)
            }        
            //creamos usuario con Model Mongo DB

            await this.service.create(title,code,description,price,stock,thumbnail)
            
            res.status(200).json('Producto enviado')
    
        }catch(err){
            return this.#handleError(err)
        }               
    }
    //Leer Productos
    async getProduct(){
        try{ 
            const ProductData = await this.service.getProduct() //
            return ProductData.map(u => u.toObject({virtuals: true}))

        }catch(err){
            return this.#handleError(err)
        }
    }   
    //Obtener Producto ById
    async getProductById(req, res) {
        try{ 
            const id = req.params.pId
            return res.status(200).json(await this.service.getProductById(id)) 

        }catch(err){
            return this.#handleError(err)
        }
    }

    //Eliminar Productos por ID
    async deleteProductById(req, res){
        try{ 
            const id = req.params.pId
            await this.service.deleteProductById(id)

            res.status(200).json(`Producto ${req.params.pId} Eliminado !`)
        }catch(err){
            return this.#handleError(err)
        }
    }

    //Actualizar Producto
    async upDateProduct(req,res){
        try{ 
            const id = +req.params.pId
            const campos = req.body

            this.service.upDateProduct(id,campos)

            return res.status(200).json('Producto Actualizado !')
        }catch(err){
            return this.#handleError(err)
        }
    }

    //Filtros
   /*
    // Filtro Paginas    
         
    async getPage(pagequery){
        try { 
            const page = pagequery || 1
            const products = await ProductModel.paginate({},{limit: 5, page, lean: true })
            let PrevLink
            let NextLink

            if(products.totalPages < page || page <= 0 ){
                throw new Error("Page dont Exist")
            }
            
            if(products.hasPrevPage && products.hasNextPage){      
                PrevLink = "http://localhost:8080/api/product?page=" + products.prevPage
                NextLink =  "http://localhost:8080/api/product?page=" + products.nextPage 
     
            }else if (!products.hasPrevPage && products.hasNextPage){
                PrevLink = null
                NextLink =  "http://localhost:8080/productos/?page=" +products.nextPage
            }else{
                PrevLink = "http://localhost:8080/api/product?page=" + products.prevPage
                NextLink =  null    
            }

            const productPage = {
                status: "succes",
                payload: products.docs,
                totalPage: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: PrevLink,
                nextLink: NextLink
            }

            return productPage
        }catch(err){
            throw new Error("Found Page Error") 
        }
    }
    
    // Filtro Precio
    async priceFilter(order){   
        try{ 
            if (order == "asc"){
                const result = await ProductModel.aggregate([ 
                    {$sort: {price: 1 }}
                ])         
                return result
            }
            if (order == "desc"){
                const result = await ProductModel.aggregate([ 
                    {$sort: {price: -1 }}
                ])        
                return result
            }
        }catch(err){
             throw new Error("No funciona filtro")
        }
    }
    // Filtro Stock
    async stockFilter(param){   
        try{  
            if(param==1){ 
                const result = await ProductModel.aggregate([ 
                    {
                        $match: {stock: { $gt:0}}
                    }
                ]) 
                return result        
            }
            if(param==0){
                const result = await ProductModel.aggregate([ 
                    {
                        $match: {stock: { $eq:0}}
                    }
                ]) 
                return result
            }
          
        }catch(err){
             throw new Error("No funciona filtro")
        }
    }
    */
}

module.exports = {ProductController}