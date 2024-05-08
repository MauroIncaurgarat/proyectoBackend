const passport = require('passport') //libreria base
const { Strategy } = require('passport-local')
const User = require(`${__dirname}/../dao/models/user.model`)
const hashingUtils = require(`${__dirname}/../utils/hashing`)

const initializeStrategy = () =>{

    //STRATEGY FOT REGISTER
    passport.use('register',new Strategy({
        //configurar strategy
        passReqToCallback: true,
        usernameField: 'email' //nuestro username es email

        //Nuestro CallBack 
    },  async (req, username, password, done) => { 

        //debemos registrar nuestro usuario
        const {firstName, lastName, age, email} = req.body        
    
        try{
            const user = await User.findOne({ email : username})

            if(user){
                //error, usuario con ese email ya existe
                return done(null, false)
            }

            const newUser = {
                firstName, 
                lastName, 
                age: +age, 
                email, 
                password: hashingUtils.hashPassword(password)
            }

            const result = await User.create(newUser)
            // usuario nuevo creado exitosamente
            return done(null, result)

        }catch (err) {
            //error inesperado
            done(err)
        }    
    
    }))

    //STRATEGY FOT LOGIN
    passport.use('login',new Strategy({
        //configurar strategy
        usernameField: 'email' //nuestro username es email

        //Nuestro CallBack 
    },  async (username, password, done) => {
    
        try{
            
            if(!username || !password){
                return done(null,false)
            }

            //1. Verificar que el usuario no exista en la BD
            const user = await User.findOne({ email: username})

            if(!user){
                return done(null,false)
            }

            //2. Validar su password
            if(!hashingUtils.isValidPassword(password, user.password)){
                return done(null,false)
            }
            return done(null,user)
        }catch (err) {

            //error inesperado
            done(err)
        }    
    
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async (id,done)=>{

        const user = await User.findById(id)
        done(null,user)

    })

}

module.exports = initializeStrategy