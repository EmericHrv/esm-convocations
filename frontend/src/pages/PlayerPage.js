'use client';

import React, { useEffect, useState } from 'react';
import PersonTable from '../components/PersonTable';
import Header from '../components/HeaderNav';
import ErrorMessage from '../components/ErrorMessage';
import Notification from '../components/Notification';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PlayerPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [personError, setPersonError] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch persons data
            const responsePersons = await fetch(`${API_BASE_URL}/persons`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (responsePersons.ok) {
                let dataPersons = await responsePersons.json();

                // Remove the person with numero_personne = 0
                dataPersons = dataPersons.filter(person => person.numero_personne !== 0);

                // Sort the remaining data
                dataPersons.sort((a, b) => {
                    if (a.nom < b.nom) return -1;
                    if (a.nom > b.nom) return 1;
                    if (a.prenom < b.prenom) return -1;
                    if (a.prenom > b.prenom) return 1;
                    return 0;
                });

                setData(dataPersons);
                setFilteredData(dataPersons);
                setPersonError('');
            } else {
                setPersonError('Échec de la récupération des données des personnes');
            }
        } catch (error) {
            setPersonError('Une erreur est survenue lors de la récupération des données des personnes');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filteredData = data.filter((person) =>
            `${person.nom} ${person.prenom}`.toLowerCase().includes(searchTerm)
        );
        setFilteredData(filteredData);
    };

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
        setTimeout(() => setNotification({ show: false, type: '', title: '', message: '' }), 3000);
    };

    return (
        <>
            <div className="min-h-full">
                <Header currentPage="Gestion Licenciés" />
                <main className="-mt-32">
                    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                            {personError ? (
                                <ErrorMessage title="Erreur des Données Personnelles" messages={[personError]} />
                            ) : (
                                <PersonTable
                                    filteredData={filteredData}
                                    fetchData={fetchData}
                                    handleSearch={handleSearch}
                                    searchTerm={searchTerm}
                                    showNotification={showNotification} // Passer la fonction de notification
                                />
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

export default PlayerPage;
