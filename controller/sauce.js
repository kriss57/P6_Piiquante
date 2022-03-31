//------------------------------------------//
//----Import des modules nécéssaires--------//

const Sauce = require('../models/sauces')
const fs = require('fs');


//----------------------------------------------------------------------//
//-----Methode Get pour toute les sauces---------lecture sauce----------//
/**
 * Methode Crud read all
 * @param {object} req objet de requete 
 * @param {object} res objet de reponse 
 * @param {function}  next 
 */
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

//----------------------------------------------------------------//
//-----Methode Get pour une sauce---------v2----------//
/**
 * Methode Crud read 
 * @param {object} req objet requete
 * @param {object} res objet séponse
 * @returns {res.json} la sauce trouvé
 */
exports.getOneSauce = async (req, res) => {
  let sauceId = (req.params.id)

  // Vérification si le champ id est présent et cohérent
  if (!sauceId) {
    return res.json(400).json({ message: 'Missing Parameter' })
  }

  try {
    // Récupération de la sauce
    let sauce = await Sauce.findOne({ _id: sauceId })

    // Test si résultat
    if (sauce === null) {
      return res.status(404).json({ message: 'This sauce does not exist !' })
    }

    // Renvoi de la sauce trouvé
    return res.json(sauce)
  } catch (err) {
    return res.status(500).json({ message: 'Database Error', error: err })
  }
}

//----------------------------------------------//
//-----Methode Post pour créer la sauce--------//
/**
 * Methode Crud Create 
 * @param {object} req objet de requete 
 * @param {object} res objet de reponse 
 * @param {function}  next 
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete req.body._id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Genérer l Url de l,image=> protocol => le nom d'hote => directory => nom du fichier
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce crée !' }))
    .catch(error => res.status(400).json({ error }));
}

//-----------------------------------------------// 
//---------------Methode update sauce-----------//
/**
 * Methode Crud Update 
 * @param {object} req objet de requete 
 * @param {object} res objet de reponse 
 * @param {function}  next 
 */
exports.updateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      const sauceObject = req.file
        ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
        }
        : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
  })
}

//----------------------------------------------//
//-----Methode delete pour supprimer la sauce--------//
/**
 * Methode Crud Delete 
 * @param {object} req objet de requete 
 * @param {object} res objet de reponse 
 * @param {function}  next 
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//-------------------------------------------------------------------//
//----Methode javascript--------- ---=> includes()---=>si tableau contient une valeur=>renvoie tru ou false
//----Operateur MondoDB----$inc---------------------=>opérateur incrémente un champ d'une valeur spécifiée 
//----Operateur MondoDB---$push--------------------=>opérateur ajoute une valeur spécifiée à un tableau
//----Operateur MondoDB--$pull--------------------=>opérateur supprime d'un tableau existant toutes les instances d'une ou plusieurs valeurs qui correspondent à une condition spécifiée.
//------------------------------------------------------------------//
//1- essayer de récuperere les tableaux usersLiked et usersDisliked
//2- findOne renvoi objet de requete recupere id

//------------------------------------------------------//
//-------Methode ajouter ou en elever un like---------// 
/**
 * 
 * @param {object} req objet de requete 
 * @param {object} res objet de reponse 
 * @param {function}  next 
 */
exports.thumbSauce = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
            .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }))
  }
}