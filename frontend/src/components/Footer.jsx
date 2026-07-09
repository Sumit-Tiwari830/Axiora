import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                width: "100%",
                mt: "auto",
                py: 4,
                px: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                background: "#f8fafc",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            {/* Left Section: Brand & Creator */}
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    © {new Date().getFullYear()} Axiora. All rights reserved.
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Creator: <span style={{ fontWeight: 600, color: "#1e1b4b" }}>Sumit Tiwari</span>
                </Typography>
            </Box>

            {/* Middle Section: Privacy & Terms */}
            <Stack
                direction="row"
                spacing={2.5}
                justifyContent="center"
                sx={{ fontSize: "0.85rem" }}
            >
                <Link
                    href="#"
                    underline="hover"
                    color="text.secondary"
                    sx={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        "&:hover": { color: "#4f46e5" },
                    }}
                >
                    Terms of Service
                </Link>
                <Typography color="text.secondary" sx={{ opacity: 0.5 }}>|</Typography>
                <Link
                    href="#"
                    underline="hover"
                    color="text.secondary"
                    sx={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        "&:hover": { color: "#4f46e5" },
                    }}
                >
                    Privacy Policy
                </Link>
                <Typography color="text.secondary" sx={{ opacity: 0.5 }}>|</Typography>
                <Link
                    href="#"
                    underline="hover"
                    color="text.secondary"
                    sx={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        "&:hover": { color: "#4f46e5" },
                    }}
                >
                    Security
                </Link>
            </Stack>

            {/* Right Section: Contact Information */}
            <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Contact Info
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Phone: <Link href="tel:+919589045802" color="inherit" underline="hover">+91 9589045802</Link>
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    Email: <Link href="mailto:kiransumit2232@gmail.com" color="inherit" underline="hover">kiransumit2232@gmail.com</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
