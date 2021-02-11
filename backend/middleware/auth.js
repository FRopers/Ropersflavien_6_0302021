const jwt = require('jsonwebtoken');
require('dotenv').config();

const privateKey = process.env.JWT_PRIVATEKEY;

/*Vérifie si le token utilisé correspond à un utilisateur*/
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedtoken = jwt.verify(token, privateKey);
        const userId = decodedtoken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};