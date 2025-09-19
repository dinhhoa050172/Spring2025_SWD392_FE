import { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, Tabs, Tab } from "@mui/material";
import { IoClose } from "react-icons/io5";
import BasicInfoTab from "./BasicInfoTab.jsx";
import VaccinesTab from "./VaccinesTab.jsx";
import { servicePackageVaccine } from "@src/services/servicePackageVaccine.js";
import { message } from "@utils/message.js";

const EditPackageVaccine = ({ packageData, open, onClose, onUpdate }) => {
    const [tabValue, setTabValue] = useState(0);
    const [availableVaccines, setAvailableVaccines] = useState([]);
    useEffect(() => {
        if (open && packageData) {
            const fetchVaccines = async () => {
                try {
                    const response = await servicePackageVaccine.getAllVaccineAndPackage();
                    if (response) {
                        const allVaccines = response.vaccines;
                        const packageVaccines = packageData.vaccineLineServiceDTO || [];
                        setAvailableVaccines(allVaccines.filter(v =>
                            !packageVaccines.some(pv => pv.vaccineId === v.vaccineId)
                        ));
                    }
                } catch (error) {
                    console.error(message.ERROR_FETCH_DATA, error);
                }
            };
            fetchVaccines();
        }
    }, [open, packageData]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUpdate = () => {
        onUpdate();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                    overflowY: "auto",
                    borderRadius: 2,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        Cập nhật Gói Vaccine
                    </Typography>
                    <Button onClick={onClose} sx={{ minWidth: "unset", p: 0 }}>
                        <IoClose size={30} />
                    </Button>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Thông tin cơ bản" />
                    <Tab label="Danh sách Vaccine" />
                </Tabs>

                {tabValue === 0 && (
                    <BasicInfoTab
                        packageData={packageData}
                        onUpdate={handleUpdate}
                    />
                )}
                {tabValue === 1 && (
                    <VaccinesTab
                        packageId={packageData?.vaccinePackageId}
                        availableVaccines={availableVaccines}
                        setAvailableVaccines={setAvailableVaccines}
                        onUpdate={handleUpdate}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default EditPackageVaccine;