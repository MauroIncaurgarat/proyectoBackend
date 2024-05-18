class ProductService {

    constructor(storage){
        this.storage = storage
    }

    async getProduct(){
        return await this.storage.getProduct()
    }

    async getProductById (id) {
        return await this.storage.getProductById(id)
    }

    async create(title,code,description,price,stock,thumbnail){
        this.storage.create(title,code,description,price,stock,thumbnail)
    }

    async deleteById (id){
        await this.storage.deleteProductById(id)
    }

    async upDateProduct(id, campos){
        return await this.storage.upDateProduct(id, campos)
    }
}

module.exports = {ProductService}