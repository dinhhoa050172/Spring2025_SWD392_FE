import vaccinbatchService from "@src/services/vaccinebatchService.js";
import { useEffect, useState } from "react";
import TableVaccineBatch from "./TableVaccineBatch.jsx";
import LoadingSpinner from "@components/Loading/LoadingSnipper.jsx";

const VaccinePath = () => {
    const [vaccineBatch, setVaccineBatch] = useState([]);
    const [status, setStatus] = useState("AVAILABLE");
    const [loading, setLoading] = useState(false);

    const tabs = [
        { name: "Sẵn sàng", value: "AVAILABLE" },
        { name: "Hết vaccine", value: "SOLD OUT" },
        { name: "Tạm ngưng", value: "UNAVAILABLE" },
    ];

    const getVaccineBatch = async (currentStatus) => {
        try {
            setLoading(true);
            const res = await vaccinbatchService.getVaccinePatch(currentStatus);
            console.log(res.data);
            if (res.code === "200") {
                setVaccineBatch(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVaccineBatch(status);
    }, [status]);

    const handleTabChange = (newStatus) => {
        setStatus(newStatus);
    };

     const refreshData = async () => {
        await getVaccineBatch(status);
    };

    return (
        <div className=" px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Thông tin lô vaccine</h2>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`${status === tab.value
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <TableVaccineBatch
                    vaccineBatch={vaccineBatch}
                    refreshData={refreshData} 
                />
            )}

        </div>
    );
};

export default VaccinePath;