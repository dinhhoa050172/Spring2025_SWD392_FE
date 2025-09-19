import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { userService } from "@src/services/userService.js";
import { message } from "@utils/message.js";
import TransactionTable from "./TransactionTable";
import TransactionDetailModal from "./TransactionDetailModal";
import Pagination from "@src/components/Paging/index.jsx";
import { FaSearch } from "react-icons/fa";
import RefundTable from "./RefundTable.jsx";
export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("PENDING");
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await userService.getTransaction(userId);

        if (response) {
          setTransactions(response || []);
          setTotalItems(response.length || 0);
          setTotalPages(Math.ceil(response.length / pageSize) || 1);
        }
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
        setTransactions([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (selectedTab === "REFUND") {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = refunds.slice(startIndex, endIndex);
      setDisplayedData(paginatedData);
      setTotalItems(refunds.length);
      setTotalPages(Math.ceil(refunds.length / pageSize) || 1);
    } else {
      const filteredTransactions = transactions.filter((transaction) =>
        selectedTab === "PENDING"
          ? transaction.invoice[0].status === "PENDING"
          : transaction.invoice[0].status !== "PENDING"
      );
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredTransactions.slice(startIndex, endIndex);
      setDisplayedData(paginatedData);
      setTotalItems(filteredTransactions.length);
      setTotalPages(Math.ceil(filteredTransactions.length / pageSize) || 1);
    }
  }, [page, pageSize, transactions, refunds, selectedTab]);

  const handleOpenDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleTabChange = async (tab) => {
    setSelectedTab(tab);
    setPage(1);

    if (tab !== "REFUND") {
      try {
        setLoading(true);
        const response = await userService.getTransaction(userId);
        if (response) {
          setTransactions(response || []);
          setTotalItems(response.length || 0);
          setTotalPages(Math.ceil(response.length / pageSize) || 1);
        }
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
        setTransactions([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        searchTransaction(value);
      }, 500)
    );
  };

  const searchTransaction = async (search) => {
    try {
      const response = await userService.searchTransaction(
        userId,
        selectedTab,
        search
      );
      if (response) {
        setTransactions(response || []);
        setTotalItems(response.length || 0);
        setTotalPages(Math.ceil(response.length / pageSize) || 1);
      }
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      setTransactions([]);
      setTotalItems(0);
      setTotalPages(1);
    }
  };

  const handleTabRefund = async () => {
    try {
      setLoading(true);
      setSelectedTab("REFUND");
      const response = await userService.getTransactionRefund(userId);
      if (response) {
        setRefunds(response || []);
        setTotalItems(response.length || 0);
        setTotalPages(Math.ceil(response.length / pageSize) || 1);
      }
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      setRefunds([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách Giao dịch</h2>

      <div className="mb-4 flex border-b border-gray-200 justify-between">
        <div>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
              selectedTab === "PENDING"
                ? "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500"
                : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-800"
            }`}
            onClick={() => handleTabChange("PENDING")}
          >
            Chưa thanh toán
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
              selectedTab === "PAID"
                ? "bg-blue-100 text-blue-800 border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
            }`}
            onClick={() => handleTabChange("PAID")}
          >
            Đã thanh toán
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
              selectedTab === "REFUND"
                ? "bg-green-100 text-green-800 border-b-2 border-green-500"
                : "text-gray-600 hover:bg-green-50 hover:text-green-800"
            }`}
            onClick={handleTabRefund}
          >
            Hoàn tiền
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên vaccine..."
            value={searchText}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2">Số lượng:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded-md p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>{" "}
        / trang
      </div>

      {selectedTab === "REFUND" ? (
        <RefundTable refunds={displayedData} />
      ) : (
        <TransactionTable
          displayedData={displayedData}
          handleOpenDetailModal={handleOpenDetailModal}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <TransactionDetailModal
        selectedTransaction={selectedTransaction}
        detailModalOpen={detailModalOpen}
        handleCloseDetailModal={handleCloseDetailModal}
      />
    </div>
  );
}
