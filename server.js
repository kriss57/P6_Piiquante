//----------------------------------------------//
//--------Import des modules nécessaires-------//
const express = require('express')
const cors = require('cors')
//const bodyParser = require('body-parser')          //A VOIR
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')          //Conflit avec CORS  notSameOrigin

//-------------------------------------------//
//---------Initialisation de l'API----------//
const app = express()

app.use(cors())
app.use(express.json())
//app.use(helmet())
app.use(express.urlencoded({ extended: true }))   // A VOIR

//-----------------------------------------//
//-------Import des modules de routage----//
const user_router = require('./routes/user')
const sauce_router = require('./routes/sauce')

//-----------------------------------------//
//-------Mise en place du routage---------//
app.get('/', (req, res) => res.send(`Je suis la !`))

//-------------middleware------------------//
app.use('/api/auth', user_router) //connecter au routeur 
app.use('/api/sauces', sauce_router)

//-----middleware pour requete au dossier 'images'---//
app.use('/images', express.static(path.join(__dirname, 'images')))

/*//middleware pour accéder a l'API depuis tout origine '*'
//Ajoute les headers (Origin, X-Request-With,ect..)
//Envoyé des requetes (get, post ,put ......)           -------A VOIR CI N2C2SSAIRE  TEST A FAIRE
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});*/

app.all('*', (req, res) => res.status(501).send(`Mais qu'est ce que tu fait la ?`)) //Ressource non implémenté

//---------------------------------------------------//
//-----------Start serveur avec test DB-------------//
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Serveur start on port ${process.env.SERVER_PORT} !`)
    })
  })
  .catch(() => console.log('Connexion à MongoDB échouée !'));










