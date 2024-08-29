import React, { useState } from 'react';
import Select from 'react-select';
import TeamHeaderCard from './TeamHeaderCard';
import DateTimeModal from './DateTimeModal';
import MatchTypeModal from './MatchTypeModal';
import TextModal from './TextModal';
import customStyles from '../assets/customStyles';
import Icon from '@mdi/react';
import { mdiShieldStarOutline, mdiWhistleOutline } from '@mdi/js';
import { PencilIcon, CalendarIcon, TrophyIcon, MapPinIcon, ShieldCheckIcon, UserIcon, PlusCircleIcon, MinusCircleIcon, UserGroupIcon, FlagIcon, InformationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const TeamColumn = ({ team, convocationDraft, onConvocationChange, persons }) => {
    // State management remains the same
    const teamConvocation = convocationDraft?.find(t => t.team === team._id) || {};
    const [pasDeMatch, setPasDeMatch] = useState(teamConvocation.pasDeMatch || false);
    const [dateMatch, setDateMatch] = useState(teamConvocation.dateMatch || '');
    const [heureMatch, setHeureMatch] = useState(teamConvocation.heureMatch || '');
    const [heureRdv, setHeureRdv] = useState(teamConvocation.heureRdv || '');
    const [typeMatch, setTypeMatch] = useState(teamConvocation.typeMatch || '');
    const [lieuMatch, setLieuMatch] = useState(teamConvocation.lieuMatch || '');
    const [adversaire, setAdversaire] = useState(teamConvocation.adversaire || '');
    const [entraineur, setEntraineur] = useState(() => {
        return teamConvocation.entraineur
            ? persons.find(person => person._id === teamConvocation.entraineur._id)
            : null;
    });
    const [coachs, setCoachs] = useState(() => {
        return teamConvocation.coachs
            ? teamConvocation.coachs.map(coach =>
                persons.find(person => person._id === coach._id)
            )
            : [];
    });
    const [joueurs, setJoueurs] = useState(() => {
        return teamConvocation.joueurs
            ? teamConvocation.joueurs.map(joueur =>
                persons.find(person => person._id === joueur._id)
            )
            : [];
    });
    const [arbitreCentre, setArbitreCentre] = useState(() => {
        return teamConvocation.arbitreCentre
            ? persons.find(person => person._id === teamConvocation.arbitreCentre._id)
            : null;
    });
    const [arbitreTouche, setArbitreTouche] = useState(() => {
        return teamConvocation.arbitreTouche
            ? persons.find(person => person._id === teamConvocation.arbitreTouche._id)
            : null;
    });
    const [delegueTerrain, setDelegueTerrain] = useState(() => {
        return teamConvocation.delegueTerrain
            ? persons.find(person => person._id === teamConvocation.delegueTerrain._id)
            : null;
    });
    const [infos, setInfos] = useState(teamConvocation.infos || '');
    const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
    const [isMatchTypeModalOpen, setIsMatchTypeModalOpen] = useState(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState('');
    const [modalInitialTime, setModalInitialTime] = useState('');
    const [modalInitialData, setModalInitialData] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [textModalField, setTextModalField] = useState('');

    const openDateTimeModal = () => {
        setModalInitialDate(dateMatch || '');
        setModalInitialTime(heureMatch || '');
        setModalTitle("Date & Heure de la rencontre");
        setIsDateTimeModalOpen(true);
    };

    const closeDateTimeModal = () => setIsDateTimeModalOpen(false);

    const openMatchTypeModal = () => {
        setModalTitle('Type de rencontre');
        setIsMatchTypeModalOpen(true);
    };

    const closeMatchTypeModal = () => setIsMatchTypeModalOpen(false);

    const openTextModal = (initialData, title, field) => {
        setModalInitialData(initialData);
        setModalTitle(title);
        setTextModalField(field);
        setIsTextModalOpen(true);
    };

    const closeTextModal = () => setIsTextModalOpen(false);

    const handleSaveDateTime = (newDateTime) => {
        const formattedDate = newDateTime.toISOString().split('T')[0];
        const formattedTime = newDateTime.toTimeString().slice(0, 5);
        setDateMatch(formattedDate);
        setHeureMatch(formattedTime);
        onConvocationChange(team._id, { dateMatch: formattedDate, heureMatch: formattedTime });
        closeDateTimeModal();
    };

    const handleSaveMatchType = ({ text, pasDeMatch }) => {
        setTypeMatch(text);
        setPasDeMatch(pasDeMatch);
        onConvocationChange(team._id, { typeMatch: text, pasDeMatch });
        closeMatchTypeModal();
    };

    const handleSaveText = (newText) => {
        if (textModalField === 'lieuMatch') {
            setLieuMatch(newText);
            onConvocationChange(team._id, { lieuMatch: newText });
        } else if (textModalField === 'adversaire') {
            setAdversaire(newText);
            onConvocationChange(team._id, { adversaire: newText });
        } else if (textModalField === 'heureRdv') {
            setHeureRdv(newText);
            onConvocationChange(team._id, { heureRdv: newText });
        } else if (textModalField === 'infos') {
            setInfos(newText);
            onConvocationChange(team._id, { infos: newText });
        }
        closeTextModal();
    };

    const handleEntraineurChange = (selectedOption) => {
        if (!selectedOption) {
            setEntraineur(null);
            onConvocationChange(team._id, { entraineur: null });
            return;
        }
        const selectedPerson = persons.find(person => person._id === selectedOption.value);

        if (selectedPerson) {
            setEntraineur(selectedPerson);
            onConvocationChange(team._id, {
                entraineur: {
                    _id: selectedPerson._id,
                    name: `${selectedPerson.nom} ${selectedPerson.prenom}`,
                    phone: `0${selectedPerson.numero_tel}`
                },
            });
        }
    };

    const handleCoachChange = (index, selectedOption) => {
        const updatedCoaches = [...coachs];
        if (!selectedOption) {
            updatedCoaches.splice(index, 1);
        } else {
            const selectedPerson = persons.find(person => person._id === selectedOption.value);
            updatedCoaches[index] = selectedPerson;
        }
        setCoachs(updatedCoaches);
        onConvocationChange(team._id, {
            coachs: updatedCoaches.map(coach => ({
                _id: coach._id,
                name: `${coach.nom} ${coach.prenom}`,
                phone: `0${coach.numero_tel}`
            })),
        });
    };

    const addCoach = () => {
        setCoachs([...coachs, null]);
    };

    const removeCoach = (index) => {
        const updatedCoaches = [...coachs];
        updatedCoaches.splice(index, 1);
        setCoachs(updatedCoaches);
        onConvocationChange(team._id, {
            coachs: updatedCoaches.map(coach => ({
                _id: coach._id,
                name: `${coach.nom} ${coach.prenom}`,
                phone: `0${coach.numero_tel}`
            })),
        });
    };

    const handleJoueurChange = (index, selectedOption) => {
        const updatedJoueurs = [...joueurs];
        if (!selectedOption) {
            updatedJoueurs.splice(index, 1);
        } else {
            const selectedPerson = persons.find(person => person._id === selectedOption.value);
            updatedJoueurs[index] = selectedPerson;
        }
        setJoueurs(updatedJoueurs);
        onConvocationChange(team._id, {
            joueurs: updatedJoueurs.map(joueur => ({
                _id: joueur._id,
                name: `${joueur.nom} ${joueur.prenom}`
            })),
        });
    };

    const addJoueur = () => {
        setJoueurs([...joueurs, null]);
    };

    const removeJoueur = (index) => {
        const updatedJoueurs = [...joueurs];
        updatedJoueurs.splice(index, 1);
        setJoueurs(updatedJoueurs);
        onConvocationChange(team._id, {
            joueurs: updatedJoueurs.map(joueur => ({
                _id: joueur._id,
                name: `${joueur.nom} ${joueur.prenom}`
            })),
        });
    };

    const handleArbitreCentreChange = (selectedOption) => {
        if (!selectedOption) {
            setArbitreCentre(null);
            onConvocationChange(team._id, { arbitreCentre: null });
            return;
        }
        const selectedPerson = persons.find(person => person._id === selectedOption.value);

        if (selectedPerson) {
            setArbitreCentre(selectedPerson);
            onConvocationChange(team._id, {
                arbitreCentre: {
                    _id: selectedPerson._id,
                    name: `${selectedPerson.nom} ${selectedPerson.prenom}`
                },
            });
        }
    };

    const handleArbitreToucheChange = (selectedOption) => {
        if (!selectedOption) {
            setArbitreTouche(null);
            onConvocationChange(team._id, { arbitreTouche: null });
            return;
        }
        const selectedPerson = persons.find(person => person._id === selectedOption.value);

        if (selectedPerson) {
            setArbitreTouche(selectedPerson);
            onConvocationChange(team._id, {
                arbitreTouche: {
                    _id: selectedPerson._id,
                    name: `${selectedPerson.nom} ${selectedPerson.prenom}`
                },
            });
        }
    };

    const handleDelegueTerrainChange = (selectedOption) => {
        if (!selectedOption) {
            setDelegueTerrain(null);
            onConvocationChange(team._id, { delegueTerrain: null });
            return;
        }
        const selectedPerson = persons.find(person => person._id === selectedOption.value);

        if (selectedPerson) {
            setDelegueTerrain(selectedPerson);
            onConvocationChange(team._id, {
                delegueTerrain: {
                    _id: selectedPerson._id,
                    name: `${selectedPerson.nom} ${selectedPerson.prenom}`
                },
            });
        }
    };

    const formatDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return 'Pas encore définie';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Pas encore définie';
            }
            return `${date.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
            })} à ${timeString}`;
        } catch (error) {
            console.error('Error formatting date and time:', error);
            return 'Pas encore définie';
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <TeamHeaderCard title={team.name} />

            <div className="mt-4">
                <h3 className="mb-2 font-semibold text-gray-900">Infos de la rencontre</h3>

                <div className="mt-0 border-t border-gray-100">
                    <div
                        className="px-4 py-2 flex items-center justify-between cursor-pointer"
                        onClick={openDateTimeModal}
                    >
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <CalendarIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-gray-900">Date & Heure de la rencontre</h4>
                                <span className="text-sm text-gray-700">{formatDateTime(dateMatch, heureMatch)}</span>
                            </div>
                        </div>
                        <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                </div>

                <div className="mt-0 border-t border-gray-100">
                    <div
                        className="px-4 py-2 flex items-center justify-between cursor-pointer"
                        onClick={openMatchTypeModal}
                    >
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <TrophyIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-gray-900">Type de rencontre</h4>
                                <span className="text-sm text-gray-700">{pasDeMatch ? 'Pas de match' : typeMatch || 'Non défini'}</span>
                            </div>
                        </div>
                        <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                </div>

                {!pasDeMatch && (
                    <>
                        {/* Lieu de la rencontre */}
                        <div className="mt-0 border-t border-gray-100">
                            <div
                                className="px-4 py-2 flex items-center justify-between cursor-pointer"
                                onClick={() => openTextModal(lieuMatch, 'Lieu de la rencontre', 'lieuMatch')}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                        <MapPinIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h4 className="font-semibold text-gray-900">Lieu de la rencontre</h4>
                                        <span className="text-sm text-gray-700">{lieuMatch || 'Non défini'}</span>
                                    </div>
                                </div>
                                <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Heure de rendez-vous */}
                        <div className="mt-0 border-t border-gray-100">
                            <div
                                className="px-4 py-2 flex items-center justify-between cursor-pointer"
                                onClick={() => openTextModal(heureRdv, 'Heure de RDV', 'heureRdv')}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                        <ClockIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h4 className="font-semibold text-gray-900">Heure de RDV</h4>
                                        <span className="text-sm text-gray-700">{heureRdv || 'Non défini'}</span>
                                    </div>
                                </div>
                                <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div
                                className="px-4 py-2 flex items-center justify-between cursor-pointer"
                                onClick={() => openTextModal(adversaire, 'Adversaire', 'adversaire')}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                        <ShieldCheckIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h4 className="font-semibold text-gray-900">Adversaire</h4>
                                        <span className="text-sm text-gray-700">{adversaire || 'Non défini'}</span>
                                    </div>
                                </div>
                                <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Entraîneur</h4>
                                    <Select
                                        value={entraineur ? { value: entraineur._id, label: `${entraineur.nom} ${entraineur.prenom}` } : null}
                                        onChange={handleEntraineurChange}
                                        options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                        placeholder="Choisissez un entraîneur"
                                        isSearchable
                                        isClearable
                                        className="mt-0"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coaches Management */}
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Coachs</h4>
                                    {coachs.map((coach, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <Select
                                                value={coach ? { value: coach._id, label: `${coach.nom} ${coach.prenom}` } : null}
                                                onChange={(option) => handleCoachChange(index, option)}
                                                options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                                placeholder="Choisissez un coach"
                                                isSearchable
                                                isClearable
                                                className="flex-1"
                                                styles={customStyles}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCoach(index)}
                                                className="ml-2 text-red-500"
                                            >
                                                <MinusCircleIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCoach}
                                        className="mt-2 text-primary"
                                    >
                                        <PlusCircleIcon className="h-6 w-6 inline-block" /> Ajouter un coach
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Players Management */}
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 pt-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                                    <UserGroupIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <h4 className="font-semibold text-gray-900">Joueurs</h4>
                            </div>

                            <div className="px-4 py-2 flex flex-col space-y-2">
                                {joueurs.map((joueur, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                                            {index + 1}
                                        </span>
                                        <Select
                                            value={joueur ? { value: joueur._id, label: `${joueur.nom} ${joueur.prenom}` } : null}
                                            onChange={(option) => handleJoueurChange(index, option)}
                                            options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                            placeholder="Choisissez un joueur"
                                            isSearchable
                                            isClearable
                                            className="flex-1 ml-2"
                                            styles={customStyles}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeJoueur(index)}
                                            className="ml-2 text-red-500"
                                        >
                                            <MinusCircleIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addJoueur}
                                    className="mt-2 text-primary"
                                >
                                    <PlusCircleIcon className="h-6 w-6 inline-block" /> Ajouter un joueur
                                </button>
                            </div>
                        </div>
                        {/* Arbitre Central */}
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <Icon
                                        path={mdiWhistleOutline}
                                        className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Arbitre Central</h4>
                                    <Select
                                        value={arbitreCentre ? { value: arbitreCentre._id, label: `${arbitreCentre.nom} ${arbitreCentre.prenom}` } : null}
                                        onChange={handleArbitreCentreChange}
                                        options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                        placeholder="Choisissez un arbitre"
                                        isSearchable
                                        isClearable
                                        className="mt-0"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Arbitre Touche */}
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <FlagIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Arbitre de Touche</h4>
                                    <Select
                                        value={arbitreTouche ? { value: arbitreTouche._id, label: `${arbitreTouche.nom} ${arbitreTouche.prenom}` } : null}
                                        onChange={handleArbitreToucheChange}
                                        options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                        placeholder="Choisissez un arbitre"
                                        isSearchable
                                        isClearable
                                        className="mt-0"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Délégué de Terrain */}
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <Icon
                                        path={mdiShieldStarOutline}
                                        className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Délégué</h4>
                                    <Select
                                        value={delegueTerrain ? { value: delegueTerrain._id, label: `${delegueTerrain.nom} ${delegueTerrain.prenom}` } : null}
                                        onChange={handleDelegueTerrainChange}
                                        options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                        placeholder="Choisissez un délégué"
                                        isSearchable
                                        isClearable
                                        className="mt-0"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Infos Diverses */}
                <div className="mt-0 border-t border-gray-100">
                    <div
                        className="px-4 py-2 flex items-start justify-between cursor-pointer"
                        onClick={() => openTextModal(infos, 'Infos Diverses', 'infos')}
                    >
                        <div className="flex items-start space-x-4 flex-1">
                            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                <InformationCircleIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col flex-1">
                                <h4 className="font-semibold text-gray-900">Infos Diverses</h4>
                                <span className="text-sm text-gray-700 break-words">{infos || 'Non défini'}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <PencilIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>

            {isDateTimeModalOpen && (
                <DateTimeModal
                    title={modalTitle}
                    initialDate={modalInitialDate}
                    initialTime={modalInitialTime}
                    onSave={handleSaveDateTime}
                    onClose={closeDateTimeModal}
                />
            )}

            {isMatchTypeModalOpen && (
                <MatchTypeModal
                    title={modalTitle}
                    initialData={typeMatch}
                    initialPasDeMatch={pasDeMatch}
                    onSave={handleSaveMatchType}
                    onClose={closeMatchTypeModal}
                />
            )}

            {isTextModalOpen && (
                <TextModal
                    title={modalTitle}
                    initialData={modalInitialData}
                    onSave={handleSaveText}
                    onClose={closeTextModal}
                />
            )}
        </div>
    );
};

export default TeamColumn;
