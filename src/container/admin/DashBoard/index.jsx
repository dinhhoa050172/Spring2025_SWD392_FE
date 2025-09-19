import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2'; // Import cả Bar và Line
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaMoneyBillWave, FaUser, FaWeebly } from "react-icons/fa";
import CardInfo from "./CardInfo/index.jsx";
import adminService from '@src/services/adminService.js';
import { message } from '@utils/message.js';
import { formatMoney } from '@utils/format.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = () => {
  const [data, setData] = useState({});
  const [selectedTab, setSelectedTab] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCard, setSelectedCard] = useState('revenue');
  const [chartType, setChartType] = useState('bar'); // State để quản lý loại biểu đồ

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTab, selectedYear]);

  const fetchDashboardData = async () => {
    try {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      const response = await adminService.getDashboard(startDate, endDate);
      setData(response);
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
    }
  };

  const listCardInfo = [
    { id: 1, icon: <FaUser size={25} />, title: "Tổng người dùng", type: "users" },
    {
      id: 2,
      icon: <FaMoneyBillWave size={25} />,
      title: "Doanh thu",
      type: "revenue",
    },
    {
      id: 3,
      icon: <FaWeebly size={25} />,
      title: "Tổng số đặt lịch",
      type: "bookings",
    },
  ];

  const handleCardClick = (type) => {
    setSelectedCard(type);
  };

  const chartData = {
    labels: selectedTab === 'monthly' ? Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`) :
              selectedTab === 'quarterly' ? ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'] : ['Năm'],
    datasets: [
      {
        label: selectedCard === 'revenue' ? 'Doanh thu' :
               selectedCard === 'bookings' ? 'Đặt lịch' : 'Người dùng',
        data: selectedTab === 'monthly' ? data[selectedCard]?.monthly :
              selectedTab === 'quarterly' ? data[selectedCard]?.quarterly : data[selectedCard]?.yearly,
        backgroundColor: selectedCard === 'revenue' ? 'rgba(255, 99, 132, 0.2)' :
                         selectedCard === 'bookings' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        borderColor: selectedCard === 'revenue' ? 'rgba(255, 99, 132, 1)' :
                     selectedCard === 'bookings' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Biểu đồ ${selectedCard === 'revenue' ? 'Doanh thu' : selectedCard === 'bookings' ? 'Đặt lịch' : 'Người dùng'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="m-4">
      <h2 className="text-4xl font-bold text-center">Dashboard</h2>
      <div className="gap-4 w-full grid grid-cols-3 text-center justify-center">
        {listCardInfo.map((card) => (
          <div key={card.id} onClick={() => handleCardClick(card.type)} className="cursor-pointer">
            <CardInfo
              icon={card.icon}
              title={card.title}
              money={card.type === 'revenue' ? formatMoney(data[card.type]?.yearly?.[0]) : data[card.type]?.yearly?.[0] || 0}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center my-4">
        <button 
          className={`px-4 py-2 mx-2 ${selectedTab === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setSelectedTab('monthly')}
        >
          Tháng
        </button>
        <button 
          className={`px-4 py-2 mx-2 ${selectedTab === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setSelectedTab('quarterly')}
        >
          Quý
        </button>
        <select 
          className="px-4 py-2 mx-2 bg-gray-200 rounded"
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-center my-4">
        <button 
          className={`px-4 py-2 mx-2 ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setChartType('bar')}
        >
          Biểu đồ cột
        </button>
        <button 
          className={`px-4 py-2 mx-2 ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setChartType('line')}
        >
          Biểu đồ đường
        </button>
      </div>
      <div className="w-full max-w-6xl mx-auto h-[500px]">
        {chartType === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default DashBoard;