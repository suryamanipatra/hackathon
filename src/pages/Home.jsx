import React from 'react';
import { Box, TextField, InputAdornment, Grid, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Outlet, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AboutUs from './About';

const Home = () => {
    const navigate = useNavigate();
    const items = [
        "Finance", "Product", "Customer",
        "Market", "Leadership", "Supplier",
        "Brand", "Valuation", "News"
    ];

    const handleCardClick = (dimension) => {
        // For now, using a dummy company ID
        // In a real app, you might have a way to select a company first
        navigate(`/${dimension.toLowerCase()}/123`);
    };


    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Box
                sx={{
                    height: '60vh',
                    backgroundImage: 'url(hackathon-home-image.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        px: 2,
                        mb: 4
                    }}
                >
                    <p style={{
                        textAlign: 'center',
                        margin: '1rem 0',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        fontSize: '36px',
                        lineHeight: '120%',
                        letterSpacing: '0px',
                        color: 'white'
                    }}>
                        9D: AI-Powered Multi-Dimensional Company Intelligence
                    </p>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search..."
                        InputProps={{
                            sx: {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 1,
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>


            <Box sx={{ p: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    {items.map((item, index) => (
                        <Grid item xs={4} key={index}>
                            <Box
                                sx={{
                                    height: "150px",
                                    width: "300px",
                                    p: "1px",
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(90deg, #5793A4 25%, #056682 63%, #01161C 100%)",
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        backgroundColor: "#fff",
                                        position: "relative", cursor: "pointer",
                                        '&:hover': {
                                            boxShadow: 6, 
                                        }
                                    }}
                                    onClick={() => handleCardClick(item)}
                                >
                                    {/* Top-left icon */}
                                    <HomeIcon
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            left: 8,
                                            fontSize: 28,
                                            border: "1px solid #056682",
                                            borderRadius: "30%",
                                            color: "#056682",
                                        }}
                                    />

                                    {/* Center text */}
                                    <Typography variant="h6" component="div" align="center">
                                        {item}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <AboutUs />
        </Box>
    );
};

export default Home;