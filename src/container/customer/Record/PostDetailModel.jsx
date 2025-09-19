import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  FaSyringe as VaccineIcon,
  FaClock as TimeIcon,
  FaHeartbeat as StatusIcon,
  FaExclamationTriangle as AbnormalIcon,
  FaThermometerHalf as TempIcon,
  FaBaby as ChildIcon,
  FaCalendarAlt as DateIcon,
  FaRegClock as ClockIcon,
  FaMale as MaleIcon,
  FaFemale as FemaleIcon
} from 'react-icons/fa';

const PostDetailModel = ({ 
  open, 
  onClose, 
  currentDetail, 
  detailData, 
  detailLoading,
  formatDate,
  formatDateTime 
}) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Bình thường':
        return 'success';
      case 'Bất thường':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 2,
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        <Box display="flex" alignItems="center">
          <VaccineIcon style={{ marginRight: 8 }} />
          THÔNG TIN TRẠNG THÁI SAU TIÊM
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        {detailLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {/* Thông tin trẻ */}
            <Box 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                bgcolor: theme.palette.grey[50],
                boxShadow: theme.shadows[1]
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.dark
              }}>
                <ChildIcon style={{ color: theme.palette.primary.main, marginRight: 8 }} />
                THÔNG TIN TRẺ
              </Typography>
              
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.light, 
                    width: 32, 
                    height: 32,
                    mr: 1.5
                  }}>
                    {currentDetail?.childName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Tên trẻ</Typography>
                    <Typography fontWeight="medium">{currentDetail?.childName}</Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  {currentDetail?.childGender === "M" ? 
                    <MaleIcon style={{ color: theme.palette.info.main, marginRight: 12 }} /> : 
                    <FemaleIcon style={{ color: theme.palette.error.main, marginRight: 12 }} />}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Giới tính</Typography>
                    <Typography fontWeight="medium">
                      {currentDetail?.childGender === "M" ? "Nam" : "Nữ"}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <DateIcon style={{ color: theme.palette.action.active, marginRight: 12 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Ngày tiêm</Typography>
                    <Typography fontWeight="medium">
                      {formatDate(currentDetail?.scheduledDate)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <ClockIcon style={{ color: theme.palette.action.active, marginRight: 12 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Giờ tiêm</Typography>
                    <Typography fontWeight="medium">
                      {currentDetail?.timeFrom}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Chi tiết trạng thái */}
            <Typography variant="h6" gutterBottom sx={{ 
              mt: 4,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.dark
            }}>
              <StatusIcon style={{ color: theme.palette.primary.main, marginRight: 8 }} />
              CHI TIẾT TRẠNG THÁI SAU TIÊM
            </Typography>
            
            {detailData.map((item, index) => (
              <Box 
                key={index} 
                mb={3} 
                p={3} 
                border={1} 
                borderRadius={2} 
                borderColor="divider"
                sx={{
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[2],
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <VaccineIcon style={{ color: theme.palette.secondary.main, marginRight: 12 }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="secondary">
                    {item.vaccineName}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {item.detail ? (
                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                    <Box display="flex" alignItems="flex-start">
                      <TimeIcon style={{ color: theme.palette.action.active, marginRight: 12, marginTop: 4 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Thời gian kiểm tra</Typography>
                        <Typography fontWeight="medium">
                          {formatDateTime(item.detail.checkupTime)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start">
                      <StatusIcon style={{ color: theme.palette.action.active, marginRight: 12, marginTop: 4 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Tình trạng</Typography>
                        <Chip 
                          label={item.detail.status} 
                          size="small"
                          color={getStatusColor(item.detail.status)}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start">
                      <AbnormalIcon style={{ color: theme.palette.action.active, marginRight: 12, marginTop: 4 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Bất thường</Typography>
                        <Typography fontWeight="medium">
                          {item.detail.abnormalities || "Không có"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start">
                      <TempIcon style={{ color: theme.palette.action.active, marginRight: 12, marginTop: 4 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Nhiệt độ</Typography>
                        <Box display="flex" alignItems="center">
                          <Typography fontWeight="bold" sx={{ mr: 1 }}>
                            {item.detail.temperature}°C
                          </Typography>
                          {item.detail.temperature > 38 && (
                            <Chip 
                              label="Sốt" 
                              size="small" 
                              color="warning"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box textAlign="center" py={2}>
                    <Typography color="textSecondary" fontStyle="italic">
                      Không có dữ liệu chi tiết trạng thái sau tiêm
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDetailModel;