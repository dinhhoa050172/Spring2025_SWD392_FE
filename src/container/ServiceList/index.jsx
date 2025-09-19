// src/components/ServiceList/ServiceList.jsx
import { useEffect, useState } from 'react';
import { servicePackageVaccine } from "@src/services/servicePackageVaccine.js";
import { generateTabsData } from './ContentTabs.jsx';
import { message } from '@utils/message.js';
import LoadingSpinner from '@components/Loading/LoadingSnipper.jsx';
import TabsContainer from '@components/Tabs/index.jsx';
import Pagination from '@components/Paging/index.jsx';



const ServiceList = () => {
    const [vaccines, setVaccines] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabsData, setTabsData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(null);

    const fetchVaccines = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await servicePackageVaccine.getAllPackageVaccine(currentPage, pageSize);

            if (response && response.code === "200" && response.data) {
                setVaccines(response.data);
                setTotalPages(response.paging.totalPages || 1);

                const newTabs = generateTabsData(response.data);
                setTabsData(newTabs);
                // Reset selectedTab to the first tab when page changes
                if (newTabs.length > 0) {
                    // Check if current selectedTab exists in newTabs
                    const tabExists = newTabs.some(tab => tab.value === selectedTab);
                    if (!tabExists) {
                        setSelectedTab(newTabs[0].value);
                    }
                } else {
                    setSelectedTab(null);
                }
            } else {
                setVaccines([]);
                setTotalPages(1);
                setTabsData([]);
            }
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
            setError(error.message || "Không thể tải dữ liệu");
            setVaccines([]);
            setTotalPages(1);
            setTabsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccines();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) return <LoadingSpinner />;
    // if (error) return <ErrorMessage message={error} />;

    return (
        <div className="w-full min-h-screen flex flex-col items-center py-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Dịch vụ</h1>
            <p className="text-center mx-6 md:mx-16 mb-8 max-w-5xl text-gray-600">
                Tiêm vắc xin đầy đủ và đúng lịch giúp cơ thể kích thích sinh ra miễn dịch chủ động đặc hiệu,
                từ đó tăng cường sức đề kháng, phòng ngừa các bệnh nguy hiểm. Hiểu được điều đó,
                Trung tâm tiêm chủng Nhân Ái xin giới thiệu các gói vắc xin phù hợp với từng trẻ nhỏ như sau:
            </p>

            <TabsContainer
                tabs={tabsData}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
            />

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ServiceList;