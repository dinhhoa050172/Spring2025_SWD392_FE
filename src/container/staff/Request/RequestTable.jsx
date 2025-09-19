import { formatDateTime } from "@utils/format.js";

const RequestTable = ({ requests, openDetailModal }) => {
  const parseReason = (reasonJson) => {
    try {
      const reasonObj = JSON.parse(reasonJson);
      return reasonObj.reasonCancelled || reasonJson;
    } catch (e) {
      return reasonJson;
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 w-1/7">STT</th>
            <th className="border p-2 w-1/7">Tên</th>
            <th className="border p-2 w-2/7">Lý do</th>
            <th className="border p-2 w-1/7">Thời gian hủy</th>
            <th className="border p-2 w-1/7">Trạng thái</th>
            <th className="border p-2 w-1/7">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id} className="hover:bg-gray-100">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">{request.customerName}</td>
              <td className="border p-2 text-left">
                {parseReason(request.reason)}
              </td>
              <td className="border p-2 text-center">
                {formatDateTime(request.cancellationTime)}
              </td>
              <td className="border p-2 text-center">
                <span
                  className={`px-2 py-1 rounded ${
                    request.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status === "PENDING"
                    ? "Đang chờ"
                    : request.status === "APPROVED"
                    ? "Đã chấp nhận"
                    : "Đã từ chối"}
                </span>
              </td>
              <td className="border p-2 text-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openDetailModal(request)}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;