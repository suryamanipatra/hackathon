
import React, { useEffect, useRef, useState } from 'react';
import {
    Box, TextField, InputAdornment, Grid, Paper, Typography, keyframes, Snackbar, Alert, CircularProgress, Autocomplete,
    List,
    ListItem,
    ListItemText,
    Popper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Config from '../config.js'
import { Outlet, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AboutUs from './About';
import { motion, useAnimation, useInView } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;


const Home = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [openSuggestions, setOpenSuggestions] = useState(false);
    const anchorRef = useRef(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const ws = useRef(null);
    const [dimensionStatus, setDimensionStatus] = useState({});
    const [company, setCompany] = useState('');


    const items = [
        "GeoPresence",
        "Valuation",
        "Leadership",
        "News",
        "Customers",
        "ESG",
        "ProjectsAndServices",
        "Finance",
        "Brand"
    ];

    useEffect(() => {
        const initialStatus = {};
        items.forEach(item => {
            initialStatus[item] = {
                loading: false,
                completed: false
            };
        });
        setDimensionStatus(initialStatus);
    }, []);

    useEffect(() => {
        if (company && Object.keys(dimensionStatus).length > 0) {
            localStorage.setItem('companyAnalysisData', JSON.stringify({
                company,
                status: dimensionStatus
            }));
        }
    }, [company, dimensionStatus]);
    useEffect(() => {
        if (!company) return;

        const socket = new WebSocket(`${Config.wsURL}`);
        ws.current = socket;

        const initializeStatus = () => {
            const newStatus = {};
            items.forEach(item => {
                newStatus[item.toLowerCase()] = {
                    loading: true,
                    completed: false
                };
            });
            console.log("WebSocket connection established", newStatus);
            setDimensionStatus(newStatus);
        };

        socket.onopen = () => {
            console.log('WebSocket connected');
            initializeStatus();
        };

        socket.onmessage = (event) => {
            const message = event.data;
            console.log('WebSocket message:', message);

            setDimensionStatus(prevStatus => {
                const newStatus = { ...prevStatus };
                let updated = false;

                items.forEach(item => {
                    const dim = item;

                    if (message.includes(`${dim} analysis for ${company} completed`)) {
                        if (!newStatus[dim]?.completed) {
                            newStatus[dim] = {
                                loading: false,
                                completed: true
                            };
                            updated = true;
                        }
                    }
                    else if (message.includes(`${dim} analysis for ${company} in progress`)) {
                        if (!newStatus[dim]?.loading) {
                            newStatus[dim] = {
                                loading: true,
                                completed: false
                            };
                            updated = true;
                        }
                    }
                });

                return updated ? newStatus : prevStatus;
            });
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Connection error during analysis');
            setLoading(false);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');

            const allCompleted = items.every(item =>
                dimensionStatus[item.toLowerCase()]?.completed
            );

            if (allCompleted) {
                setSuccess(`Analysis completed for ${company}`);
                setLoading(false);
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [company]);

    useEffect(() => {
        const savedStatus = localStorage.getItem('companyAnalysisStatus');
        if (savedStatus) {
            setDimensionStatus(JSON.parse(savedStatus));
        }
    }, []);



    const handleCardClick = (dimension) => {
        if (!company) {
            setError("Please search for a company first");
            return;
        }

        const encodedCompany = encodeURIComponent(company);
        const encodedDimension = encodeURIComponent(dimension);

        console.log("Navigating to:", encodedDimension, encodedCompany);
        navigate(`/${encodedDimension}/${encodedCompany}`);
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            e.preventDefault();
            setLoading(true);
            setError(null);
            setSuccess(null);
            setOpenSuggestions(false);

            const newCompany = searchQuery.trim();
            setCompany(newCompany);

            const initialStatus = {};
            items.forEach(item => {
                initialStatus[item] = {
                    loading: true,
                    completed: false
                };
            });
            setDimensionStatus(initialStatus);

            try {
                const companyName = encodeURIComponent(newCompany);
                console.log("Starting analysis for:", companyName);
                const response = await fetch(`${Config.baseURL}start-tasks/${companyName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                setSuccess(`Analysis started for ${searchQuery}`);
            } catch (err) {
                setError(err.message || 'Failed to start analysis');
                setLoading(false);
            }
        }
    };


    const handleSuggestionClick = (companyName) => {
        setSearchQuery(companyName);
        setCompany(companyName);  
        setOpenSuggestions(false);
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    useEffect(() => {
    const savedData = localStorage.getItem('companyAnalysisData');
    if (savedData) {
        const { company: savedCompany, status: savedStatus } = JSON.parse(savedData);
        setCompany(savedCompany);
        setDimensionStatus(savedStatus);
        setSearchQuery(savedCompany);
        
        if (savedCompany) {
            const socket = new WebSocket(`${Config.wsURL}`);
            ws.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connected');
            };

        }
    } else {
        const initialStatus = {};
        items.forEach(item => {
            initialStatus[item] = {
                loading: false,
                completed: false
            };
        });
        setDimensionStatus(initialStatus);
    }
}, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery.trim().length > 2) {
            fetchSuggestions(debouncedQuery.trim());
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    // useEffect(() => {
    //     return () => {
    //         if (ws.current) {
    //             ws.current.close();
    //         }
    //     };
    // }, []);



    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`${Config.baseURL}companies?companyName=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }
            const data = await response.json();
            setSuggestions(data.data || []);
            setOpenSuggestions(data.data?.length > 0);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setSuggestions([]);
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        hidden: { rotate: 0, scale: 1 },
        visible: {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        },
        hover: {
            rotate: 360,
            scale: 1.2,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', overflowX: 'hidden' }}>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', bgcolor: '#6da96fff' }}>
                    {success}
                </Alert>
            </Snackbar>
            {/* Hero Section with Animated Gradient */}
            <Box
                sx={{
                    height: '60vh',
                    background: 'linear-gradient(-45deg, #21464f, #056682, #0a4857, #01161c)',
                    backgroundSize: '400% 400%',
                    animation: `${gradientBackground} 15s ease infinite`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url(hackathon-home-image.jpeg) center/cover no-repeat',
                        opacity: 0.15,
                        zIndex: 0
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        px: 2,
                        mb: 4,
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center'
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '3rem' },
                            lineHeight: '120%',
                            letterSpacing: '0px',
                            color: 'white',
                            mb: 3,
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        9D: AI-Powered Multi-Dimensional Company Intelligence
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            mb: 4,
                            fontWeight: 400
                        }}
                    >
                        Unlock comprehensive business insights across nine critical dimensions
                    </Typography>
                    <Box ref={anchorRef} sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search companies here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            onFocus={() => searchQuery.length > 2 && setOpenSuggestions(true)}
                            onBlur={() => setTimeout(() => setOpenSuggestions(false), 200)}
                            disabled={loading}
                            InputProps={{
                                sx: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: 2,
                                    height: 56,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 1)'
                                    }
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {loading ? (
                                            <Box sx={{ width: 24, height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <CircularProgress size={20} color="primary" />
                                            </Box>
                                        ) : (
                                            <SearchIcon color="primary" />
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            component={motion.div}
                            whileHover={{ scale: 1.01 }}
                            whileFocus={{ scale: 1.02 }}
                        />

                        <Popper
                            open={openSuggestions && suggestions.length > 0}
                            anchorEl={anchorRef.current}
                            placement="bottom-start"
                            sx={{
                                zIndex: 1300,
                                width: anchorRef.current?.clientWidth,
                                maxHeight: '300px',
                                overflow: 'auto'
                            }}
                        >
                            <Paper elevation={3} sx={{ width: '100%', mt: 1 }}>
                                <List>
                                    {suggestions.map((company, index) => (
                                        <ListItem
                                            key={company._id}
                                            button
                                            onClick={() => handleSuggestionClick(company.CompanyName)}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            <ListItemText primary={company.CompanyName} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Popper>
                    </Box>
                </Box>

                {/* Animated decorative elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: '10%',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        filter: 'blur(20px)'
                    }}
                    component={motion.div}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </Box>

            {/* Dimensions Grid Section */}
            <Box
                sx={{
                    p: 4,
                    background: 'linear-gradient(to bottom, #f9f9f9, #fff)'
                }}
                ref={ref}
            >
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        fontWeight: 'bold',
                        color: '#056682',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #5793A4, #056682)',
                            borderRadius: '2px'
                        }
                    }}
                >
                    Explore Dimensions
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {items.map((item, index) => {
                        const dim = item;
                        console.log("Dimension:", dim);
                        const status = dimensionStatus[dim] || { loading: false, completed: false };
                        console.log("Status:", status);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        height: "180px",
                                        width: "300px",
                                        p: "1px",
                                        borderRadius: "16px",
                                        background: "linear-gradient(90deg, #5793A4 25%, #056682 63%, #01161C 100%)",
                                        boxShadow: '0 10px 30px rgba(5, 102, 130, 0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 15px 35px rgba(5, 102, 130, 0.3)'
                                        }
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "15px",
                                            backgroundColor: "#fff",
                                            position: "relative",
                                            cursor: "pointer",
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: 'linear-gradient(90deg, #5793A4, #056682)'
                                            }
                                        }}
                                        onClick={() => handleCardClick(item)}
                                    >
                                        {/* Status indicator at top right */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 12,
                                                right: 12,
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {status.loading && (
                                                <CircularProgress size={24} color="primary" />
                                            )}

                                            {status.completed && (
                                                <CheckCircleIcon
                                                    fontSize="medium"
                                                    sx={{ color: '#4caf50' }}
                                                />
                                            )}
                                        </Box>

                                        {/* Animated icon with scroll and hover effects */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 12,
                                                left: 12,
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #5793A4, #056682)',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(5, 102, 130, 0.3)'
                                            }}
                                        >
                                            <HomeIcon fontSize="medium" />
                                        </Box>

                                        {/* Center text with animation */}
                                        <Typography
                                            variant="h5"
                                            component="div"
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                background: 'linear-gradient(90deg, #056682, #01161C)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                px: 2
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>


            <AboutUs />
        </Box>
    );
};

export default Home;