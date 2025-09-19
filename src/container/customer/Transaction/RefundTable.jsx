import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { formatDateTime } from "@utils/format.js";

const RefundTable = ({ refunds }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip 
            label="Đã duyệt" 
            color="success" 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case "PENDING":
        return (
          <Chip 
            label="Đang chờ" 
            color="warning" 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case "REJECTED":
        return (
          <Chip 
            label="Từ chối" 
            color="error" 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return (
          <Chip 
            label={status} 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: "center" }}>STT</TableCell>
            <TableCell>Tên vaccine</TableCell>
            <TableCell>Tên trẻ</TableCell>
            <TableCell>Ngày hủy</TableCell>
            <TableCell>Số tiền hoàn</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refunds.length > 0 ? (
            refunds.map((refund, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell>{refund.vaccineName}</TableCell>
                <TableCell>{refund.childName}</TableCell>
                <TableCell>{formatDateTime(refund.cancellationTime)}</TableCell>
                <TableCell>{refund.refundAmount.toLocaleString()} VND</TableCell>
                <TableCell>
                  {getStatusChip(refund.status)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: "center" }}>
                Không có yêu cầu hoàn tiền nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RefundTable;