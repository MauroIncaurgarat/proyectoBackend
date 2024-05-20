class ViewController{

    constructor(userService, productService, cartService){
        //servicio de User
        this.userService = userService
        this.productService = productService
        this.cartService = cartService
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

    async renderHome(req, res){
        try{   
            const isLoggedIn = ![null, undefined].includes(req.session.user)
    
            res.render('index',{
                pageTitle : 'Home',
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
               
            })  
    
        }catch(err){
            return this.#handleError(err)
        }   
    }

    async renderLoggin(req,res){
        try{   
            res.render('login',{
                pageTitle : 'Login',
            })  
    
        }catch(err){
            return this.#handleError(err)
        }   
    
    }

    async renderResetPassword(req,res){
        try{   
            res.render('reset_password',{
                pageTitle : 'Reset Password',
            })  
    
        }catch(err){
            return this.#handleError(err)
        }   

    }

    async renderRegister(__, res){
    
        try{   
            res.render('register',{
                pageTitle : 'Register',
            })  
    
        }catch(err){
            return this.#handleError(err)
        }    
    }

    async renderProfile(req  ,res){
        try{ 
            const idFromSession = req.session.user._id
            
            const user = await this.userService.findOneUser(idFromSession)

            res.render('profile',{
                pageTitle : 'Register',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    role: user.role
                }
            })
        }catch(err){
            return this.#handleError(err)
        }    
    }

    async renderDefaultProducts(req,res){

        try{   
            const idFromSession = req.session.user._id
            //servicio User
            const user = await this.userService.findOneUser({_id: idFromSession})
            //Servicio Product
            const memoryProducts = await this.productService.getProduct()
            
            // limito la vista a 10 productos
            const products = memoryProducts.slice(0,10)
            const productData = products.map( product => ({
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                id: product.id
            }))
            
            res.render('home',{
                products : productData,
                pageTitle : 'Catalogo Productos',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },
                scripts: false
            })  
    
        }catch(err){
            return this.#handleError(err)
        }    
    }

    async renderPaginateProducts(req,res){
        try{
            const {page} = req.query
            console.log(req.query)
            if(page){ 
                const productPage = await this.productService.getPage(page)
                console.log(productPage)
                if(productPage.totalPage < page || page <= 0 ){
                    const producDefault = await this.productService.getPage(1)
                    res.render('page', {
                        pageTitle : 'Productos',
                        err : true,
                        products : producDefault,
                        script: false
                    })
                }
              
                res.render('page', {
                    pageTitle : 'Productos',
                    products : productPage,
                    err:false,
                    script: false
                })
            }
    
        }catch(err){
            return this.#handleError(err)
        }    
    }

    async renderCart(req,res){

        try{
            const cart = await this.cartService.getCartPopulateById(req.params.cId)
            const Newcart = cart.map(u => u.toObject({virtuals: true}))
            const array = Newcart[0].products
           
            res.render('cart', {
                pageTitle : 'Carrito',
                products : array,
                script: false
            })
            
        }catch(err){
            res.status(404).end({Error: err.message})
        }
    }

}
module.exports = {ViewController}