const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const privateKey = process.env.JWT_PRIVATEKEY;

const User = require('../models/user');

/*Sauvegarde un utilisateur sur la bdd en utilisant bscrypt pour hash le password*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => { 
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

/*Vérifie si l'utilisateur loggé existe sur la bdd et utilise le bon mdp, si oui il lui attribue un token*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, privateKey,{ expiresIn: '24h'})
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error}));
};