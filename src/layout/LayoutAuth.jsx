import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Styles/LayoutMain.css';
import { Assets } from '../assets/Assets.js'
import routes from '@src/router';
import { useEffect } from 'react';
const LayoutAuth = () => {
    const location = useLocation();
    
        useEffect(() => {
            //functions here
        }, [location.pathname]);

    return (
        <div className="layout-auth">
            {/* Background */}
            <div className="layout-auth-bg"></div>



            <div className='flex flex-col items-center'>
                {/* Logo */}
                <div className="logo-container w-32">
                    <Link to={routes.home}>
                        <img src={Assets.logoMedicineBlue} alt="App Logo" className="logo-app" />
                    </Link>
                </div>

                {/* Form Container */}
                <div className="max-h-4/5 md:h-4/5 md:w-4/5 sm:w-4/5 bg-white p-4 px-4 rounded-lg my-2 mx-2 z-10 relative shadow-2xl">
                    <div>
                        <div className="w-full">
                            {/* AnimatePresence để xử lý animation khi chuyển trang */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname} // Đảm bảo animation chạy khi đường dẫn thay đổi
                                    initial={{ x: 300, opacity: 0 }} // Vị trí và trạng thái ban đầu
                                    animate={{ x: 0, opacity: 1 }} // Animation khi hiển thị
                                    exit={{ x: -300, opacity: 0 }} // Animation khi rời đi
                                    transition={{ duration: 0.5 }} // Thời gian chuyển đổi
                                    className="h-full w-full"
                                >
                                    <Outlet /> {/* Hiển thị các trang con */}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LayoutAuth;
