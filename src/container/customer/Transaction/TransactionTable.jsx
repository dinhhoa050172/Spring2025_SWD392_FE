import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { formatDateTime, formatMoney } from "@utils/format.js";

const TransactionTable = ({ displayedData, handleOpenDetailModal }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: "center" }}>STT</TableCell>
            <TableCell>Tên trẻ</TableCell>
            <TableCell>Gói vaccine</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Ngày thanh toán</TableCell>
            <TableCell>Trạng thái thanh toán</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((transaction, index) => (
              <TableRow key={transaction.appointmentId}>
                <TableCell style={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell>{transaction.childName}</TableCell>
                <TableCell>
                  {transaction.vaccinePackageName ||
                    (() => {
                      const vaccineNames =
                        transaction.invoice?.[0]?.lineItems
                          ?.map((item) => item.vaccineName)
                          .join(", ") || "";
                      return vaccineNames.length > 30
                        ? vaccineNames.substring(0, 30) + "..."
                        : vaccineNames;
                    })()}
                </TableCell>
                <TableCell>{formatMoney(transaction.totalPrice)} VND</TableCell>
                <TableCell>
                  {transaction.invoice?.[0]?.payments?.[0]?.paymentDate
                    ? formatDateTime(transaction.invoice[0].payments[0].paymentDate)
                    : ""}
                </TableCell>
                <TableCell>
                  {transaction.invoice[0].status === "PENDING" ? (
                    <span className="text-red-500">Chưa thanh toán</span>
                  ) : (
                    <span className="text-green-500">Đã thanh toán</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="contained" color="primary" onClick={() => handleOpenDetailModal(transaction)}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: "center" }}>
                Không có giao dịch nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;