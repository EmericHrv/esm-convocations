const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectToDatabase = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('Connecté à MongoDB');
        await initializeSchemas(); // Initialiser les schémas
        await createDefaultPerson(); // Créer la personne par défaut
        await createAdminUser(); // Créer l'utilisateur admin par défaut
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
    }
};

const initializeSchemas = async () => {
    console.log('Vérification et création des schémas et des modèles si nécessaire...');

    // Schéma pour les utilisateurs
    if (!mongoose.models.User) {
        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        });

        userSchema.pre('save', async function (next) {
            if (this.isModified('password') || this.isNew) {
                this.password = await bcrypt.hash(this.password, 10);
            }
            next();
        });

        userSchema.methods.comparePassword = function (password) {
            return bcrypt.compare(password, this.password);
        };

        mongoose.model('User', userSchema);
    }

    if (!mongoose.models.Person) {
        const personSchema = new mongoose.Schema({
            numero_personne: { type: String, required: true, unique: true },
            nom: { type: String, required: true },
            prenom: { type: String, required: true },
            date_naissance: { type: Date, required: true },
            numero_tel: { type: String, required: true },
        });

        mongoose.model('Person', personSchema);
    }

    if (!mongoose.models.Licence) {
        const licenceSchema = new mongoose.Schema({
            person_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
            numero_licence: { type: String, required: true, unique: true },
            statut: { type: String, required: true },
            sous_categorie: { type: String }
        });

        mongoose.model('Licence', licenceSchema);
    }

    // Schéma pour les équipes
    if (!mongoose.models.Team) {
        const teamSchema = new mongoose.Schema({
            name: { type: String, required: true, unique: true }, // Nom de l'équipe, unique
        });

        mongoose.model('Team', teamSchema);
    }

    // Schéma pour les convocations d'équipe (Draft et Published)
    const teamConvocationSchema = new mongoose.Schema({
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, // Référence à l'équipe
        pasDeMatch: { type: Boolean, default: false }, // Booléen indiquant si l'équipe n'a pas de match
        heureRdv: { type: String }, // Champ optionnel
        heureMatch: { type: String }, // Champ optionnel
        dateMatch: { type: Date }, // Champ optionnel
        typeMatch: { type: String }, // Champ optionnel
        lieuMatch: { type: String }, // Champ optionnel
        adversaire: { type: String }, // Champ optionnel
        entraineur: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }, // Champ optionnel
            phone: { type: String }, // Champ optionnel
        },
        coachs: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }, // Champ optionnel
            phone: { type: String } // Champ optionnel
        }],
        joueurs: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Champ optionnel
        arbitreCentre: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }, // Champ optionnel
        arbitreTouche: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }, // Champ optionnel
        delegueTerrain: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }, // Champ optionnel
        lavageMaillots: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }, // Champ optionnel
        lavageVestiaires: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Champ optionnel
        infos: { type: String }, // Champ optionnel
    });

    // Appliquer le middleware uniquement sur `TeamConvocationPublished`
    const teamConvocationPublishedSchema = new mongoose.Schema(teamConvocationSchema.obj);

    // Middleware pour toujours peupler les détails de l'équipe dans `TeamConvocationPublished`
    teamConvocationPublishedSchema.pre(/^find/, function (next) {
        this.populate('team', 'name');
        next();
    });

    if (!mongoose.models.TeamConvocationDraft) {
        mongoose.model('TeamConvocationDraft', teamConvocationSchema);
    }

    if (!mongoose.models.TeamConvocationPublished) {
        mongoose.model('TeamConvocationPublished', teamConvocationPublishedSchema);
    }

    // Schéma pour les autres convocations (Draft et Published)
    const otherConvocationsSchema = new mongoose.Schema({
        absents: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Liste d'absents
        blesses: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Liste de blessés
        suspendus: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Liste de suspendus
        nonConvoques: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Référence à la personne
            name: { type: String }
        }], // Liste de non-convoqués
        responsablesBuvette: [{ name: { type: String } }], // Liste des responsables buvette
    });

    if (!mongoose.models.OtherConvocationsDraft) {
        mongoose.model('OtherConvocationsDraft', otherConvocationsSchema);
    }

    if (!mongoose.models.OtherConvocationsPublished) {
        mongoose.model('OtherConvocationsPublished', otherConvocationsSchema);
    }

    console.log('Les schémas et les modèles ont été vérifiés/créés.');
};

const createDefaultPerson = async () => {
    const Person = mongoose.model('Person');
    const defaultPerson = {
        _id: new mongoose.Types.ObjectId('000000000000000000000000'),
        numero_personne: '0',
        nom: 'Arbitre',
        prenom: 'Officiel',
        date_naissance: '01/01/2000',
        numero_tel: '',
    };

    const existingPerson = await Person.findOne({ _id: defaultPerson._id });
    if (!existingPerson) {
        const person = new Person(defaultPerson);
        await person.save();
        console.log('Personne par défaut "Arbitre Officiel" créée avec succès.');
    } else {
        console.log('Personne par défaut "Arbitre Officiel" existe déjà.');
    }
};

const createAdminUser = async () => {
    const User = mongoose.model('User');
    const adminUsername = 'admin';
    const adminPassword = '49Esm640!';

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (!existingAdmin) {
        const adminUser = new User({
            username: adminUsername,
            password: adminPassword,
        });
        await adminUser.save();
        console.log('Utilisateur admin créé avec succès.');
    } else {
        console.log('Utilisateur admin existe déjà.');
    }
};

const getUserModel = () => mongoose.model('User');
const getTeamModel = () => mongoose.model('Team');
const getPersonModel = () => mongoose.model('Person');
const getLicenceModel = () => mongoose.model('Licence');
const getTeamConvocationDraftModel = () => mongoose.model('TeamConvocationDraft');
const getTeamConvocationPublishedModel = () => mongoose.model('TeamConvocationPublished');
const getOtherConvocationsDraftModel = () => mongoose.model('OtherConvocationsDraft');
const getOtherConvocationsPublishedModel = () => mongoose.model('OtherConvocationsPublished');

module.exports = {
    connectToDatabase,
    getUserModel,
    getTeamModel,
    getPersonModel,
    getLicenceModel,
    getTeamConvocationDraftModel,
    getTeamConvocationPublishedModel,
    getOtherConvocationsDraftModel,
    getOtherConvocationsPublishedModel,
};
