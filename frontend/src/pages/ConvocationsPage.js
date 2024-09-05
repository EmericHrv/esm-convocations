'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/HeaderNav';
import TeamColumn from '../components/TeamColumn';
import Notification from '../components/Notification';
import OtherConvocations from '../components/OtherConvocations';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.convocations.com/api';

const ConvocationsPage = () => {
    const [teams, setTeams] = useState([]);
    const [convocationDraft, setConvocationDraft] = useState([]);
    const [persons, setPersons] = useState([]);
    const [otherConvocationsDraft, setOtherConvocationsDraft] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch teams
                const responseTeams = await fetch(`${API_BASE_URL}/convocations/teams`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!responseTeams.ok) {
                    throw new Error('Erreur lors de la récupération des équipes');
                }

                const dataTeams = await responseTeams.json();
                setTeams(dataTeams);

                // Fetch convocation draft
                const responseDraft = await fetch(`${API_BASE_URL}/convocations/draft`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!responseDraft.ok) {
                    throw new Error('Erreur lors de la récupération de la convocation draft');
                }

                const dataDraft = await responseDraft.json();
                setConvocationDraft(dataDraft.teams);
                setOtherConvocationsDraft(dataDraft.otherConvocations);

                // Fetch persons (licenciés)
                const responsePersons = await fetch(`${API_BASE_URL}/persons`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (responsePersons.ok) {
                    const dataPersons = await responsePersons.json();
                    dataPersons.sort((a, b) => {
                        if (a.nom < b.nom) return -1;
                        if (a.nom > b.nom) return 1;
                        if (a.prenom < b.prenom) return -1;
                        if (a.prenom > b.prenom) return 1;
                        return 0;
                    });
                    setPersons(dataPersons);
                } else {
                    throw new Error('Échec de la récupération des données des personnes');
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTeamConvocationChange = (teamId, updatedData) => {
        console.log('Mise à jour de la convocation d\'équipe:', teamId, updatedData);

        // Mettre à jour l'état local
        setConvocationDraft((prevState) => {
            const teamExists = prevState.some((team) => team.team === teamId);

            if (teamExists) {
                const updatedTeams = prevState.map((team) =>
                    team.team === teamId ? { ...team, ...updatedData } : team
                );
                return updatedTeams;
            } else {
                const newTeam = { team: teamId, ...updatedData };
                const updatedTeams = [...prevState, newTeam];
                return updatedTeams;
            }
        });

        // Envoyer les données mises à jour au serveur
        handleConvocationChange({
            teamConvocations: [{ team: teamId, ...updatedData }]
        });
    };

    const handleOtherConvocationsChange = (updatedData) => {
        console.log('Mise à jour des autres convocations:', updatedData);

        // Mettre à jour l'état local
        setOtherConvocationsDraft((prevState) => ({
            ...prevState,
            ...updatedData,
        }));

        // Envoyer les données mises à jour au serveur
        handleConvocationChange({
            otherConvocations: { ...updatedData }
        });
    };

    const handleConvocationChange = async (dataToSend) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/convocations/draft`, {
                method: 'POST',  // or 'PUT' if you are updating existing data
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des convocations');
            }

            const result = await response.json();
            console.log('Mise à jour envoyée au serveur avec succès:', result);
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error.message);
        }
    };

    const handlePublishConvocations = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/convocations/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la publication des convocations');
            }

            showNotification('success', 'Succès', 'Convocations publiées avec succès');
        } catch (error) {
            showNotification('error', 'Erreur', `Erreur: ${error.message}`);
        }
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
        setTimeout(() => setNotification({ show: false, type: '', title: '', message: '' }), 3000);
    };

    return (
        <>
            <div className="min-h-full">
                <Header currentPage="Édition Convocations Séniors" />
                <main className="-mt-32">
                    <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                            {loading ? (
                                <p>Chargement...</p>
                            ) : error ? (
                                <p className="text-red-500">Erreur: {error}</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {teams.map((team) => (
                                            <TeamColumn
                                                key={team._id}
                                                team={team}
                                                convocationDraft={convocationDraft}
                                                onConvocationChange={handleTeamConvocationChange}  // Updated
                                                persons={persons}
                                            />
                                        ))}
                                    </div>
                                    <OtherConvocations
                                        otherConvocations={otherConvocationsDraft}
                                        onConvocationChange={handleOtherConvocationsChange}  // Updated
                                        persons={persons}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            className="px-4 py-2 bg-primary text-black rounded"
                                            onClick={handlePublishConvocations}
                                        >
                                            Publier les convocations
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Notification
                show={notification.show}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ show: false, type: '', title: '', message: '' })}
            />
        </>
    );
};

export default ConvocationsPage;
