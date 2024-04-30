const passport = require('passport') //libreria base
const { Strategy } = require('passport-github2')
const User = require(`${__dirname}/../dao/models/user.model`)
//const hashingUtils = require(`${__dirname}/../utils/hashing`)
const {clientID, clientSecret, callbackURL} = require ('./github.private')


const initializeGitHubStrategy = () =>{

    passport.use('github', new Strategy({
        //configuracion
        clientID,
        clientSecret,
        callbackURL
      //estrategia  
    },async(_accesToken, _refreshToken,profile, done) => {
        try{ 
            console.log('Profile Giyhub',profile)

            const user = await User.findOne({email: profile._json.email})
            if(user){ 
                return done(null, user) //si existe el usuario termina el proceso
            }

            //crear usuario, ya que no existe
            const fullName = profile._json.name
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '))
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1)
            const newUser = {
                firstName,
                lastName,
                age: 30,
                email: 'nullenGitHub@gmail.com', //no carga de github
                password: ' ' //debo colocar para que no me falle la authenticación
            }
            const result = await User.create(newUser)
            done(null, result)
        }catch (err){
            done(err)
        }
    }))
    
    passport.serializeUser((user, done)=>{

        console.log('serialized!', user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id,done)=>{

        console.log('desserialized!', id)
        const user = await User.findById(id)
        done(null,user)

    })

}

module.exports = initializeGitHubStrategy