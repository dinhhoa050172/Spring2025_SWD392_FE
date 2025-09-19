import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaRegCalendarAlt } from "react-icons/fa";
import routes from "@src/router/index.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@src/stores/slices/authSlice";
import { userService } from "@src/services/userService.js";
import { useEffect, useState } from "react";

const UserActions = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await userService.getUser();
            setUserData(response);
        }
        fetchUser();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate(routes.auth.login);
    }

    return (
        <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center justify-center">
            {isAuthenticated ? (
                <div className="flex gap-4 items-center">
                    <div className="flex gap-3 items-center cursor-pointer bg-white py-2 md:px-4 rounded-full">
                        <FaUser className="text-[rgb(33,103,221)]" />
                        <Link to={routes.user.profile} className="text-lg text-[rgb(33,103,221)] font-medium">
                            {userData?.fullname}
                        </Link>
                    </div>
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
