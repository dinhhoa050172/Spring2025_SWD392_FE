import { Assets } from '@src/assets/Assets.js';
import routes from '@src/router/index.js';
import { logout } from '@src/stores/slices/authSlice.js';
import { FaBlog, FaBox, FaCalendarAlt, FaSignOutAlt, FaUser, FaWarehouse } from 'react-icons/fa';
import { LuImport } from "react-icons/lu";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineBorderColor } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate(routes.auth.login);
    };
    // Danh sách chức năng với icon và đường dẫn
    const listFunctions = [
        { name: 'Xem lịch tiêm', icon: <FaCalendarAlt size={20} />, path: routes.staff.viewScheduleAll },
        { name: 'Blog', icon: <FaBlog size={20} />, path: routes.staff.blog },
        { name: 'Yêu cầu', icon: <MdOutlineBorderColor size={20} />, path: routes.staff.request },
        { name: 'Lịch hẹn quá hạn', icon: <TbCalendarCancel size={20} />, path: routes.staff.viewCanceledSchedule },
        { name: 'Kho lạnh', icon: <FaWarehouse size={20} />, path: routes.staff.coldStorage },
        { name: 'Nhập kho', icon: <LuImport size={20} />, path: routes.staff.RequestImportInvoice },
        { name: 'Lô vắc-xin', icon: <FaBox size={20} />, path: routes.staff.VaccinePatch },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b text-blue-400 shadow-lg flex flex-col sticky top-0">
            <div className='mt-3'>
                <div className="flex items-center justify-center gap-2 px-2 cursor-pointer mlg:w-full">
                    <Link to="/">
                        <img src={Assets.logoMedicince} alt="logo" className="w-10 h-10 sm:w-12 bg-blue-400 sm:h-12 rounded-full cursor-pointertransition-all duration-300" />
                    </Link>
                    <h4 className="text-base sm:text-base text-blue-400 font-semibold transition-all duration-300">Nhân Ái</h4>
                </div>

                <div className='p-3'>
                    <Link className='flex items-center justify-center gap-4'>
                        <FaUser size={25} />
                        <h2 className='text-2xl font-bold'>Staff</h2>
                    </Link>
                </div>
            </div>

            <ul className="flex-1 bg-white text-[rgb(33,103,221)]">
                {listFunctions.map((func, index) => (
                    <li key={index} className="group">
                        <Link to={func.path} className="flex items-center gap-3 p-4 hover:bg-blue-500 hover:text-white transition duration-300">
                            {func.icon}
                            <span className="text-lg">{func.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="flex items-center justify-center gap-3 w-full p-4 text-xl bg-white text-[rgb(33,103,221)] hover:bg-blue-500 hover:text-white transition duration-300 cursor-pointer" onClick={() => handleLogout()}>
                <FaSignOutAlt />
                <span>Đăng xuất</span>
            </button>
            <div className="p-4 text-center text-sm text-blue-400">© 2025 Nhân Ái</div>
        </div>
    );
};

export default Sidebar;
