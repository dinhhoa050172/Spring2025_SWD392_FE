import { useState } from "react";
import VaccineTable from "./TableVaccine.jsx";
import { Modal, Box, Button, Typography } from "@mui/material";

import VaccineCreationModal from "./CreateVaccineSteper/VaccineCreationModal.jsx";

const AdminVaccine = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [refreshTable, setRefreshTable] = useState(0); // State to trigger table refresh

    // Callback to handle successful creation
    const handleVaccineCreated = () => {
        setRefreshTable((prev) => prev + 1); // Increment to trigger table refresh
        setCreateVaccine(false); // Close the modal
    };

    return (
        <div className="m-6">
            {/* Button để mở modal */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateModal(true)}
                sx={{ml:3}}
            >
                Thêm Vaccine Mới
            </Button>
            <VaccineTable refreshTrigger={refreshTable} />
           
            {/* Modal tạo vaccine */}
            <VaccineCreationModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            />
        </div>
    );
};

export default AdminVaccine;