import { useState, useEffect, Suspense } from "react";
import Banner from "@containers/Banner/index.jsx";
import PriceList from "@containers/PriceList/index.jsx";
import { CircularProgress } from "@mui/material";
import HeaderSection from "@components/HeaderSection/index.jsx";
import BlogSection from "@containers/BlogSection/index.jsx";
import ServiceList from "@containers/ServiceList/index.jsx";
import AboutUs from "@containers/AboutsUs/index.jsx";
import VaccinationGuide from "@containers/VaccinationGuide/index.jsx";
import RegisterVaccination from "@containers/RegisterVaccination/index.jsx";
const Home = () => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRendered(true);
        }, 1000);
        window.scrollTo(0, 0);

        return () => clearTimeout(timer);

    }, []);

    if (!isRendered) {
        return <div className="flex h-screen items-center justify-center text-2xl">
            <CircularProgress size="6rem" />
        </div>;
    }

    return (
        <div>
            <HeaderSection />
            <div name="home" className="h-full">
                <Banner />
            </div>
            <div name="aboutUs" className="h-[80vh] flex items-center justify-center">
                <AboutUs />
            </div>
            <div name="guide" className="h-[90vh] flex items-center justify-center">
                <VaccinationGuide />
            </div>
            <div name="service" className="min-h-[90vh] flex flex-col items-center justify-center">
                <ServiceList />
            </div>
            <div name="priceList" className="min-h-[100vh] flex items-center justify-center">
                <PriceList />
            </div>
            <Suspense fallback={<div>Loading....</div>}>
                <div name="registerVaccination" className="min-h-[100vh] flex items-start justify-center  bg-gray-100">
                    <RegisterVaccination />
                </div>
            </Suspense>
            <div name="blog" className="min-h-[100vh] flex items-center justify-center">
                <BlogSection />
            </div>
        </div>
    );
};

export default Home;
