import React from 'react';

const ProfileHeader: React.FC = () => {
    return (
        <header className="px-5 pt-4 pb-2 flex justify-between items-center">
            <button
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-700 shadow-sm"
                onClick={() => window.history.back()}
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex gap-3">
                <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-700 shadow-sm">
                    <i className="fa-regular fa-share-from-square"></i>
                </button>
                <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-700 shadow-sm">
                    <i className="fa-regular fa-star"></i>
                </button>
            </div>
        </header>
    );
};

export default ProfileHeader;
