import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import routes from "@src/router/index.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@src/stores/slices/authSlice.js";

const UserActions = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const role = localStorage.getItem("userRole") || '{}';

    const username = localStorage.getItem("userName") || '{}';

    const roleRoutes = {
        ADMIN: routes.admin.dashboard,
        MANAGER: routes.admin.dashboard,
        STAFF: routes.staff.blog,
        CUSTOMER: routes.user.profile,
        GUEST: routes.auth.login
    };

    const profileRoute = roleRoutes[role] || routes.auth.login;

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate(routes.auth.login);
    };

    return (
        <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center justify-center">
            {isAuthenticated ? (
                <div className="flex gap-4 items-center">
                    <Link to={profileRoute} className="text-lg text-[rgb(33,103,221)] font-medium">
                        <div className="flex gap-3 items-center cursor-pointer bg-white py-2 md:px-4 rounded-full">
                            <FaUser className="text-[rgb(33,103,221)]" />
                            {username}
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex gap-2 items-center bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 items-center">
                    <div className="flex gap-3 items-center cursor-pointer bg-white py-2 md:px-4 rounded-full">
                        <FaUser className="text-[rgb(33,103,221)]" />
                        <Link to={routes.auth.login} className="text-lg text-[rgb(33,103,221)] font-medium">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserActions;
