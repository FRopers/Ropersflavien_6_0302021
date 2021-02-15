const rateLimit = require("express-rate-limit");

/*Attribue une limite de requête*/
exports.LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10// limites à 10 requêtes toutes les 15 minutes
});
