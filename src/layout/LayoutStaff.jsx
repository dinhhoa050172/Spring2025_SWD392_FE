import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "@components/SidebarStaff/index.jsx"
import { useEffect } from "react";

const LayoutStaff = () => {
    const location = useLocation();

    useEffect(() => {
        //functions here
    }, [location.pathname]);

    return (
        <div>

            <main className="flex">
                <div className="md:w-3/12 sm:w-1/12  min-h-screen sticky top-0">
                    <Sidebar />
                </div>
                <div className="w-screen container mx-6 mt-6 shadow-2xl bg-slate-100 rounded-md">
                    <Outlet />
                </div>

            </main>
        </div>
    )
}

export default LayoutStaff;