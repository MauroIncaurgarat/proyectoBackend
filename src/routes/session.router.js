const {Router} = require('express')
const { hashPassword } = require('../utils/hashing')
const User = require(`${__dirname}/../dao/models/user.model`)
const passport = require('passport')

const router = Router()

router.post('/login',passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}) ,async (req, res)=>{
    
    try{                
        //Crear nueva sesion si el susuario existe

        //req.user inyecta passport
        req.session.user = { email: req.user.email, _id: req.user._id }
    
        //Una vez ingresado vamos a la vista de productos
        res.redirect('/products')

    }catch(err){
        return res.status(500).json({error: err})
    }
})

router.get('failloggin',(_,res)=>{
    res.send('Login Failed!')
})

router.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res) => {})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/'}), (req,res)=>{

    req.session.user = {_id: req.user._id} //siga funcionando el perfil con _id

    res.redirect('/products')

})

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}) , async (req, res)=>{
    
    try{
        console.log('Se registro usuario!', req.user)
        //Si el registro fue exitoso redireccionamos
        res.redirect('/')
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
        return res.status(500).json({error: err})
    } 
})

router.get('/failregister', (_,res) => {
    res.send('Error registering user!')
})

router.post('/reset_password', async (req, res)=>{
    try{
        const {email, password} = req.body
        //Validaciones
        if(!email || !password){
            return res.status(400).json({error: 'Invalid credentials'})
        }

        //1. Verificar que el usuario no exista en la BD
        const user = await User.findOne({ email})

        if(!user){
            return res.status(401).json({error: 'User not Found'})
        }

        await User.updateOne(
            { //Filtro
                email: user.email, //Buscar Email
            },
            {   //Seteo nueva cantidad     
                $set : {password: hashPassword(password)}
            }
        )

        res.redirect('/')
    }catch(err){
        console.log(err)
        res.status(500).end('Error Reset')

    }
})

router.get('/logout', async (req, res) => {
    try { 
        req.session.destroy(__ => {
        res.redirect('/')
        })
    }catch(err){
        return res.status(500).json({error: err})
    }
})

router.get('/current', async (req,res) => {
 
    try{   
        const currentUser = req.user
        
        if(!currentUser){
            console.log('Dont exist user')
            res.redirect('/login')
        }
        res.send({'Usuario Actual': currentUser})

    }catch(err){
        return res.status(500).json({error: err})
    }
})

module.exports = router

