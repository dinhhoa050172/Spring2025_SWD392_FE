import routes from "@src/router/index.js";
import { Link } from "react-router-dom";

const sectionNames = {
    home: { path: routes.home, label: "Trang chủ" },
    aboutUs: { path: routes.aboutUs, label: "Giới thiệu" },
    guide: { path: routes.vaccinationGuide, label: "Hướng dẫn" },
    priceList: { path: routes.vaccinePrice, label: "Bảng giá" },
    service: { path: routes.service, label: "Dịch vụ" },
    blog: { path: routes.blog, label: "Blog" },
    registerVaccination: { path: routes.registerVaccination, label: "Đăng ký tiêm" },
};

const Navigation = ({ onItemClick }) => {
    return (
        <ul className="list-none flex flex-col sm:flex-row  sm:gap-6">
            {Object.entries(sectionNames).map(([key, { path, label }]) => (
                <li key={key} className="relative my-2">
                    <Link
                        to={path}
                        onClick={onItemClick} // Đóng menu và chuyển trang
                        className="text-sm sm:text-base md:text-lg lg:text-xl font-medium hover:text-teal-500 text-white relative after:absolute after:left-0 after:bottom-0 
                        after:w-0 after:h-[2px] after:bg-teal-500 after:transition-all after:duration-300 
                        hover:after:w-full"
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Navigation;
