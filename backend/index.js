const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./models/db');
const routes = require('./routes'); // Import central routes

const app = express();
const port = 5000;

// Charger les variables d'environnement
dotenv.config();
const { NODE_ENV } = process.env;
console.log('Environnement:', NODE_ENV);

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
if (NODE_ENV === 'dev') {
    console.log('CORS: Development Mode');
    app.use(cors());
} else if (NODE_ENV === 'production') {
    console.log('CORS: Production Mode');
    app.use(cors({
        origin: 'https://convocations.esmorannes.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
} else {
    console.log('CORS: No specific environment set');
}

// Middleware pour la gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const startServer = () => {
    // Utiliser les routes centralisées après l'initialisation des modèles
    app.use('/api', routes);

    // Commencer à écouter les requêtes après l'initialisation
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    });
};

// Initialisation de la base de données et création des schémas
const initializeApp = async () => {
    try {
        const mongoUri = process.env.MONGO_URL;
        await connectToDatabase(mongoUri);
        console.log('La base de données et les collections sont prêtes.');
        startServer();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
    }
};

// Appel de la fonction initializeApp pour démarrer l'application
initializeApp();
