import { Outlet } from "react-router-dom"
import SidebarCus from "@components/SidebarCus/index.jsx";

const LayoutCus = () => {
    return (
        <div>

            <main className="flex">
                <div className="md:w-3/12 sm:w-1/12  min-h-screen sticky top-0">
                    <SidebarCus />
                </div>
                <div className="w-screen container m-6 shadow-xl bg-slate-100 rounded-md">
                    <Outlet />
                </div>

            </main>
        </div>
    )
}

export default LayoutCus;