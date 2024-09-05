'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeaderNav from '../components/HeaderNav';
import PublishedTeamColumn from '../components/PublishedTeamColumn';
import PublishedOtherConvocations from '../components/PublishedOtherConvocations';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.convocations.com/api';
console.log('API_BASE_URL:', API_BASE_URL);

const HomePage = () => {
    const [teamConvocations, setTeamConvocations] = useState([]);
    const [otherConvocations, setOtherConvocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        fetch(`${API_BASE_URL}/convocations/published`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des convocations publiées');
                }
                return response.json();
            })
            .then(data => {
                setTeamConvocations(data.teamConvocations);
                setOtherConvocations(data.otherConvocations);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <div className="min-h-full">
                {token ? (
                    <HeaderNav currentPage="Convocations Séniors" />
                ) : (
                    <Header currentPage="Convocations Séniors" />
                )}
                <main className="-mt-32">
                    <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                            {loading ? (
                                <p>Chargement des convocations...</p>
                            ) : (
                                <>
                                    {teamConvocations.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {teamConvocations.map((team) => (
                                                <PublishedTeamColumn
                                                    key={team._id}
                                                    teamPublished={team}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Pas de convocations disponibles.</p>
                                    )}
                                    <div className="mt-6">
                                        <PublishedOtherConvocations
                                            otherConvocations={otherConvocations}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;
