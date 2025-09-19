
import Navigation from "./Navigation.jsx";
import { useEffect, useState } from "react";

const HeaderSection = () => {
    const [showHeader, setShowHeader] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY; // Lấy vị trí cuộn
            const viewportHeight = window.innerHeight; // Lấy chiều cao màn hình (1vh = viewport height)

            // Khi cuộn xuống >= 120vh -> Hiện Header
            if (scrollPosition >= viewportHeight * 0.6) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`md:fixed top-0 left-0 w-full bg-[rgb(33,103,221)] shadow-lg transition-transform duration-500 z-50
            ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >

            {/* Navigation Links (Ẩn trên mobile) */}
            <div className="hidden sm:flex w-screen">
                <Navigation />
            </div>

        </header>
    );
};

export default HeaderSection;
