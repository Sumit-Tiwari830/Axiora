import { createTheme, alpha } from "@mui/material/styles";

// ═══════════════════════════════════════════════════════════════
//  AXIORA — Custom MUI Theme
//  A premium, professional school management design system
// ═══════════════════════════════════════════════════════════════

const BRAND = {
    primary:    "#4f46e5",   // Indigo 600
    primaryDk:  "#3730a3",   // Indigo 800
    primaryLt:  "#818cf8",   // Indigo 400
    secondary:  "#7c3aed",   // Violet 600
    secondaryDk:"#5b21b6",   // Violet 800
    secondaryLt:"#a78bfa",   // Violet 400
    accent:     "#06b6d4",   // Cyan 500
    success:    "#10b981",   // Emerald 500
    warning:    "#f59e0b",   // Amber 500
    error:      "#ef4444",   // Red 500
    info:       "#3b82f6",   // Blue 500
};

const NEUTRAL = {
    50:  "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
};

const RADIUS = {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
};

const SHADOWS = {
    card:    `0 1px 3px ${alpha("#0f172a", 0.04)}, 0 4px 16px ${alpha("#0f172a", 0.06)}`,
    cardHover: `0 4px 12px ${alpha("#0f172a", 0.06)}, 0 12px 40px ${alpha("#4f46e5", 0.10)}`,
    elevated: `0 8px 32px ${alpha("#0f172a", 0.08)}, 0 2px 8px ${alpha("#0f172a", 0.04)}`,
    modal:   `0 24px 80px ${alpha("#0f172a", 0.16)}`,
    glow:    `0 0 20px ${alpha("#4f46e5", 0.25)}`,
};

const theme = createTheme({
    palette: {
        primary: {
            main: BRAND.primary,
            dark: BRAND.primaryDk,
            light: BRAND.primaryLt,
            contrastText: "#ffffff",
        },
        secondary: {
            main: BRAND.secondary,
            dark: BRAND.secondaryDk,
            light: BRAND.secondaryLt,
            contrastText: "#ffffff",
        },
        success: {
            main: BRAND.success,
            contrastText: "#ffffff",
        },
        warning: {
            main: BRAND.warning,
            contrastText: "#ffffff",
        },
        error: {
            main: BRAND.error,
            contrastText: "#ffffff",
        },
        info: {
            main: BRAND.info,
            contrastText: "#ffffff",
        },
        background: {
            default: "#f0f2f8",
            paper: "#ffffff",
        },
        text: {
            primary: NEUTRAL[900],
            secondary: NEUTRAL[500],
            disabled: NEUTRAL[400],
        },
        divider: NEUTRAL[200],
        neutral: NEUTRAL,
        brand: BRAND,
    },

    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: { fontWeight: 800, fontSize: "2.5rem", lineHeight: 1.2, letterSpacing: "-0.02em", color: NEUTRAL[900] },
        h2: { fontWeight: 700, fontSize: "2rem",   lineHeight: 1.25, letterSpacing: "-0.015em", color: NEUTRAL[900] },
        h3: { fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.3, letterSpacing: "-0.01em",  color: NEUTRAL[900] },
        h4: { fontWeight: 700, fontSize: "1.25rem",lineHeight: 1.35, color: NEUTRAL[900] },
        h5: { fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.4, color: NEUTRAL[800] },
        h6: { fontWeight: 600, fontSize: "1rem",   lineHeight: 1.4, color: NEUTRAL[700] },
        subtitle1: { fontWeight: 500, fontSize: "0.95rem", color: NEUTRAL[600] },
        subtitle2: { fontWeight: 500, fontSize: "0.85rem", color: NEUTRAL[500] },
        body1: { fontSize: "0.9375rem", lineHeight: 1.6, color: NEUTRAL[700] },
        body2: { fontSize: "0.875rem",  lineHeight: 1.55, color: NEUTRAL[600] },
        button: { fontWeight: 600, fontSize: "0.875rem", textTransform: "none", letterSpacing: "0.01em" },
        caption: { fontSize: "0.75rem", color: NEUTRAL[500] },
        overline: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NEUTRAL[400] },
    },

    shape: {
        borderRadius: RADIUS.md,
    },

    shadows: [
        "none",
        SHADOWS.card,
        SHADOWS.card,
        SHADOWS.card,
        SHADOWS.elevated,
        SHADOWS.elevated,
        SHADOWS.elevated,
        SHADOWS.elevated,
        SHADOWS.cardHover,
        SHADOWS.cardHover,
        SHADOWS.cardHover,
        SHADOWS.cardHover,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
        SHADOWS.modal,
    ],

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f0f2f8",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                },
            },
        },

        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.lg,
                    border: `1px solid ${NEUTRAL[200]}`,
                    backgroundImage: "none",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
                },
                elevation1: { boxShadow: SHADOWS.card },
                elevation2: { boxShadow: SHADOWS.card },
                elevation3: { boxShadow: SHADOWS.elevated },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.sm,
                    padding: "8px 20px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-1px)",
                    },
                },
                contained: {
                    boxShadow: `0 1px 3px ${alpha(BRAND.primary, 0.3)}`,
                    "&:hover": {
                        boxShadow: `0 4px 14px ${alpha(BRAND.primary, 0.35)}`,
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${BRAND.primaryDk}, ${BRAND.secondaryDk})`,
                    },
                },
                outlined: {
                    borderWidth: "1.5px",
                    "&:hover": {
                        borderWidth: "1.5px",
                        backgroundColor: alpha(BRAND.primary, 0.04),
                    },
                },
                text: {
                    "&:hover": {
                        backgroundColor: alpha(BRAND.primary, 0.06),
                    },
                },
                sizeSmall: {
                    padding: "5px 14px",
                    fontSize: "0.8125rem",
                },
                sizeLarge: {
                    padding: "12px 28px",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    borderRadius: RADIUS.md,
                },
            },
        },

        MuiTextField: {
            defaultProps: { variant: "outlined", size: "medium" },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: RADIUS.sm,
                        backgroundColor: NEUTRAL[50],
                        transition: "all 0.2s ease",
                        "& fieldset": {
                            borderColor: NEUTRAL[200],
                            borderWidth: "1.5px",
                            transition: "border-color 0.2s ease",
                        },
                        "&:hover fieldset": {
                            borderColor: NEUTRAL[300],
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: BRAND.primary,
                            borderWidth: "2px",
                            boxShadow: `0 0 0 3px ${alpha(BRAND.primary, 0.10)}`,
                        },
                        "&.Mui-focused": {
                            backgroundColor: "#ffffff",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        fontWeight: 500,
                        color: NEUTRAL[500],
                        "&.Mui-focused": {
                            color: BRAND.primary,
                            fontWeight: 600,
                        },
                    },
                },
            },
        },

        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.md,
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        background: `linear-gradient(135deg, ${NEUTRAL[800]}, ${NEUTRAL[900]})`,
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        padding: "14px 16px",
                        borderBottom: "none",
                        whiteSpace: "nowrap",
                        "&:first-of-type": {
                            borderRadius: `${RADIUS.md}px 0 0 0`,
                        },
                        "&:last-of-type": {
                            borderRadius: `0 ${RADIUS.md}px 0 0`,
                        },
                    },
                },
            },
        },

        MuiTableBody: {
            styleOverrides: {
                root: {
                    "& .MuiTableRow-root": {
                        transition: "all 0.15s ease",
                        "&:nth-of-type(odd)": {
                            backgroundColor: alpha(BRAND.primary, 0.015),
                        },
                        "&:hover": {
                            backgroundColor: alpha(BRAND.primary, 0.05),
                            transform: "scale(1.002)",
                        },
                        "& .MuiTableCell-body": {
                            padding: "12px 16px",
                            fontSize: "0.875rem",
                            color: NEUTRAL[700],
                            borderBottom: `1px solid ${NEUTRAL[100]}`,
                        },
                    },
                },
            },
        },

        MuiTablePagination: {
            styleOverrides: {
                root: {
                    borderTop: `1px solid ${NEUTRAL[200]}`,
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "0.8125rem",
                        color: NEUTRAL[500],
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    borderRadius: RADIUS.xs,
                },
                colorPrimary: {
                    backgroundColor: alpha(BRAND.primary, 0.10),
                    color: BRAND.primary,
                },
                colorSecondary: {
                    backgroundColor: alpha(BRAND.secondary, 0.10),
                    color: BRAND.secondary,
                },
                colorSuccess: {
                    backgroundColor: alpha(BRAND.success, 0.10),
                    color: BRAND.success,
                },
                colorError: {
                    backgroundColor: alpha(BRAND.error, 0.10),
                    color: BRAND.error,
                },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: RADIUS.xl,
                    boxShadow: SHADOWS.modal,
                    border: `1px solid ${NEUTRAL[200]}`,
                },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    padding: "24px 28px 8px",
                },
            },
        },

        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: "16px 28px",
                },
            },
        },

        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: "12px 28px 24px",
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border: "none",
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: `0 1px 3px ${alpha("#0f172a", 0.06)}`,
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.sm,
                    margin: "2px 8px",
                    padding: "10px 16px",
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                        backgroundColor: alpha("#ffffff", 0.15),
                        "&:hover": {
                            backgroundColor: alpha("#ffffff", 0.20),
                        },
                        "& .MuiListItemIcon-root": {
                            color: "#ffffff",
                        },
                    },
                    "&:hover": {
                        backgroundColor: alpha("#ffffff", 0.08),
                    },
                },
            },
        },

        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 40,
                    color: alpha("#ffffff", 0.7),
                },
            },
        },

        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontWeight: 500,
                    fontSize: "0.875rem",
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: "all 0.2s ease",
                    "&:hover": {
                        backgroundColor: alpha(BRAND.primary, 0.08),
                        transform: "scale(1.05)",
                    },
                },
            },
        },

        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    fontSize: "0.875rem",
                },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: NEUTRAL[800],
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    borderRadius: RADIUS.xs,
                    padding: "6px 12px",
                    boxShadow: SHADOWS.elevated,
                },
                arrow: {
                    color: NEUTRAL[800],
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.sm,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                },
                standardSuccess: {
                    backgroundColor: alpha(BRAND.success, 0.08),
                    color: "#065f46",
                    border: `1px solid ${alpha(BRAND.success, 0.2)}`,
                },
                standardError: {
                    backgroundColor: alpha(BRAND.error, 0.08),
                    color: "#991b1b",
                    border: `1px solid ${alpha(BRAND.error, 0.2)}`,
                },
                standardWarning: {
                    backgroundColor: alpha(BRAND.warning, 0.08),
                    color: "#92400e",
                    border: `1px solid ${alpha(BRAND.warning, 0.2)}`,
                },
                standardInfo: {
                    backgroundColor: alpha(BRAND.info, 0.08),
                    color: "#1e40af",
                    border: `1px solid ${alpha(BRAND.info, 0.2)}`,
                },
            },
        },

        MuiSnackbar: {
            defaultProps: {
                anchorOrigin: { vertical: "top", horizontal: "right" },
            },
        },

        MuiSpeedDial: {
            styleOverrides: {
                fab: {
                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                    boxShadow: `0 4px 16px ${alpha(BRAND.primary, 0.4)}`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${BRAND.primaryDk}, ${BRAND.secondaryDk})`,
                        boxShadow: `0 6px 24px ${alpha(BRAND.primary, 0.5)}`,
                    },
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: NEUTRAL[200],
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.sm,
                },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: RADIUS.md,
                    boxShadow: SHADOWS.elevated,
                    border: `1px solid ${NEUTRAL[200]}`,
                    marginTop: 4,
                },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.xs,
                    margin: "2px 6px",
                    padding: "8px 14px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.15s ease",
                    "&:hover": {
                        backgroundColor: alpha(BRAND.primary, 0.06),
                    },
                    "&.Mui-selected": {
                        backgroundColor: alpha(BRAND.primary, 0.08),
                        "&:hover": {
                            backgroundColor: alpha(BRAND.primary, 0.12),
                        },
                    },
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    minWidth: 80,
                },
            },
        },

        MuiCircularProgress: {
            styleOverrides: {
                colorPrimary: {
                    color: BRAND.primary,
                },
            },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 100,
                    height: 6,
                    backgroundColor: NEUTRAL[200],
                },
                barColorPrimary: {
                    borderRadius: 100,
                    background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.secondary})`,
                },
            },
        },

        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: NEUTRAL[300],
                    "&.Mui-checked": {
                        color: BRAND.primary,
                    },
                },
            },
        },

        MuiRadio: {
            styleOverrides: {
                root: {
                    color: NEUTRAL[300],
                    "&.Mui-checked": {
                        color: BRAND.primary,
                    },
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    "&.Mui-checked": {
                        color: BRAND.primary,
                        "& + .MuiSwitch-track": {
                            backgroundColor: BRAND.primaryLt,
                        },
                    },
                },
            },
        },

        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: NEUTRAL[700],
                },
            },
        },

        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                },
            },
        },

        MuiBreadcrumbs: {
            styleOverrides: {
                root: {
                    fontSize: "0.8125rem",
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: RADIUS.lg,
                    boxShadow: SHADOWS.card,
                    border: `1px solid ${NEUTRAL[200]}`,
                    transition: "all 0.25s ease",
                    "&:hover": {
                        boxShadow: SHADOWS.cardHover,
                        transform: "translateY(-2px)",
                    },
                },
            },
        },
    },
});

export default theme;
export { BRAND, NEUTRAL, RADIUS, SHADOWS };
