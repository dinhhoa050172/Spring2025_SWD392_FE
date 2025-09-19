import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation.jsx";
import UserActions from "./UserActions.jsx";

const MobileMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (e, path) => {
        e.preventDefault();
        setIsMenuOpen(false);  // Đóng menu
        navigate(path);  // Chuyển trang
    };

    return (
        <div className="block md:hidden z-10 relative">
            {/* Hamburger Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
                </svg>
            </button>

            {/* Dropdown Menu với animation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-16 right-4 bg-white shadow-2xl rounded-lg px-4 pb-2 w-48"
                    >
                        <Navigation onItemClick={handleNavigation} />
                        <UserActions onItemClick={handleNavigation} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileMenu;
