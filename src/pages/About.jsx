import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion, useAnimation, useInView } from "framer-motion";

const features = [
    {
        title: "Data Aggregation",
        description:
            "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more.",
    },
    {
        title: "Agentic AI Processing",
        description:
            "Uses specialized AI agents powered by LangChain and LangGraph to analyze data across nine key dimensions.",
    },
    {
        title: "Data Enrichment",
        description:
            "Cleans, refines, and summarizes raw information into clear, actionable insights.",
    },
    {
        title: "Multi-Dimensional Insights",
        description:
            "Provides a complete view of any company—listed or unlisted—through nine dimensions of intelligence.",
    },
    {
        title: "Centralized Storage",
        description:
            "Stores processed data securely in MongoDB for quick retrieval and integration.",
    },
    {
        title: "Seamless Access",
        description:
            "Delivers insights through a responsive React.js dashboard connected via Python Fast APIs.",
    },
    {
        title: "Faster Decision-Making",
        description:
            "Transforms scattered data into a single, intelligent view to support informed, timely decisions.",
    },
];

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: "center",
    borderRadius: 8,
    boxShadow: "none",
    background: "transparent",
    minHeight: 180, 
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
}));

const AboutUs = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
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

    const cardHoverVariants = {
        hover: {
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <Box 
            sx={{ p: 6, textAlign: "center" }}
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
                               component={motion.div}
                               initial={{ opacity: 0 }}
                               animate={controls}
                               variants={{
                                   hidden: { opacity: 0, y: 20 },
                                   visible: { 
                                       opacity: 1, 
                                       y: 0,
                                       transition: { duration: 0.5 }
                                   }
                               }}
                           >
                               About Us
                           </Typography>

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    "& > :nth-last-child(1)": {
                        marginLeft: "auto",
                        marginRight: "auto",
                    },
                }}
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {features.map((feature, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: "0 0 calc(33.333% - 16px)", 
                        }}
                        component={motion.div}
                        variants={itemVariants}
                        whileHover="hover"
                    >
                        <FeatureCard
                            component={motion.div}
                            variants={cardHoverVariants}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: "2px solid #ccc",
                                    borderRadius: "30%",
                                    mx: "auto",
                                    mb: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                // component={motion.div}
                                variants={iconVariants}
                                // animate={controls}
                                whileHover="hover"
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </Box>

                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: "0.9rem",
                                }}
                            >
                                {feature.description}
                            </Typography>
                        </FeatureCard>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AboutUs;