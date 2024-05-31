module.exports = {

    userIsLoggedIn : (req, res, next) => {
        // el usuario debe tener una sesión iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
       
        if(!isLoggedIn) {
            return res.status(401).json({error: 'User should be logged in ! '})
            // return res.redirect('/') Podermos redirigir
        }

        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        // el usuario no debe tener una sesión iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        if(isLoggedIn) {
            return res.status(401).json({error: 'User should be not logged in ! '})
            // return res.redirect('/') Podermos redirigir
        }

        next()
    }
}