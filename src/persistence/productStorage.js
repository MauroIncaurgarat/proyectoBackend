const { error } = require('console')
const ProductModel = require ('../dao/models/product.model.js')

class productStorage {

    constructor(){}

    async create(title,code,description,price,stock,thumbnail){

        await ProductModel.create ({
            title : title.trim(),  
            description : description.trim(),
            code : code.trim(),
            price,
            stock ,
            thumbnail : thumbnail.trim()
        })

    }

    async getProduct(){
        return await ProductModel.find()
    }

    async getProductById (id){
        return await ProductModel.find({_id : id})
    }

    async deleteProductById(id){
        return  await ProductModel.deleteOne({_id: id})
    }

    async upDateProduct(id, campos){
        await ProductModel.updateOne(
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

module.exports = { productStorage }