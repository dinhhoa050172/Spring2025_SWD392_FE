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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import { staffService } from "@src/services/staffService.js";
import CreateBlogModal from "../CreateBlog/index.jsx";
import UpdateBlogModal from "../UpdateBlog/index.jsx";
import { message } from "@utils/message.js";

const columns = [
  { id: "title", label: "Tiêu đề", minWidth: 200 },
  { id: "imageUrl", label: "Hình ảnh", minWidth: 200 },
  { id: "authorFullName", label: "Tác giả", minWidth: 150 },
  { id: "blogStatus", label: "Trạng thái", minWidth: 120 },
  { id: "createdAt", label: "Ngày tạo", minWidth: 180 },
  { id: "actions", label: "Hành động", minWidth: 200 },
];

export default function BlogTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const blogData = await staffService.getAllBlog(page, rowsPerPage);
      setRows(blogData.content || []);
      setTotalElements(blogData.totalElements || 0);
      if (blogData.totalElements === 0) {
        setPage(0);
      }
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

  const handleUpdateClick = (id) => {
    setCurrentBlogId(id);
    setOpenUpdateModal(true);
  };

  const handleCreateBlog = () => {
    setOpenCreateModal(false);
    fetchBlogs();
  };

  const handleUpdateBlog = () => {
    setOpenUpdateModal(false);
    fetchBlogs();
    toast.success(message.UPDATE_SUCCESS, {
      closeOnClick: true,
      autoClose: 3000,
    });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedBlogId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedBlogId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteBlog = async () => {
    setLoadingDelete(true);
    if (!selectedBlogId) {
      console.error("No blog ID selected for deletion.");
      return;
    }
    try {
      await staffService.deleteBlog(selectedBlogId);
      toast.success(message.DELETE_SUCCESS, {
        closeOnClick: true,
        autoClose: 3000,
      });
      fetchBlogs();
    } catch (error) {
      console.error(message.DELETE_ERROR, error);
      setError(message.DELETE_ERROR);
      toast.error(message.DELETE_ERROR, {
        closeOnClick: true,
        autoClose: 3000,
      });
    } finally {
      handleCloseDeleteDialog();
      setLoadingDelete(false);
    }
  };

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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
        >
          Tạo Blog
        </Button>
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
                              onClick={() => handleUpdateClick(row.blogId)}
                            >
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleOpenDeleteDialog(row.blogId)}
                            >
                              Xóa
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
                                : value === "PUBLISHED"
                                ? "Công khai" : "Từ chối"
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
                      No blogs found.
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

      {/* Modal Xác nhận Xóa */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa blog này không? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteBlog}
            color="error"
            disabled={loadingDelete}
          >
            {loadingDelete ? <CircularProgress size={24} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Tạo Blog */}
      <CreateBlogModal
        open={openCreateModal}
        handleClose={() => setOpenCreateModal(false)}
        onSubmit={handleCreateBlog}
      />

      {/* Modal Cập nhật Blog */}
      <UpdateBlogModal
        open={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateBlog}
        blogId={currentBlogId}
      />
    </Paper>
  );
}
