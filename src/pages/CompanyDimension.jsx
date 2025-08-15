import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: 24,
    minWidth: 320,
};

const CompanyDimension = () => {
    const { dimension } = useParams();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [modalText, setModalText] = useState("");

    const handleOpen = (text) => {
        setModalText(text);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const formattedDimension =
        dimension.charAt(0).toUpperCase() + dimension.slice(1);

    const companyName = "ByteIQ Analytics";

    const columns = [
        { id: "field", label: "Field" },
        { id: "value", label: "Value" },
        { id: "source", label: "Source" },
    ];

    const rows = [
        {
            field: "Company Name",
            value: companyName,
            info: "This is the registered company name from official filings.",
            source: "Crunchbase",
        },
        {
            field: "Industry",
            value: "Data Analytics & AI",
            info: "Industry classification is based on NAICS code and LinkedIn data.",
            source: "LinkedIn",
        },
        {
            field: "Headquarters",
            value: "New York, NY",
            info: "This is the latest known headquarters location.",
            source: "Company Website",
        },
        {
            field: "Revenue (Annual)",
            value: "$42.5M",
            info: "Estimated based on SEC filings and market analysis.",
            source: "SEC Filings",
        },
        {
            field: "Employees",
            value: "245",
            info: "Employee count as per Glassdoor and LinkedIn profiles.",
            source: "Glassdoor",
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        border: "2px solid",
                        borderColor: "1px solid #056682",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        mr: 2,
                    }}
                >
                    <ArrowBackIcon fontSize="large" color="black" />
                </IconButton>

                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formattedDimension} / {companyName}
                </Typography>
            </Box>

            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ 
                            background: "linear-gradient(90deg, #21464fff, #0a4857ff)",
                        }}>
                            <TableRow>
                                {columns.map((col) => (
                                    <StyledTableCell key={col.id} sx={{ 
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        borderBottom: "none"
                                    }}>
                                        {col.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, idx) => (
                                <StyledTableRow key={idx}>
                                    <StyledTableCell>{row.field}</StyledTableCell>
                                    <StyledTableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <span>{row.value}</span>
                                            <Tooltip title="More information">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handleOpen(row.info)}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>{row.source}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">Additional Information</Typography>
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body1">{modalText}</Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default CompanyDimension;