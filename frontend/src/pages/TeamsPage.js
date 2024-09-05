'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/HeaderNav';
import TeamCard from '../components/TeamCard';
import TeamModal from '../components/TeamModal';
import { PlusIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.convocations.esmorannes.com/api';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non disponible');
            }

            const response = await fetch(`${API_BASE_URL}/convocations/teams`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des équipes');
            }

            const data = await response.json();
            setTeams(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const openAddTeamModal = () => {
        setCurrentTeam(null);
        setIsModalOpen(true);
    };

    const openEditTeamModal = (team) => {
        setCurrentTeam(team);
        setIsModalOpen(true);
    };

    const handleSaveTeam = async (teamName) => {
        const token = localStorage.getItem('token');
        const method = currentTeam ? 'PUT' : 'POST';
        const url = currentTeam
            ? `${API_BASE_URL}/convocations/teams/${currentTeam._id}`
            : `${API_BASE_URL}/convocations/teams`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: teamName }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde de l\'équipe');
            }

            setIsModalOpen(false);
            fetchTeams();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteTeam = async () => {
        if (!currentTeam) return;

        const token = localStorage.getItem('token');
        const url = `${API_BASE_URL}/convocations/teams/${currentTeam._id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'équipe');
            }

            setIsModalOpen(false);
            fetchTeams();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <div className="min-h-full">
                <Header currentPage="Gestion équipes" />
                <main className="-mt-32">
                    <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-base font-semibold leading-6 text-black">Liste des équipes</h1>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                    <button
                                        type="button"
                                        onClick={openAddTeamModal}
                                        className="block rounded-md bg-gray-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        <PlusIcon className="h-6 w-6 inline-block -mt-1 mr-2" aria-hidden="true" />
                                        Ajouter une équipe
                                    </button>
                                </div>
                            </div>
                            {loading ? (
                                <p>Chargement...</p>
                            ) : error ? (
                                <p className="text-red-500">Erreur: {error}</p>
                            ) : teams.length > 0 ? (
                                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                                    {teams.map((team, index) => (
                                        <TeamCard
                                            key={team._id}
                                            team={team}
                                            index={index}
                                            onEdit={openEditTeamModal}
                                            onDelete={handleDeleteTeam}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <p>Aucune équipe disponible</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <TeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTeam}
                onDelete={handleDeleteTeam}
                initialTeamName={currentTeam ? currentTeam.name : ''}
            />
        </>
    );
};

export default TeamsPage;
