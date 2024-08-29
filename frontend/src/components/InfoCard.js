import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

const InfoCard = ({ infos }) => {
    return (
        <div className="border-l-4 border-blue-400 bg-blue-50 p-4 mt-4">
            <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                    <InformationCircleIcon aria-hidden="true" className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700">
                        {infos}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
