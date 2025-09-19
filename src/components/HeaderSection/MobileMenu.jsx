import { useState } from "react";
import Navigation from "./Navigation.jsx";
import UserActions from "./UserActions.jsx";


const MobileMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="block md:hidden z-10">
            {/* Hamburger Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 right-4 bg-white shadow-2xl rounded-lg px-4 pb-2">
                    <Navigation />
                    <UserActions />
                </div>
            )}
        </div>
    );
};

export default MobileMenu;
