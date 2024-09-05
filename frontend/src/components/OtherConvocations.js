import React, { useState } from 'react';
import Select from 'react-select';
import TeamHeaderCard from './TeamHeaderCard';
import customStyles from '../assets/customStyles';
import { UserIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

const OtherConvocations = ({ otherConvocations, onConvocationChange, persons }) => {
    const [absents, setAbsents] = useState(() => {
        return otherConvocations.absents
            ? otherConvocations.absents.map(absent =>
                persons.find(person => person._id === absent._id)
            )
            : [];
    });
    const [blesses, setBlesses] = useState(() => {
        return otherConvocations.blesses
            ? otherConvocations.blesses.map(blesse =>
                persons.find(person => person._id === blesse._id)
            )
            : [];
    });
    const [suspendus, setSuspendus] = useState(() => {
        return otherConvocations.suspendus
            ? otherConvocations.suspendus.map(suspendu =>
                persons.find(person => person._id === suspendu._id)
            )
            : [];
    });
    const [nonConvoques, setNonConvoques] = useState(() => {
        return otherConvocations.nonConvoques
            ? otherConvocations.nonConvoques.map(nonConvoque =>
                persons.find(person => person._id === nonConvoque._id)
            )
            : [];
    });
    const [arbitresJeunes, setArbitresJeunes] = useState(() => {
        return otherConvocations.arbitresJeunes
            ? otherConvocations.arbitresJeunes.map(arbitreJeune =>
                persons.find(person => person._id === arbitreJeune._id)
            )
            : [];
    });
    const [responsablesBuvette, setResponsablesBuvette] = useState(() => {
        return otherConvocations.responsablesBuvette
            ? otherConvocations.responsablesBuvette.map(responsable => ({
                name: responsable.name,
            }))
            : [];
    });

    const handleChange = (category, setCategory, categoryName, index, selectedOption) => {
        const updatedCategory = [...category];

        if (!selectedOption) {
            updatedCategory.splice(index, 1);
        } else {
            const selectedPerson = persons.find(person => person._id === selectedOption.value);
            updatedCategory[index] = selectedPerson;
        }

        setCategory(updatedCategory);

        const updatedOtherConvocations = {
            ...otherConvocations,
            [categoryName]: updatedCategory.map(person => ({
                _id: person._id,
                name: `${person.nom} ${person.prenom}`,
            })),
        };

        console.log(`Mise à jour des ${categoryName}:`, updatedOtherConvocations);
        onConvocationChange(updatedOtherConvocations);
    };

    const handleTextChange = (index, event) => {
        const updatedResponsables = [...responsablesBuvette];
        updatedResponsables[index] = { name: event.target.value };
        setResponsablesBuvette(updatedResponsables);

        const updatedOtherConvocations = {
            ...otherConvocations,
            responsablesBuvette: updatedResponsables,
        };

        console.log("Mise à jour des responsables buvette:", updatedOtherConvocations);
        onConvocationChange(updatedOtherConvocations);
    };

    const addPerson = (category, setCategory, categoryName) => {
        setCategory([...category, null]);
    };

    const addResponsable = () => {
        setResponsablesBuvette([...responsablesBuvette, { name: "" }]);
    };

    const removePerson = (category, setCategory, categoryName, index) => {
        const updatedCategory = [...category];
        updatedCategory.splice(index, 1);

        setCategory(updatedCategory);

        const updatedOtherConvocations = {
            ...otherConvocations,
            [categoryName]: updatedCategory.map(person => ({
                _id: person._id,
                name: `${person.nom} ${person.prenom}`,
            })),
        };

        console.log(`Mise à jour des ${categoryName}:`, updatedOtherConvocations);
        onConvocationChange(updatedOtherConvocations);
    };

    const removeResponsable = (index) => {
        const updatedResponsables = [...responsablesBuvette];
        updatedResponsables.splice(index, 1);
        setResponsablesBuvette(updatedResponsables);

        const updatedOtherConvocations = {
            ...otherConvocations,
            responsablesBuvette: updatedResponsables,
        };

        console.log("Mise à jour des responsables buvette:", updatedOtherConvocations);
        onConvocationChange(updatedOtherConvocations);
    };

    const renderCategory = (category, setCategory, categoryName, title) => (
        <div className="mt-0 border-t border-gray-100">
            <div className="px-4 py-2 flex items-center space-x-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                </span>
                <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    {category.map((person, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <Select
                                value={person ? { value: person._id, label: `${person.nom} ${person.prenom}` } : null}
                                onChange={(option) => handleChange(category, setCategory, categoryName, index, option)}
                                options={persons.map(person => ({ value: person._id, label: `${person.nom} ${person.prenom}` }))}
                                placeholder={`Choisissez un ${title.toLowerCase()}`}
                                isSearchable
                                isClearable
                                className="flex-1"
                                styles={customStyles}
                            />
                            <button
                                type="button"
                                onClick={() => removePerson(category, setCategory, categoryName, index)}
                                className="ml-2 text-red-500"
                            >
                                <MinusCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addPerson(category, setCategory, categoryName)}
                        className="mt-2 text-primary"
                    >
                        <PlusCircleIcon className="h-6 w-6 inline-block" /> Ajouter un {title.toLowerCase()}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderResponsablesBuvette = () => (
        <div className="mt-0 border-t border-gray-100">
            <div className="px-4 py-2 flex items-center space-x-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                </span>
                <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-900">Responsables Buvette</h4>
                    {responsablesBuvette.map((responsable, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <input
                                type="text"
                                value={responsable.name}
                                onChange={(event) => handleTextChange(index, event)}
                                placeholder="Entrez le nom du responsable"
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <button
                                type="button"
                                onClick={() => removeResponsable(index)}
                                className="ml-2 text-red-500"
                            >
                                <MinusCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addResponsable}
                        className="mt-2 text-primary"
                    >
                        <PlusCircleIcon className="h-6 w-6 inline-block" /> Ajouter un responsable buvette
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 mt-4">
            <TeamHeaderCard title="Informations Complémentaires" />
            {renderCategory(absents, setAbsents, 'absents', 'Absents')}
            {renderCategory(blesses, setBlesses, 'blesses', 'Blessés')}
            {renderCategory(suspendus, setSuspendus, 'suspendus', 'Suspendus')}
            {renderCategory(nonConvoques, setNonConvoques, 'nonConvoques', 'Non Convoqués')}
            {renderCategory(arbitresJeunes, setArbitresJeunes, 'arbitresJeunes', 'Arbitres Jeunes')}
            {renderResponsablesBuvette()}
        </div>
    );
};

export default OtherConvocations;
