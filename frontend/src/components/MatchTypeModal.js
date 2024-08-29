import React, { useState } from 'react';

const MatchTypeModal = ({ title, initialData, initialPasDeMatch, onSave, onClose }) => {
    const [textInput, setTextInput] = useState(initialData || '');
    const [pasDeMatch, setPasDeMatch] = useState(initialPasDeMatch || false);

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleSwitchChange = (event) => {
        setPasDeMatch(event.target.checked);
    };

    const handleSave = () => {
        onSave({ text: textInput, pasDeMatch });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                <input
                    type="text"
                    value={textInput}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Type de match"
                />
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium text-gray-900">Pas de match</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={pasDeMatch}
                            onChange={handleSwitchChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-light sm:ml-3 sm:w-auto"
                    >
                        Enregistrer
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchTypeModal;
