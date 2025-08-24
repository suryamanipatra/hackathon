import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Config from "../config.js"
import {
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Paper,
    Snackbar,
    Alert,
    Divider,
    Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CompanyDimension = () => {
    const { dimension, companyName } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState({ text: "", highlights: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const decodedCompanyName = decodeURIComponent(companyName);
                const response = await fetch(
                    `${Config.baseURL}result/${decodedCompanyName}/${dimension}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
           
                const processedText = data.result
                    .replace(/#+\s*/g, '') 
                    .replace(/\*\*/g, '')
                    .replace(/\*/g, '') 
                    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                    .replace(/- /g, '• ') 
                    .replace(/\n\s*\n/g, '\n\n'); 
                
                const highlightsMatch = data.result.match(/\* (.*?)(?=\n|$)/g);
                const highlights = highlightsMatch 
                    ? highlightsMatch.map(h => h.replace(/\* /g, '').trim())
                    : [];
                
                setContent({
                    text: processedText,
                    highlights
                });
                setError(null);
                
                const savedData = JSON.parse(localStorage.getItem('companyAnalysisData') || '{}');
                const updatedStatus = {
                    ...(savedData.status || {}),
                    [dimension]: {
                        loading: false,
                        completed: true
                    }
                };

                localStorage.setItem('companyAnalysisData', JSON.stringify({
                    company: savedData.company || decodedCompanyName,
                    status: updatedStatus
                }));
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
        };
    }, [dimension, companyName]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const formattedDimension =
        dimension.charAt(0).toUpperCase() + dimension.slice(1);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <CircularProgress size={60} sx={{ color: '#056682' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 3,
                background: '#fff8f8',
                borderRadius: 2,
                borderLeft: '4px solid #ff5252'
            }}>
                <Typography color="error" variant="h6">
                    Error loading data: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: 3,
            background: 'linear-gradient(to bottom, #f9f9f9, #eef2f5)',
            minHeight: '100vh'
        }}>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="error"
                    sx={{ 
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        fontWeight: 500
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
            
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 3,
                p: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        border: "2px solid",
                        borderColor: "#056682",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        mr: 2,
                        backgroundColor: '#056682',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#034b5e'
                        }
                    }}
                >
                    <ArrowBackIcon fontSize="medium" />
                </IconButton>

                <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    color: '#056682',
                    textTransform: 'capitalize'
                }}>
                    {formattedDimension} Analysis
                </Typography>
                
                <Chip 
                    label={decodeURIComponent(companyName)} 
                    sx={{ 
                        ml: 2,
                        backgroundColor: '#e0f7fa',
                        color: '#006064',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }} 
                />
            </Box>

            {content.highlights.length > 0 && (
                <Paper elevation={2} sx={{ 
                    mb: 3, 
                    p: 2,
                    backgroundColor: '#e8f5e9',
                    borderLeft: '4px solid #43a047'
                }}>
                    <Typography variant="h6" sx={{ 
                        mb: 1,
                        color: '#2e7d32',
                        fontWeight: 'bold'
                    }}>
                        Key Highlights
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        {content.highlights.map((item, index) => (
                            <Typography 
                                component="li" 
                                key={index}
                                variant="body1"
                                sx={{ 
                                    mb: 1,
                                    color: '#1b5e20'
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Box>
                </Paper>
            )}

            <Paper elevation={3} sx={{ 
                p: 3,
                backgroundColor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8,
                        color: '#333',
                        '& .highlight': {
                            backgroundColor: '#fffde7',
                            padding: '0 4px',
                            borderRadius: '3px'
                        }
                    }}
                >
                    {content.text.split('\n').map((paragraph, i) => (
                        <React.Fragment key={i}>
                            {paragraph}
                            <br />
                        </React.Fragment>
                    ))}
                </Typography>
            </Paper>
            
            <Box sx={{ 
                mt: 3,
                p: 2,
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="body2" sx={{ color: '#0d47a1' }}>
                    Analysis generated on {new Date().toLocaleDateString()}
                </Typography>
            </Box>
        </Box>
    );
};

export default CompanyDimension;