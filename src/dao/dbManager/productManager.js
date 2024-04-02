const { error } = require('console')
const ProductModel = require ('../models/product.model.js')

class ProductManager {   
    constructor() {}
    
    //Agregaro Productos
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
                status : true ,
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
}

module.exports = ProductManager
