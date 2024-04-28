const { error } = require('console')
const ProductModel = require ('../models/product.model.js')

class ProductManager {   
    constructor() {}
    
    //Agregar Productos
    async addProduct(title, description, price , thumbnail, code, stock=0) {
        try{  
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
            //creamos usuarion con Model Mongo DB
            await  ProductModel.create ({
                title : title.trim(),  
                description : description.trim(),
                code : code.trim(),
                price,
                stock ,
                thumbnail : thumbnail.trim()
            })
        }catch{
            throw new Error("Error al agregar producto")
        }               
    }
    //Leer Productos
    async getProduct(){
        try{ 
            const ProductData = await ProductModel.find()
            return ProductData.map(u => u.toObject({virtuals: true}))
        }catch{
            throw new Error("Error al obtener productos")
        }
    }   
    //Obtener Producto ById
    async getProductById(id) {
        try{ 
            return await ProductModel.find({_id : id})
        }catch{
            throw new Error("Invalid Product ID")
        }
    }

    //Eliminar Productos por ID
    async deletProductById(id){
        try{ 
            await ProductModel.deleteOne({_id: id})
        }catch{
            throw new Error("No existe Id")
        }
    }

    //Actualizar Producto
    async upDateProduct(id,campos){
        try{ 
            return await ProductModel.updateOne(
                {_id: id}, //Filtro
                {$set: { //Como quiero que actualice
                title: campos.title,
                description: campos.description,
                price: campos.price,
                thumbnail: campos.thumbnail,
                code: campos.code,
                stock: campos.stock,
                id: campos.id}
            })
        }catch{
            throw new Error("Error al actualizar")
        }
    }

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
}

module.exports = ProductManager
