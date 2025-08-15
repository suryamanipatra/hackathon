import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
    return (
        <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                    borderBottom: "3px solid #056682",
                    display: "inline-block",
                    mb: 5,
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
            >
                {features.map((feature, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: "0 0 calc(33.333% - 16px)", 
                        }}
                    >
                        <FeatureCard>
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
