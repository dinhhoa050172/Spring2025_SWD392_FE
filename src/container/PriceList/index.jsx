import Pagination from "@components/Paging/index.jsx";
import { CircularProgress } from "@mui/material";
import vaccineService from "@src/services/vaccineService.js";
import { message } from "@utils/message.js";
import { useEffect, useState } from "react";

export default function PriceList() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await vaccineService.getAllPriceVaccine();
        if (Array.isArray(response)) {
          setPrices(response);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", response);
          setPrices([]);
        }
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const totalPages = Math.ceil((prices || []).length / itemsPerPage);
  const currentItems = (prices || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handler for page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  return (
    <>
      {prices.length > 0 ? (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center">Bảng giá</h1>
          <div className="overflow-x-auto w-full p-2 mt-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="table-fixed w-full text-sm text-left md:text-base border-collapse min-h-[60vh]">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2 w-1/6">Tên vắc xin</th>
                    <th className="px-4 py-2 w-1/6">Loại vắc xin</th>
                    <th className="px-4 py-2 w-1/6">Nước sản xuất</th>
                    <th className="px-4 py-2 w-1/6">Giá mỗi liều (VNĐ)</th>
                    <th className="px-4 py-2 w-1/6">Bệnh phòng ngừa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((vaccine, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{vaccine.vaccineName}</td>
                      <td className="px-4 py-2">{vaccine.diseaseName}</td>
                      <td className="px-4 py-2">{vaccine.countryOfOrigin}</td>
                      <td className="px-4 py-2">
                        {vaccine.pricePerDose.toLocaleString()} VNĐ
                      </td>
                      <td className="px-4 py-2">{vaccine.diseaseName}</td>
                    </tr>
                  ))}
                  {Array.from({ length: itemsPerPage - currentItems.length }).map(
                    (_, index) => (
                      <tr key={`empty-${index}`} className="h-[70px]">
                        <td className="px-4 py-2" colSpan={5}></td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center space-x-4 mt-4">
              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center text-2xl">
          <span>Không có dữ liệu</span>
        </div>
      )}
    </>
  );
}