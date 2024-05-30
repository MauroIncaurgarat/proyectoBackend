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

    async reduceStock(pId,unitsSold){

        await this.storage.reduceStock(pId,unitsSold)

    }

    //Paginate
    async getPage(pagequery){
        
        const page = pagequery || 1
        const products = await this.storage.paginate(page)
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
    }
    // Filtro Precio
    async priceFilter(order){   
         
        if (order == "asc"){
            return await this.storage.priceAggregate(1)
            
        }
        if (order == "desc"){
            return  await this.storage.priceAggregate(-1)
             
        }
        
    }
    // Filtro Stock
    async stockFilter(param){   
      
        if(+param == 1){ 
            return await this.storage.existStock()                  
        }
        if(+param == 0){
            return await this.storage.emptyStock()    
        }
    }
}

module.exports = {ProductService}