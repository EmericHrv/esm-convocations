const express = require('express');
const {
    getTeamModel,
    getTeamConvocationDraftModel,
    getTeamConvocationPublishedModel,
    getOtherConvocationsDraftModel,
    getOtherConvocationsPublishedModel
} = require('../models/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Route pour ajouter une nouvelle équipe
router.post('/teams', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Le nom de l\'équipe est requis' });
        }

        const Team = getTeamModel();
        const newTeam = new Team({ name });

        await newTeam.save();

        res.status(201).json({ message: 'Équipe créée avec succès', team: newTeam });
    } catch (error) {
        if (error.code === 11000) { // Doublon de nom
            return res.status(400).json({ message: 'Une équipe avec ce nom existe déjà' });
        }
        res.status(500).json({ message: 'Erreur lors de la création de l\'équipe', error });
    }
});

// Route pour modifier une équipe
router.put('/teams/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const Team = getTeamModel();
        const updatedTeam = await Team.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedTeam) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }

        res.status(200).json({ message: 'Équipe modifiée avec succès', team: updatedTeam });
    } catch (error) {
        if (error.code === 11000) { // Doublon de nom
            return res.status(400).json({ message: 'Une équipe avec ce nom existe déjà' });
        }
        res.status(500).json({ message: 'Erreur lors de la modification de l\'équipe', error });
    }
});

// Route pour supprimer une équipe
router.delete('/teams/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const Team = getTeamModel();
        const deletedTeam = await Team.findByIdAndDelete(id);

        if (!deletedTeam) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }

        res.status(200).json({ message: 'Équipe supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipe', error });
    }
});

// Route pour récupérer la liste des équipes
router.get('/teams', authenticateToken, async (req, res) => {
    try {
        const Team = getTeamModel();
        const teams = await Team.find();

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error });
    }
});

// Route pour récupérer les convocations draft (authentification nécessaire)
router.get('/draft', authenticateToken, async (req, res) => {
    try {
        const TeamConvocationDraft = getTeamConvocationDraftModel();
        const OtherConvocationsDraft = getOtherConvocationsDraftModel();

        const draftTeamConvocations = await TeamConvocationDraft.find();
        const draftOtherConvocations = await OtherConvocationsDraft.findOne();

        res.status(200).json({
            teams: draftTeamConvocations,
            otherConvocations: draftOtherConvocations
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des convocations draft', error });
    }
});


// Route pour gérer le draft (création ou mise à jour)
router.post('/draft', authenticateToken, async (req, res) => {
    try {
        const {
            teamConvocations, // Liste des convocations d'équipe
            absents,
            blesses,
            suspendus,
            nonConvoques,
            responsablesBuvette
        } = req.body;

        // Gestion des convocations d'équipe
        const TeamConvocationDraft = getTeamConvocationDraftModel();
        for (const teamConvocation of teamConvocations) {
            const { team, pasDeMatch, heureRdv, heureMatch, dateMatch, typeMatch, lieuMatch, adversaire, entraineur, coachs, joueurs, arbitreCentre, arbitreTouche, delegueTerrain, lavageMaillots, lavageVestiaires, infos } = teamConvocation;

            await TeamConvocationDraft.findOneAndUpdate(
                { team }, // Rechercher la convocation par l'équipe
                {
                    pasDeMatch,
                    heureRdv,
                    heureMatch,
                    dateMatch,
                    typeMatch,
                    lieuMatch,
                    adversaire,
                    entraineur,
                    coachs,
                    joueurs,
                    arbitreCentre,
                    arbitreTouche,
                    delegueTerrain,
                    lavageMaillots,
                    lavageVestiaires,
                    infos
                },
                { upsert: true, new: true } // Met à jour ou crée si non existant
            );
        }

        // Gestion des autres convocations
        const OtherConvocationsDraft = getOtherConvocationsDraftModel();
        await OtherConvocationsDraft.findOneAndUpdate(
            {}, // Puisqu'il n'y a pas d'ID spécifique, on met à jour le seul document existant
            { absents, blesses, suspendus, nonConvoques, responsablesBuvette },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Draft mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du draft', error });
    }
});

// Route pour publier les convocations (copier de draft vers published)
router.post('/publish', authenticateToken, async (req, res) => {
    try {
        const TeamConvocationDraft = getTeamConvocationDraftModel();
        const TeamConvocationPublished = getTeamConvocationPublishedModel();
        const OtherConvocationsDraft = getOtherConvocationsDraftModel();
        const OtherConvocationsPublished = getOtherConvocationsPublishedModel();

        // Copier les convocations d'équipe de draft à published
        const draftTeamConvocations = await TeamConvocationDraft.find();
        await TeamConvocationPublished.deleteMany(); // Supprimer les anciennes convocations publiées
        for (const draft of draftTeamConvocations) {
            const published = new TeamConvocationPublished(draft.toObject());
            await published.save();
        }

        // Copier les autres convocations de draft à published
        const draftOtherConvocations = await OtherConvocationsDraft.findOne();
        if (draftOtherConvocations) {
            await OtherConvocationsPublished.deleteMany(); // Supprimer les anciennes convocations publiées
            const publishedOtherConvocations = new OtherConvocationsPublished(draftOtherConvocations.toObject());
            await publishedOtherConvocations.save();
        }

        res.status(201).json({ message: 'Convocations publiées avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la publication des convocations', error });
    }
});

// Route pour récupérer les convocations publiées (pas de token nécessaire)
router.get('/published', async (req, res) => {
    try {
        const TeamConvocationPublished = getTeamConvocationPublishedModel();
        const OtherConvocationsPublished = getOtherConvocationsPublishedModel();

        const publishedTeamConvocations = await TeamConvocationPublished.find();
        const publishedOtherConvocations = await OtherConvocationsPublished.findOne();

        res.status(200).json({
            teamConvocations: publishedTeamConvocations,
            otherConvocations: publishedOtherConvocations
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des convocations publiées', error });
    }
});

module.exports = router;
