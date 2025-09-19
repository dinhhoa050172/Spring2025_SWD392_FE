import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Divider
} from "@mui/material";
import { formatDate } from "@utils/format.js";
import { 
  FiDollarSign, FiCalendar, FiPackage, 
  FiCheckCircle, FiXCircle, FiCreditCard, 
  FiPrinter, FiDownload
} from "react-icons/fi";
import { FaBaby, FaUserAlt, FaMale, FaFemale } from "react-icons/fa";

const TransactionDetailModal = ({ selectedTransaction, detailModalOpen, handleCloseDetailModal }) => {
  return (
    <Dialog 
      open={detailModalOpen} 
      onClose={handleCloseDetailModal} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle className="text-xl font-bold bg-blue-50 text-blue-700 flex items-center">
        <FiCreditCard className="mr-2" />
        Chi tiết Giao dịch
      </DialogTitle>
      <DialogContent className="p-6">
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start mt-2">
                <FaBaby className="text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Tên trẻ</p>
                  <p className="font-medium">{selectedTransaction.childName}</p>
                </div>
              </div>
              
              <div className="flex items-start mt-2">
                {selectedTransaction.childGender === "M" ? (
                  <FaMale className="text-blue-500 mr-3 mt-1" />
                ) : (
                  <FaFemale className="text-pink-500 mr-3 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium">
                    {selectedTransaction.childGender === "M" ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCalendar className="text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-medium">{formatDate(selectedTransaction.dateOfBirth)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaUserAlt className="text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Tên phụ huynh</p>
                  <p className="font-medium">{selectedTransaction.parentName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiPackage className="text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Gói vaccine</p>
                  <p className="font-medium">{selectedTransaction.vaccinePackageName || "Không"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiDollarSign className="text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="font-medium">{selectedTransaction.totalPrice.toLocaleString()} VND</p>
                </div>
              </div>
              
              <div className="flex items-start">
                {selectedTransaction.invoice[0].status === "PENDING" ? (
                  <FiXCircle className="text-red-500 mr-3 mt-1" />
                ) : (
                  <FiCheckCircle className="text-green-500 mr-3 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                  <p className={`font-medium ${
                    selectedTransaction.invoice[0].status === "PENDING" ? "text-red-500" : "text-green-500"
                  }`}>
                    {selectedTransaction.invoice[0].status === "PENDING" ? "Chưa thanh toán" : "Đã thanh toán"}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Chi tiết hóa đơn */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiCreditCard className="mr-2 text-blue-500" />
                Chi tiết hóa đơn
              </h3>
              
              <TableContainer 
                component={Paper} 
                sx={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: 'none'
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Tên Vaccine</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Số liều</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Đơn giá</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTransaction.invoice[0].lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.vaccineName}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{item.doseQuantity}</TableCell>
                        <TableCell>{item.pricePerDose.toLocaleString()} VND</TableCell>
                        <TableCell>{item.subtotal.toLocaleString()} VND</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                        Tổng tiền:
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {selectedTransaction.invoice[0].lineItems
                          .reduce((total, item) => total + item.subtotal, 0)
                          .toLocaleString()} VND
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
        <Button 
          onClick={handleCloseDetailModal} 
          variant="contained" 
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2563eb'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailModal;