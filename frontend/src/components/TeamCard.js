import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const TeamCard = ({ team, index, onEdit, onDelete }) => {
    const bgColor = 'bg-primary';

    return (
        <li key={team._id} className="overflow-hidden rounded-lg bg-white shadow flex">
            <div
                className={classNames(
                    bgColor,
                    'flex w-20 flex-shrink-0 items-center justify-center text-3xl font-semibold text-white',
                )}
            >
                {index + 1}
            </div>
            <div className="flex flex-1 items-center justify-between px-4 py-5 sm:p-6">
                <dd className="text-2xl font-semibold tracking-tight text-gray-900">{team.name}</dd>
                <div className="relative flex-shrink-0">
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={() => onEdit(team)}
                    >
                        <span className="sr-only">Edit team</span>
                        <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </li>
    );
};

export default TeamCard;
