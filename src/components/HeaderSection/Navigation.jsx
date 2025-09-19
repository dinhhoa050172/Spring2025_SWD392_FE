import { useEffect, useState } from "react";
import { Link } from "react-scroll";

const sectionNames = [
    { id: "aboutUs", name: "Giới thiệu" },
    { id: "guide", name: "Hướng dẫn" },
    { id: "service", name: "Dịch vụ" },
    { id: "priceList", name: "Bảng giá" },
    { id: "blog", name: "Blog" },
];

const Navigation = () => {
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sectionNames.forEach(({ id }) => {
            const sectionElement = document.getElementById(id);
            if (sectionElement) observer.observe(sectionElement);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex justify-around items-center w-full">
            <ul className="list-none gap-6 md:gap-4 sm:flex">
                {sectionNames.map(({ id, name }) => (
                    <li key={id} className="text-lg text-left text-blue-500 md:text-white font-medium md:text-center cursor-pointer relative my-3">
                        <Link
                            to={id}
                            spy={true}
                            smooth={true}
                            duration={500}
                            offset={-70}
                            className={`text-black relative after:absolute after:left-0 text-base md:text-xl after:bottom-0 
                                    after:w-0 after:h-[2px] bg-white px-4 py-1 rounded-full 
                                    after:transition-all after:duration-300 hover:after:w-full 
                                    ${activeSection === id ? "bg-yellow-500 underline" : "text-gray-600"}`}
                        >
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="text-lg text-left text-blue-500 md:text-white font-medium md:text-center cursor-pointer relative my-2">
                <Link
                    to="registerVaccination"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="text-black relative after:absolute after:left-0 text-base md:text-xl after:bottom-0 
                            after:w-0 after:h-[2px] bg-white px-4 py-1 rounded-full 
                            after:transition-all after:duration-300 hover:after:w-full"
                >
                    Đăng ký tiêm
                </Link>
            </div>
        </div>
    );
};

export default Navigation;
