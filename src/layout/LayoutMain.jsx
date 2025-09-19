import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header/index.jsx"
import Footer from "@components/Footer/index.jsx"
import { useEffect } from "react";

const LayoutMain = () => {
    const location = useLocation();

    useEffect(() => {
        //functions here
    }, [location.pathname]);

    return (
        <div>
            <header className="">
                <Header />
                
            </header>
            <Outlet />
            <footer>
                <Footer />
            </footer>
        </div>
    )
}

export default LayoutMain