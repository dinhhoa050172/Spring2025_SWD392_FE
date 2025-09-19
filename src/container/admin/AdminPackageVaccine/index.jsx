import { useState } from "react";
import TablePackageVaccine from "./TablePackageVaccine.jsx";
import CreatePackageVaccine from "./CreatePackageVaccine.jsx";
import { Modal, Box, Button } from "@mui/material";

const PackageVaccine = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="m-6">
            {/* Nút mở modal */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Tạo Gói Vaccine
            </Button>


            {/* Bảng hiển thị danh sách gói vaccine */}
            <TablePackageVaccine />
            
            {/* Modal hiển thị CreatePackageVaccine */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        overflowY: 'scroll',
                        width: 700,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >

                    <CreatePackageVaccine open={open} onClose={handleClose} />
                </Box>
            </Modal>
        </div>
    );
};

export default PackageVaccine;
