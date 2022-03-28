//------------------------------------------//
//----Import des modules nécéssaires--------//

const Sauce = require('../models/sauces')
const fs = require('fs')

//-----------------------------------------------//
//-----Methode Get pour toute les sauces---------lecture sauce----------//
/*exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))

}*/

//-----------------TEST 2--------OK----------------------//
//-----Methode Get pour toute les sauces---------lecture sauce----------//
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}



//-----------------------------------------------//
//-----Methode Get pour une sauce---------lecture sauce----------//
/*exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}*/

//----------------TEST 2------OK-------------------------//
//-----Methode Get pour une sauce---------lecture sauce----------//
exports.getOneSauce = async (req, res) => {
  let sauceId = (req.params.id)

  // Vérification si le champ id est présent et cohérent
  if (!sauceId) {
    return res.json(400).json({ message: 'Missing Parameter' })
  }

  try {
    // Récupération du cocktail
    let sauce = await Sauce.findOne({ _id: sauceId })

    // Test si résultat
    if (sauce === null) {
      return res.status(404).json({ message: 'This cocktail does not exist !' })
    }

    // Renvoi du Cocktail trouvé
    return res.json(sauce)
  } catch (err) {
    return res.status(500).json({ message: 'Database Error', error: err })
  }
}


//----------------------------------------------//
//-----Methode Post pour créer la sauce--------//
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

/*//--------------TEST2--------------------------------//
//-----Methode Post pour créer la sauce--------//
exports.createSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete req.body._id
  // Validation des données reçues
  if (!sauceObject) {
    return res.status(400).json({ message: 'Missing Data' })
  }

  try {
    // Vérification si la saucel existe
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Genérer l Url de l,image=> protocol => le nom d'hote => directory => nom du fichier
    })

    // Céation de la sauce

    sauce = await Sauce.save()
    return res.json({ message: 'Sauce Created' })
  } catch (err) {
    return res.status(500).json({ message: 'Database Error', error: err })
  }
}*/


//-----------------------------------------------//  //reste a effacer ancienne img si change img
//-----Methode update sauce-----------//
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
exports.thumbSauce = (req, res, next) => {
  if (req.body.like === 1) {
    console.log('requet front like a 1')
    //Mise a jour Bdd---------// //chaque user peu ajouter 1 like++
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then(() => res.status(201).json({ message: 'Sauce like +1 !' }))
      .catch((error) => res.status(400).json({ error }))
  }


  /*  Sauce.findOne({ _id: req.param.id })               //recherche id
      .then((sauce) => {
        if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
          console.log('userId n est pas dans la Bdd et requet front like a 1')
          //Mise a jour Bdd---------//
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(201).json({ message: 'Sauce like +1 !' }))
            .catch((error) => res.status(400).json({ error }))
        }
        //like = 0 (likes = 0 , pas de vote)
        if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
          console.log('userId est  dans la Bdd et requet front like a 0')
          //Mise a jour Bdd---------//
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
            .then(() => res.status(201).json({ message: 'Sauce like 0 !' }))
            .catch((error) => res.status(400).json({ error }))
        }
        //like = -1 (dislikes =+1)
        if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
          console.log('userId est  dans usersDisliked et disLikes = 1')
          //Mise a jour Bdd---------//
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(201).json({ message: 'Sauce usersDisliked +1 !' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }*/


}