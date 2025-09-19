import { Assets } from "@src/assets/Assets.js";
import routes from "@src/router/index.js";
import { logout } from "@src/stores/slices/authSlice.js";

import {
  FaCalendar,
  FaClipboardList,
  FaSignOutAlt,
  FaStar,
  FaSyringe,
  FaUser,
} from "react-icons/fa";
import { MdFreeCancellation } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Danh sách chức năng với icon và đường dẫn
  const listFunctions = [
    {
      name: "Hồ sơ",
      icon: <SiGoogleanalytics size={20} />,
      path: routes.user.profile,
    },
    { name: "Lịch tiêm chủng", icon: <FaCalendar size={20} />, path: routes.user.selfSchedule },

    { name: "Lịch sử tiêm chủng", icon: <FaSyringe size={20} />, path: routes.user.record },
    { name: "Yêu cầu đổi lịch", icon: <MdFreeCancellation size={20} />, path: routes.user.cancelSchedule },
    {
      name: "Giao dịch",
      icon: <FaClipboardList size={20} />,
      path: routes.user.transaction,
    },
    { name: "Đánh giá", icon: <FaStar size={20} />, path: routes.user.feedback },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate(routes.auth.login);
  };

  const username = localStorage.getItem("userName")

  return (
    <div className="min-h-screen sticky top-0 bg-gradient-to-b text-blue-400 shadow-lg flex flex-col">
      <div className="mt-3">
        <div className="flex items-center justify-center gap-2 px-2 cursor-pointer mlg:w-full">
          <Link to="/">
            <img
              src={Assets.logoMedicince}
              alt="logo"
              className="w-10 h-10 sm:w-12 bg-blue-400 sm:h-12 rounded-full cursor-pointertransition-all duration-300"
            />
          </Link>
          <h4 className="text-base sm:text-base text-blue-400 font-semibold transition-all duration-300">
            Nhân Ái
          </h4>
        </div>

        <div className="p-3">
          <Link className="flex items-center justify-center gap-4">
            <FaUser size={25} />
            <h2 className="text-2xl font-bold">{username}</h2>
          </Link>
        </div>
      </div>

      <ul className="flex-1 bg-white text-[rgb(33,103,221)]">
        {listFunctions.map((func, index) => (
          <li key={index} className="group">
            <Link
              to={func.path}
              className="flex items-center gap-3 p-4 hover:bg-blue-500 hover:text-white transition duration-300"
            >
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
      <div className="p-4 text-center text-sm text-blue-400">
        © 2025 Nhân Ái
      </div>
    </div>
  );
};

export default Sidebar;
