import TextField from "@components/TextField/index.tsx";
import { formatMoney } from "@utils/format.js";

const ConfirmInfo = ({ selectedChild, selectedVaccines, values, methodPayment }) => {
  const totalPrice = selectedVaccines.reduce(
    (sum, vaccine) => sum + (vaccine.pricePerDose || vaccine.totalPrice || 0),
    0
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-600">Xác nhận thông tin</h2>

      {selectedChild && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-black mb-2">Thông tin người tiêm</h2>
          <div className="grid grid-cols-2 gap-6 text-left">
            <TextField title="Tên phụ huynh" data={selectedChild.parentName} />
            <TextField title="Tên đầy đủ" data={selectedChild.childName} />
          </div>
          <div className="grid grid-cols-3 gap-6 text-left mt-2">
            <TextField title="Giới tính" data={selectedChild.childGender === "M" ? "Nam" : "Nữ"} />
            <TextField title="Ngày sinh" data={selectedChild.dateOfBirth} />
            <TextField title="Nơi sinh" data={selectedChild.birthPlace} />
          </div>
          <div className="grid grid-cols-3 gap-6 text-left mt-2">
            <TextField title="Phương pháp sinh" data={selectedChild.birthMethod} />
            <TextField title="Cân nặng (kg)" data={selectedChild.birthWeight} />
            <TextField title="Chiều cao (cm)" data={selectedChild.birthHeight} />
          </div>
          <div>
            <p>Khiếm khuyết</p>
            <textarea value={selectedChild.abnormalities} className="w-full border border-black rounded p-1" />
          </div>
          <TextField title="Ghi chú" data={values.notes} />
          <div className="grid grid-cols-2 gap-6 text-left">
            <TextField title="Ngày tiêm" data={values.date} />
            <TextField title="Giờ tiêm" data={values.time + ":00"} />
          </div>
          {/* Hiển thị phương thức thanh toán */}
          <TextField
            title="Phương thức thanh toán"
            data={methodPayment === "online" ? "Thanh toán trực tuyến" : "Thanh toán tại cơ sở"}
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-2">Danh sách Vaccine</h2>
        {selectedVaccines.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2 text-center">STT</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Tên Vaccine</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Giá tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {selectedVaccines.map((vaccine, index) => (
                <tr key={vaccine.id} className="bg-white text-black">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{vaccine.vaccineName || vaccine.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatMoney(vaccine.pricePerDose) || formatMoney(vaccine.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">
                  Tổng cộng:
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{formatMoney(totalPrice)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="text-gray-500">Chưa chọn vaccine nào</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmInfo;