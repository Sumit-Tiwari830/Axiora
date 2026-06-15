import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
} from "@mui/material";

const drawerWidth = 260;

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "transparent",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "0.8125rem",
        letterSpacing: "0.025em",
        padding: "14px 16px",
        whiteSpace: "nowrap",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "0.875rem",
        padding: "12px 16px",
        color: "#334155",
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#0f172a",
    boxShadow: "none",
    borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
    minHeight: 64,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        color: "rgba(255, 255, 255, 0.92)",
        background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "4px 0 24px rgba(15, 23, 42, 0.25)",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: 280,
        }),
        boxSizing: "border-box",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
            width: 4,
        },
        "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: 4,
        },
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.easeInOut,
                duration: 280,
            }),
            width: theme.spacing(8),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(10),
            },
        }),
    },
}));