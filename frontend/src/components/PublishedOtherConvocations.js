import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import TeamHeaderCard from './TeamHeaderCard';

const PublishedOtherConvocations = ({ otherConvocations }) => {
    const renderCategory = (category, title) => (
        <div className="mt-0 border-t border-gray-100">
            <div className="px-4 py-2 flex items-center space-x-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                </span>
                <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    {category && category.length > 0 ? (
                        category.map((person, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <p className="flex-1">{person.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Aucun {title.toLowerCase()}.</p>
                    )}
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
                    {otherConvocations.responsablesBuvette && otherConvocations.responsablesBuvette.length > 0 ? (
                        otherConvocations.responsablesBuvette.map((responsable, index) => (
                            <div key={index} className="flex items-center mt-2">
                                <p className="flex-1">{responsable.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Aucun responsable buvette.</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1 mt-4">
            <TeamHeaderCard title="Informations Complémentaires" />
            {otherConvocations.absents && otherConvocations.absents.length > 0 && renderCategory(otherConvocations.absents, 'Absents')}
            {otherConvocations.blesses && otherConvocations.blesses.length > 0 && renderCategory(otherConvocations.blesses, 'Blessés')}
            {otherConvocations.suspendus && otherConvocations.suspendus.length > 0 && renderCategory(otherConvocations.suspendus, 'Suspendus')}
            {otherConvocations.nonConvoques && otherConvocations.nonConvoques.length > 0 && renderCategory(otherConvocations.nonConvoques, 'Non Convoqués')}
            {otherConvocations.arbitresJeunes && otherConvocations.arbitresJeunes.length > 0 && renderCategory(otherConvocations.arbitresJeunes, 'Arbitres Jeunes')}
            {renderResponsablesBuvette()}
        </div>
    );
};

export default PublishedOtherConvocations;
