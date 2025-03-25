import React from 'react';

const FloatingButton = ({ icon, onClick, isActive, className }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 ${className}`}
        >
            {icon}
        </button>
    );
};

export default FloatingButton;