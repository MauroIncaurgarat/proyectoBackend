module.exports = {

    roleUser : (req, res, next) => {
        // el usuario debe ser User
        const role = req.user.role

        if(role == 'admin') {
            return res.status(401).json({error: 'You are admin, Users only ! '})
            // return res.redirect('/') Podermos redirigir
        }

        next()
    },

    roleAdmin: (req, res, next) => {
        // el usuario no debe tener una sesión iniciada
        const role = req.user.role

        if(role == 'user') {
            return res.status(401).json({error: 'You are User, Admin only ! '})
        }

        next()
    }
}