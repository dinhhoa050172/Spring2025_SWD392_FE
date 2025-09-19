import { Link } from "react-router-dom";

import { Assets } from '../../assets/Assets.js'
import Navigation from "./Navigation.jsx";
import UserActions from "./UserActions.jsx";
import MobileMenu from "./MobileMenu.jsx";
const Header = () => {

    return (
        <header className="flex items-center justify-between p-3 bg-[rgb(33,103,221)] shadow-md ">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 cursor-pointer mlg:w-full">
                <Link to="/">
                    <img src={Assets.logoMedicince} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full cursor-pointertransition-all duration-300" />
                </Link>
                <h4 className="text-xl sm:text-2xl text-white font-semibold transition-all duration-300">Nhân Ái</h4>
            </div>

            {/* Navigation Links (Ẩn trên mobile) */}
            <div className="hidden md:flex">
                <Navigation />
            </div>


            {/* User Actions */}
            <div className="hidden md:flex">
                <UserActions />
            </div>

            {/* Mobile Menu (Hiển thị khi màn hình nhỏ) */}
            <MobileMenu />
        </header>
    );
};

export default Header;
