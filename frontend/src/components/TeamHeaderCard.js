import React from 'react';

const TeamHeaderCard = ({ title }) => {
    return (
        <div className="bg-primary text-text p-4 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-bold">{title}</h2>
        </div>
    );
};

export default TeamHeaderCard;
