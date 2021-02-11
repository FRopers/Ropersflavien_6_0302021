const Sauce = require('../models/sauce');
const fs = require('fs');

/*Recherche et envoie toutes les sauces*/
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/*Recherche et envoie une sauce*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/*Récupère les données envoyées et les sauvegarde dans la bdd, sauvegarde l'image dans le dossier image*/
exports.createSauce = (req, res, next) => { 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(sauce => res.status(201).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

/*Récupère les modifications et les sauvegarde dans le bdd*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

/*Recherche la sauce appelée et la supprime de la bdd, supprime l'image du dossier image*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(400).json({ error }));
};

/*Recherche la sauce liker ou disliker dans la bdd. Selon son choix le comptabilise et sauvegarde le userID*/
exports.changeLikeAndDislikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1 && sauce.usersLiked.indexOf(sauce.userId) === -1) {
                sauce.likes += 1;
                sauce.usersLiked.push(sauce.userId);
            }
            if (req.body.like === -1 && sauce.usersDisliked.indexOf(sauce.userId) === -1) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(sauce.userId);
            }
            if (req.body.like === 0) {
                if (sauce.usersLiked.indexOf(sauce.userId) === 0) {
                    sauce.likes -= 1;                    
                    sauce.usersLiked.splice(sauce.userId, 1);
                }
                if (sauce.usersDisliked.indexOf(sauce.userId) === 0) {
                    sauce.dislikes -= 1;
                    sauce.usersDisliked.splice(sauce.userId, 1); 
                }
            }
            Sauce.updateOne({ _id: req.params.id }, sauce)
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};