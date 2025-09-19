import React, { useState, useEffect } from 'react';
import { userService } from '@src/services/userService.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material';
import {  formatDateTime } from '@utils/format.js';
import { message } from '@utils/message.js';

const CancelScheduleCus = () => {
  const [cancelRequests, setCancelRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCancelRequests = async () => {
      try {
        const response = await userService.getCancelSchedule(userId);
        setCancelRequests(response || []);
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelRequests();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" height="80vh" alignItems="center" justifyContent="center">
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách yêu cầu hủy lịch bị từ chối</h2>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên vaccine</TableCell>
              <TableCell>Tên trẻ</TableCell>
              <TableCell>Lý do hủy</TableCell>
              <TableCell>Thời gian hủy</TableCell>
              <TableCell>Lý do từ chối</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cancelRequests.length > 0 ? (
              cancelRequests.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.vaccineName}</TableCell>
                  <TableCell>{request.childName}</TableCell>
                  <TableCell>{request.cancellationReason}</TableCell>
                  <TableCell>{formatDateTime(request.cancellationTime)}</TableCell>
                  <TableCell>{request.rejectionReason === "null" ? "Không có" : request.rejectionReason}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === "REJECTED" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {request.status === "REJECTED" ? "Bị từ chối" : request.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                  Không có yêu cầu hủy lịch nào bị từ chối
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CancelScheduleCus;