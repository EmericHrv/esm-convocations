import React, { useState } from 'react';

const TextModal = ({ title, initialData, onSave, onClose }) => {
    const [textInput, setTextInput] = useState(initialData || '');

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleSave = () => {
        if (textInput) {
            onSave(textInput);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                <input
                    type="text"
                    value={textInput}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
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

export default TextModal;
