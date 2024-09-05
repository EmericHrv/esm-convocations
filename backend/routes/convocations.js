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
            otherConvocations
        } = req.body;

        // Log des données reçues
        // console.log('Données reçues pour le draft:', {
        //     teamConvocations,
        //     otherConvocations
        // });

        // Gestion des convocations d'équipe
        if (teamConvocations) {
            const TeamConvocationDraft = getTeamConvocationDraftModel();
            for (const teamConvocation of teamConvocations) {
                const { team, pasDeMatch, heureRdv, heureMatch, dateMatch, typeMatch, lieuMatch, adversaire, entraineur, coachs, joueurs, arbitreCentre, arbitreTouche, delegueTerrain, lavageMaillots, lavageVestiaires, infos } = teamConvocation;

                // Log de chaque convocation d'équipe
                // console.log('Mise à jour de la convocation pour l\'équipe:', team);

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

                // Log après mise à jour de la convocation d'équipe
                // console.log('Convocation mise à jour pour l\'équipe:', team);
            }
        }

        // Gestion des autres convocations
        if (otherConvocations) {
            const OtherConvocationsDraft = getOtherConvocationsDraftModel();

            // Log avant mise à jour des autres convocations
            // console.log('Mise à jour des autres convocations');

            await OtherConvocationsDraft.findOneAndUpdate(
                {}, // Puisqu'il n'y a pas d'ID spécifique, on met à jour le seul document existant
                {
                    absents: otherConvocations.absents,
                    blesses: otherConvocations.blesses,
                    suspendus: otherConvocations.suspendus,
                    nonConvoques: otherConvocations.nonConvoques,
                    arbitresJeunes: otherConvocations.arbitresJeunes,
                    responsablesBuvette: otherConvocations.responsablesBuvette
                },
                { upsert: true, new: true }
            );

            // Log après mise à jour des autres convocations
            // console.log('Autres convocations mises à jour');
        }

        res.status(201).json({ message: 'Draft mise à jour avec succès' });
    } catch (error) {
        // Log de l'erreur
        console.error('Erreur lors de la mise à jour du draft:', error);
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
