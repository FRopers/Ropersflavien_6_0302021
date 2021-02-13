let passwordValidator = require('password-validator');

let schema = new passwordValidator();

schema
.is().min(8)                                    // Longueur minimale 8  
.has().uppercase()                              // Doit avoir des lettres majuscules
.has().lowercase()                              // Doit avoir des lettres minuscules
.has().digits(1)                                // Doit avoir au moins 1 chiffres

/*Vérifie si le mot de passe correspond aux restrictions incorporées dans schema*/
module.exports = (req, res, next) => {
        if (schema.validate(req.body.password) === false) {
            res.status(401).json({ message: 'Mot de passe incorrect !' })
        } else {
            next();
        }
};
