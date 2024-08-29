import React from 'react';
import {
    CalendarIcon,
    TrophyIcon,
    MapPinIcon,
    ShieldCheckIcon,
    UserIcon,
    FlagIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Icon from '@mdi/react';
import { mdiShieldStarOutline, mdiWhistleOutline } from '@mdi/js';
import TeamHeaderCard from './TeamHeaderCard';
import InfoCard from './InfoCard';

const PublishedTeamColumn = ({ teamPublished }) => {
    const {
        pasDeMatch,
        dateMatch,
        heureMatch,
        heureRdv,
        typeMatch,
        lieuMatch,
        adversaire,
        entraineur,
        coachs,
        joueurs,
        arbitreCentre,
        arbitreTouche,
        delegueTerrain,
        infos,
    } = teamPublished;

    const formatDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return 'Pas encore définie';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Pas encore définie';
            }
            return `${date.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
            })} à ${timeString}`;
        } catch (error) {
            console.error('Error formatting date and time:', error);
            return 'Pas encore définie';
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <TeamHeaderCard title={teamPublished.team.name} />

            {infos && infos.trim() !== '' && <InfoCard infos={infos} />}

            <div className="mt-4">
                <h3 className="mb-2 font-semibold text-gray-900">Infos de la rencontre</h3>

                <div className="mt-0 border-t border-gray-100">
                    <div className="px-4 py-2 flex items-center space-x-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                            <CalendarIcon className="h-5 w-5 text-black" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-gray-900">Date & Heure de la rencontre</h4>
                            <span className="text-sm text-gray-700">{formatDateTime(dateMatch, heureMatch)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-0 border-t border-gray-100">
                    <div className="px-4 py-2 flex items-center space-x-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                            <TrophyIcon className="h-5 w-5 text-black" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-gray-900">Type de rencontre</h4>
                            <span className="text-sm text-gray-700">{pasDeMatch ? 'Pas de match' : typeMatch || 'Non défini'}</span>
                        </div>
                    </div>
                </div>

                {!pasDeMatch && (
                    <>
                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <MapPinIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-gray-900">Lieu de la rencontre</h4>
                                    <span className="text-sm text-gray-700">{lieuMatch || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <ClockIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-gray-900">Heure de RDV</h4>
                                    <span className="text-sm text-gray-700">{heureRdv || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <ShieldCheckIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-gray-900">Adversaire</h4>
                                    <span className="text-sm text-gray-700">{adversaire || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="my-2 font-semibold text-gray-900">Équipe Dirigeante</h3>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Entraîneur</h4>
                                    <div className="text-sm text-gray-700">
                                        <span>{entraineur.name}</span>
                                        {entraineur.phone && (
                                            <span className="text-sm text-gray-500"> - {entraineur.phone}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {coachs && coachs.length > 0 ? (
                            <div className="mt-0 border-t border-gray-100">
                                <div className="px-4 py-2 flex items-center space-x-4">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                        <UserIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                    </span>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="font-semibold text-gray-900">Coachs</h4>

                                        {coachs.map((coach, index) => (
                                            <div key={index} className="text-sm text-gray-700">
                                                <span>{coach.name}</span>
                                                {coach.phone && (
                                                    <span className="text-sm text-gray-500"> - {coach.phone}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <h3 className="my-2 font-semibold text-gray-900">Joueurs convoqués</h3>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 space-y-2">
                                {joueurs && joueurs.length > 0 ? (
                                    joueurs.map((joueur, index) => (
                                        <div key={index} className="flex items-center">
                                            <span className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-black font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="ml-4 text-sm md:text-base text-gray-700">{joueur.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-700">Non défini</span>
                                )}
                            </div>
                        </div>

                        <h3 className="my-2 font-semibold text-gray-900">Corps Arbitral</h3>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <Icon
                                        path={mdiWhistleOutline}
                                        className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Arbitre Central</h4>
                                    <span className="text-sm text-gray-700">{arbitreCentre?.name || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <FlagIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Arbitre de Touche</h4>
                                    <span className="text-sm text-gray-700">{arbitreTouche?.name || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-0 border-t border-gray-100">
                            <div className="px-4 py-2 flex items-center space-x-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                    <Icon
                                        path={mdiShieldStarOutline}
                                        className="h-5 w-5 text-black" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-semibold text-gray-900">Délégué</h4>
                                    <span className="text-sm text-gray-700">{delegueTerrain?.name || 'Non défini'}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PublishedTeamColumn;
