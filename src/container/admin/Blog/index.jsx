import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Typography,
  Box,
  Button,
  Modal, // Thêm Modal từ Material-UI
} from "@mui/material";
import { toast } from "react-toastify";
import { staffService } from "@src/services/staffService.js";
import { message } from "@utils/message.js";
import { blogService } from "@src/services/blogService.js";

const columns = [
  { id: "title", label: "Tiêu đề", minWidth: 200 },
  { id: "imageUrl", label: "Hình ảnh", minWidth: 180 },
  { id: "authorFullName", label: "Tác giả", minWidth: 110 },
  { id: "blogStatus", label: "Trạng thái", minWidth: 80 },
  { id: "createdAt", label: "Ngày tạo", minWidth: 180 },
  { id: "actions", label: "Hành động", minWidth: 300 },
];

export default function BlogAdmin() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const blogData = await staffService.getAllBlog(page, rowsPerPage);
      const draftBlogs = blogData.content.filter(
        (blog) => blog.blogStatus === "DRAFT"
      );
      setRows(draftBlogs);
      setTotalElements(draftBlogs.length);
    } catch (error) {
      setError(message.ERROR_FETCH_DATA);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, rowsPerPage]);

  const handleAcceptBlog = async (blogId) => {
    try {
      await blogService.acceptBlog(blogId);
      toast.success(message.UPDATE_SUCCESS, {
        closeOnClick: true,
        autoClose: 3000,
      });
      fetchBlogs();
    } catch (error) {
      console.error(message.UPDATE_ERROR, error);
      toast.error(message.UPDATE_ERROR, {
        closeOnClick: true,
        autoClose: 3000,
      });
    }
  };

  const handleRejectBlog = async (blogId) => {
    try {
      await blogService.rejectBlog(blogId);
      toast.success(message.UPDATE_SUCCESS, {
        closeOnClick: true,
        autoClose: 3000,
      });
      fetchBlogs();
    } catch (error) {
      console.error(message.UPDATE_ERROR, error);
      toast.error(message.UPDATE_ERROR, {
        closeOnClick: true,
        autoClose: 3000,
      });
    }
  };

  const handleViewBlogDetail = async (blogId) => {
    try {
      const response = await staffService.getDetailBlog(blogId);
      setSelectedBlog(response);
      setOpenModal(true);
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      toast.error(message.ERROR_FETCH_DATA, {
        closeOnClick: true,
        autoClose: 3000,
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBlog(null);
  };

  if (rows.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">Không có Blog nào.</h1>
      </div>
    );
  }

  return (
    <Paper
      sx={{
        width: "100%",
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mr={4}
      >
        <Typography variant="h5" fontWeight="bold">
          Quản lý Blog
        </Typography>
      </Box>

      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader aria-label="blog table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return column.id === "actions" ? (
                          <TableCell key={column.id}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleViewBlogDetail(row.blogId)}
                            >
                              Chi tiết
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleAcceptBlog(row.blogId)}
                            >
                              Chấp nhận
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRejectBlog(row.blogId)}
                            >
                              Từ chối
                            </Button>
                          </TableCell>
                        ) : column.id === "imageUrl" ? (
                          <TableCell key={column.id}>
                            <img
                              src={value}
                              alt="Blog Thumbnail"
                              style={{
                                width: "100px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          </TableCell>
                        ) : (
                          <TableCell key={column.id}>
                            {column.id === "blogStatus"
                              ? value === "DRAFT"
                                ? "Nháp"
                                : "Công khai"
                              : column.id.includes("createdAt") ||
                                column.id.includes("updatedAt")
                              ? new Date(value).toLocaleString()
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Không tìm thấy blog nào ở trạng thái DRAFT.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={Math.min(
              page,
              Math.max(0, Math.ceil(totalElements / rowsPerPage) - 1)
            )}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />
        </>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="blog-detail-modal"
        aria-describedby="blog-detail-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {selectedBlog ? (
            <div className="text-left flex items-center justify-center">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CircularProgress size="6rem" />
            </div>
          )}
        </Box>
      </Modal>
    </Paper>
  );
}
