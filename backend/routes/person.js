const express = require('express');
const moment = require('moment');
const multer = require('multer');
const xlsx = require('xlsx');
const { getPersonModel, getLicenceModel } = require('../models/db');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let Person = null;
let Licence = null;

// Middleware pour s'assurer que les modèles Person et Licence sont initialisés
router.use((req, res, next) => {
    if (!Person || !Licence) {
        Person = getPersonModel();
        Licence = getLicenceModel();
    }
    next();
});

const parseString = (value) => {
    return value ? value : '';
};

const parseDate = (value) => {
    const date = moment(value, 'DD/MM/YYYY').toDate();
    return isNaN(date.getTime()) ? null : date;
};

// Endpoint pour télécharger et traiter le fichier XLSX
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé.');
    }

    const filePath = path.join(__dirname, '..', req.file.path); // Correction du chemin
    let workbook;
    try {
        workbook = xlsx.readFile(filePath);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier XLSX:', error);
        return res.status(400).send('Erreur lors de la lecture du fichier XLSX.');
    }

    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        console.error('Erreur: Aucun sheet trouvé dans le fichier XLSX.');
        return res.status(400).send('Erreur: Aucun sheet trouvé dans le fichier XLSX.');
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    try {
        for (const row of data) {

            // Chercher la personne par son Numéro personne
            let person = await Person.findOne({ numero_personne: row['Numéro personne'] });

            // Si la personne n'existe pas, la créer
            if (!person) {
                person = new Person({
                    numero_personne: parseString(row['Numéro personne']),
                    nom: parseString(row['Nom']),
                    prenom: parseString(row['Prénom']),
                    date_naissance: parseDate(row['Né(e) le']),
                    numero_tel: parseString(row['Mobile personnel'])
                });

                person = await person.save();
            } else {
                // Mettre à jour les informations de la personne existante
                person.nom = parseString(row['Nom']);
                person.prenom = parseString(row['Prénom']);
                person.date_naissance = parseDate(row['Né(e) le']);
                person.numero_tel = parseString(row['Mobile personnel']);
                await person.save();
            }

            // Chercher la licence par person_id et numero_licence
            let licence = await Licence.findOne({
                person_id: person._id,
                numero_licence: row['Numéro licence']
            });

            // Si la licence n'existe pas, la créer
            if (!licence) {
                licence = new Licence({
                    person_id: person._id,
                    numero_licence: parseString(row['Numéro licence']),
                    statut: parseString(row['Statut']),
                    sous_categorie: parseString(row['Sous catégorie'])
                });

                await licence.save();
            } else {
                // Mettre à jour les informations de la licence existante
                licence.statut = parseString(row['Statut']);
                licence.sous_categorie = parseString(row['Sous catégorie']);
                await licence.save();
            }
        }

        res.status(200).send('Les données ont été importées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'importation des données:', error);
        res.status(500).send('Erreur lors de l\'importation des données.');
    } finally {
        // Supprimer le fichier téléchargé après traitement
        fs.unlinkSync(filePath);
    }
});

// Nouvelle route pour récupérer toutes les personnes et leurs licences
router.get('/', async (req, res) => {
    try {
        const persons = await Person.aggregate([
            {
                $lookup: {
                    from: 'licences',
                    localField: '_id',
                    foreignField: 'person_id',
                    as: 'licences'
                }
            }
        ]);
        res.status(200).json(persons);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});

// Nouvelle route pour connaitre le nombre de personnes et de licences
router.get('/stats', async (req, res) => {
    try {
        const personsCount = await Person.countDocuments();
        const licencesCount = await Licence.countDocuments();

        res.status(200).json({
            personsCount,
            licencesCount
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).send('Erreur lors de la récupération des statistiques.');
    }
});

module.exports = router;
