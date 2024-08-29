import React, { useState, useEffect } from 'react';

const DateTimeModal = ({ title, initialDate, initialTime, onSave, onClose }) => {
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, hence +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState(formatDateForInput(initialDate));
    const [selectedTime, setSelectedTime] = useState(initialTime || '');

    useEffect(() => {
        setSelectedDate(formatDateForInput(initialDate));
        setSelectedTime(initialTime || '');
    }, [initialDate, initialTime]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleSave = () => {
        if (selectedDate && selectedTime) {
            const combinedDateTime = new Date(`${selectedDate}T${selectedTime}`);
            onSave(combinedDateTime);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Heure</label>
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selectedDate || !selectedTime}
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${!selectedDate || !selectedTime ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light'}`}
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

export default DateTimeModal;
