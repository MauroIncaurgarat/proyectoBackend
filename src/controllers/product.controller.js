
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
    async filterProduct(req,res){

       try{ 
       
            const {limit, page, price, stock} = req.query
            
            //Page
            if(page){
                const productPage = await this.service.getPage(page)
                return res.status(200).json({ productPage })
            }  
            //Disponibilidad
            if(stock){
                if(stock ==1 || stock ==0){
                    const stockProduct = await this.service.stockFilter(stock)
                    return res.status(200).json(stockProduct)
                }  
            }
            //FILTRO PRECIO ASCENDENTE O DESCENDENTE
            if(price){
                if(price == "asc"||price == "desc"){
                 const result = await this.service.priceFilter(price)
                 return res.status(200).json(result)
                }
            }
            //Limite
            if(limit){
                const products = await this.service.getProduct() 
                const element = products.length    
                if(limit == 0 ){
                    return res.status(200).json({Error: 'Ingresaron 0'})
                }
                if(limit <= element && limit > 0){ 
                    return res.status(200).json(await products.slice(0,limit))  
                }
             }  
            // return res.status(200).json( await this.service.getProduct() )

        }catch(err){
            return this.#handleError(err)
        }

    }

}
        
module.exports = {ProductController}