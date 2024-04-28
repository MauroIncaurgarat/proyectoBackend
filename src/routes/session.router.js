const {Router} = require('express')
const { hashPassword, isValidPassword } = require('../utils/hashing')
const User = require(`${__dirname}/../dao/models/user.model`)

const router = Router()

router.post('/login', async (req, res)=>{
    
    try{ 
        const {email, password} = req.body //extraigo los datos del req

        if(!email || !password){
            return res.status(400).json({error: 'Invalid credentials'})
        }

        //1. Verificar que el usuario no exista en la BD
        const user = await User.findOne({ email})

        if(!user){
            return res.status(401).json({error: 'User not Found'})
        }

        //2. Validar su password
        if(!isValidPassword(password, user.password)){
            return res.status(401).json({error: 'Invalid password'})
        }

        // 3. Crear nueva sesion si el susuario existe
        req.session.user = { email, _id: user._id.toString() }

        //Una vez ingresado vamos a la vista de productos
        res.redirect('/products')

    }catch(err){
        return res.status(500).json({error: err})
    }
})

router.post('/register', async (req, res)=>{
    
    try{
        const {firstName, lastName, age, email, password} = req.body
        const adminpassword = password
        //Crear un usuario en la collection
        const user = await User.create({
            firstName, 
            lastName, 
            age: +age, 
            email, 
            password: hashPassword(password) //hashing password
        })
        
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

        //una vez creado el ususario hago un loggin
        req.session.user = { email, _id: user._id.toString() }
        //redirigimos al inicio
        res.redirect('/')

    }catch(err){
        return res.status(500).json({error: err})
    } 
})

router.post('/reset_password', async (req, res)=>{
    try{
        console.log(req.body)
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
    }catch{


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

module.exports = router

