const {Router} = require('express')
const passport = require('passport')

const router = Router()

const { CartService } = require(`../services/cartService`)
const { UserController } = require(`../controllers/user.controller`)
const { UserService } = require(`../services/userService`)

//INSTANCIAR CONTROLLER
const withUserController = callback => {
    return (req, res) => {
        const userService = new UserService(
          req.app.get('user.storage')
        )
        const cartService = new CartService(
          req.app.get('cart.storage')
        )
        const userController = new UserController(userService,cartService)
        return callback(userController, req, res)
    }
}

//POST
router.post('/login',passport.authenticate('login', {failureRedirect: '/api/sessions/failloggin'}) ,withUserController((userController, req,res)=> userController.createSession(req, res)))
    
router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}) ,withUserController((userController, req,res)=> userController.register(req, res)))

router.post('/reset_password', withUserController( (userController, req,res)=> userController.resetPasword(req, res)))

//GET
router.get('/failloggin',withUserController((userController, req,res)=> userController.failLoggin(req, res)))

router.get('/failregister', (_,res) => {res.send('Error registering user!')})   

router.get('/logout', withUserController( (userController, req,res)=> userController.logOut(req, res)))

router.get('/current', withUserController( (userController, req,res)=> userController.CurrentUse(req, res)))
//GitHub
router.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res) => {})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/'}),withUserController((userController, req,res)=> userController.gitHubNormalizeId(req,res)))

module.exports = router

