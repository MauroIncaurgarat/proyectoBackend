const { error } = require('console')
const ProductModel = require ('../models/product.model')

class ProductManager { 
  
    constructor() {}
    
    //Agregaro Productos
    async addProduct(title, description, price , thumbnail, code, stock=0) {
         
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
                            
    }

    //Leer Productos
    async getProduct(){
        const ProductData = await ProductModel.find()
        return ProductData.map(u => u.toObject({virtuals: true}))
    }

    //Obtener Producto ById
    async getProductById(id) {
        const ProductID = await ProductModel.find({_id : id})
        console.log(ProductID)
        return ProductID
    }

    //Eliminar Productos por ID
    async deletProductById(id){
       await ProductModel.deleteOne({_id: id})
    }

    //Actualizar Producto
    async upDateProduct(id,campos){

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
    }
    

}

module.exports = ProductManager
