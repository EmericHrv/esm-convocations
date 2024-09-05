import React, { useState } from 'react';
import FileUploadModal from './FileUploadModal';
import { FolderPlusIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.convocations.esmorannes.com/api';

const PersonTable = ({ filteredData, fetchData, handleSearch, searchTerm, showNotification }) => {
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [file, setFile] = useState(null);

    const openFileModal = () => {
        setIsFileModalOpen(true);
    };

    const closeFileModal = () => {
        setIsFileModalOpen(false);
        setFile(null);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Veuillez sélectionner un fichier à importer');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/persons/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                showNotification('success', 'Succès', 'Fichier importé avec succès');
                setFile(null);
                setIsFileModalOpen(false);
                fetchData();
            } else {
                showNotification('error', 'Erreur', 'Échec de l\'importation du fichier');
            }
        } catch (error) {
            showNotification('error', 'Erreur', 'Une erreur s\'est produite lors de l\'importation du fichier');
        }
    };

    const formatPhoneNumber = (numero_tel) => {
        // Ajouter le préfixe 0 si le numéro ne commence pas par 0 et n'est pas vide
        if (numero_tel !== undefined) {
            if (!numero_tel.startsWith('0')) {
                return '0' + numero_tel;
            }
        }
        return numero_tel;
    };

    const getStatusBadgeClass = (status) => {
        return status === 'Active'
            ? 'inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
            : 'inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-black">Gestionnaire des licences</h1>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={openFileModal}
                        className="block rounded-md bg-gray-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <FolderPlusIcon className="h-6 w-6 inline-block -mt-1 mr-2" aria-hidden="true" />
                        Importer un fichier
                    </button>
                </div>
            </div>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-6">
                                            Licencié
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black">
                                            Licences
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black">
                                            Date de Naissance
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black">
                                            Numéro de téléphone
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredData.map(person => (
                                        <tr key={person._id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6">
                                                {`${person.nom} ${person.prenom}`}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {person.licences.length > 0 ? (
                                                    person.licences.map(licence => (
                                                        <div key={licence._id} className="mb-2 p-2 border border-gray-200 rounded-md">
                                                            <div>
                                                                <span className="font-semibold">Catégorie : </span>
                                                                <span className="text-black font-medium">
                                                                    {licence.sous_categorie}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold">Numéro : </span>
                                                                <span className="text-black font-medium">
                                                                    {licence.numero_licence}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold">Statut : </span>
                                                                <span className={getStatusBadgeClass(licence.statut)}>
                                                                    {licence.statut}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                                        Aucune licence
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-black">
                                                {formatDate(person.date_naissance)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-black">
                                                {formatPhoneNumber(person.numero_tel)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isFileModalOpen && (
                <FileUploadModal
                    isModalOpen={isFileModalOpen}
                    closeModal={closeFileModal}
                    handleFileChange={handleFileChange}
                    handleFileUpload={handleFileUpload}
                    showNotification={showNotification}
                />
            )}
        </div>
    );
};

export default PersonTable;
