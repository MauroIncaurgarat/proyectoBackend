const {currentResponse} = require (`../dto/responses/current.response`)

class UserController{

    constructor(userService, cartService){
        this.userService = userService
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

    async failLoggin(__ ,res) {
      
        try{                
            res.send('Login Failed!')
    
        }catch(err){
            return this.#handleError(err)
        }   
    }

    async register(req, res){
   
        try{
            
            //Si el registro fue exitoso redireccionamos
            res.redirect('/')
            const email = req.user.email
            //Le creamos un carro
            const newCart = await this.cartService.createCart()
            
            //inserto al User
            await this.userService.setCartId(email,newCart.id.toString())
            
            console.log('Se registro usuario!', req.user, ' Y su CartId es', newCart.id)

            /*
            if(email == "adminCoder@coder.com" && adminpassword == "adminCod3r123"){
                   
                await User.updateOne(
                    { //Filtro
                        email: "adminCoder@coder.com", //Coincide el ID de Carro
                    },
                    {   //Seteo nueva cantidad     
                        $set : {role: "admin"}
                    }
                )
                
            }
          */  
        }catch(err){
            return this.#handleError(err)
        }
    }

    async gitHubNormalizeId(req,res){
        try{
            req.session.user = {_id: req.user._id} //siga funcionando el perfil con _id
            res.redirect('/products')
        }catch(err){
            return this.#handleError(err)
        }
    }

    async createSession (req, res){
    
        try{                
            //Crear nueva sesion si el susuario existe
            
            //req.user inyecta passport
            req.session.user = { email: req.user.email, _id: req.user._id }
            
            //Una vez ingresado vamos a la vista de productos
            res.redirect('/products')
    
        }catch(err){
            return this.#handleError(err)
        }
    }
    
    async resetPasword(req, res){
        try{
            const {email, password} = req.body
            //Validaciones
            if(!email || !password){
                return res.status(400).json({error: 'Invalid credentials'})
            }
    
            //Verificar que el usuario no exista en la BD
            const user = await this.userService.find(email)
           
            if(!user){
                return res.status(401).json({error: 'User not Found'})
            }
            
            await this.userService.upDatePassword(user.email, password )
        
            res.redirect('/')
        }catch(err){
            return console.log(err) 
        }
    }
    
    async logOut(req, res) {
        
        try { 
            req.session.destroy(__ => {
                res.redirect('/')
            })
        }catch(err){
            return this.#handleError(err)
        }
    }
    
    async CurrentUser(req,res) {
     
        try{   
            const currentUser = req.user
            
            if(!currentUser){
                console.log('Dont exist user')
                res.redirect('/login')
            }

            res.send( new currentResponse(currentUser))
    
        }catch(err){
            return this.#handleError(err)
        }
    }
    
}

module.exports = {UserController}