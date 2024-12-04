// src/components/Navbar.js
import React from 'react';

const NavBar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    NewsLogo
                </div>
                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;