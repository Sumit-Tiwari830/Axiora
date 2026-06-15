import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    Avatar,
    InputAdornment,
    Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    PostAdd as SubmitIcon,
    History as HistoryIcon,
    EventNote as DateIcon,
    AnnouncementOutlined as ComplaintIcon,
    CheckCircleOutline as OpenIcon,
    Search as SearchIcon
} from "@mui/icons-material";

import Popup from "../../components/Popup";
import { addStuff } from "../../redux/userRelated/userHandle";
import { getAllComplains } from "../../redux/complainRelated/complainHandle";

const TeacherComplain = () => {
    const dispatch = useDispatch();

    const { status, currentUser, error } = useSelector(
        (state) => state.user
    );

    const { complainsList, loading: complainsLoading } = useSelector(
        (state) => state.complain
    );

    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [searchTerm, setSearchTerm] = useState("");

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const user = currentUser?._id;
    const school = currentUser?.school?._id || currentUser?.school;

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const address = "Complain";

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    // Load complains history
    useEffect(() => {
        if (school) {
            dispatch(getAllComplains(school, "Complain"));
        }
    }, [dispatch, school]);

    // Handle submission result
    useEffect(() => {
        if (status === "added") {
            setLoader(false);
            setComplaint("");
            setMessage("Complaint submitted successfully");
            setShowPopup(true);
            // Re-fetch complains list
            if (school) {
                dispatch(getAllComplains(school, "Complain"));
            }
        } else if (error) {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, error, dispatch, school]);

    // Filter complains to show only current teacher's complaints and search filter
    const myComplaints = complainsList
        ? complainsList.filter(item => {
            const isMine = item.user === user || item.user?._id === user;
            const matchesSearch = item.complaint.toLowerCase().includes(searchTerm.toLowerCase());
            return isMine && matchesSearch;
          })
        : [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header Title */}
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: "-0.02em" }}>
                Support & Feedback Hub
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Submit issue reports or feedback to school administration and track their status.
            </Typography>

            <Grid container spacing={4}>
                {/* Form Column */}
                <Grid item xs={12} lg={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: "24px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            background: "#fff"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Avatar sx={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", width: 44, height: 44 }}>
                                <SubmitIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Submit New Ticket
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Fill out details for your concern
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: "#475569" }}>
                                        Submission Date
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DateIcon sx={{ color: "#94a3b8" }} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: "#475569" }}>
                                        Details of Concern / Complaint
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        placeholder="Explain the issue clearly. Include any relevant context, class details, or students involved..."
                                        value={complaint}
                                        onChange={(e) => setComplaint(e.target.value)}
                                        required
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loader}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: "14px",
                                        fontWeight: 700,
                                        background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.25)",
                                        textTransform: "none",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                            boxShadow: "0 6px 20px rgba(239, 68, 68, 0.35)"
                                        }
                                    }}
                                >
                                    {loader ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Submit Ticket"
                                    )}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Grid>

                {/* History Column */}
                <Grid item xs={12} lg={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: "24px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            background: "#fff",
                            minHeight: 480
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", width: 44, height: 44 }}>
                                    <HistoryIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Ticket History
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Track your complaints & reports
                                    </Typography>
                                </Box>
                            </Box>

                            <TextField
                                size="small"
                                placeholder="Search past tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ width: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {complainsLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12 }}>
                                <CircularProgress size={40} sx={{ color: "#7c3aed" }} />
                            </Box>
                        ) : myComplaints.length === 0 ? (
                            <Box sx={{ py: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <ComplaintIcon sx={{ fontSize: 54, color: "#cbd5e1", mb: 2 }} />
                                <Typography fontWeight={600} color="#64748b" variant="body1">No tickets found</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 280, mt: 0.5 }}>
                                    If you have submitted tickets before, make sure they match your search, or submit a new one on the left.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ maxHeight: 420, overflow: "auto", pr: 1 }}>
                                <Stack spacing={2.5}>
                                    {myComplaints.map((item, idx) => {
                                        const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        });
                                        return (
                                            <Card
                                                key={item._id || idx}
                                                elevation={0}
                                                sx={{
                                                    borderRadius: "16px",
                                                    border: "1px solid rgba(226, 232, 240, 0.8)",
                                                    "&:hover": { borderColor: "#7c3aed", boxShadow: "0 4px 15px rgba(124, 58, 237, 0.05)" },
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1.5 }}>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <OpenIcon fontSize="small" sx={{ color: "#22c55e" }} />
                                                            <Typography variant="subtitle2" fontWeight={700} color="#334155">
                                                                {formattedDate}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            label="Submitted"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: "rgba(16, 185, 129, 0.1)",
                                                                color: "#10b981",
                                                                fontWeight: 700,
                                                                fontSize: "0.72rem"
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        color="#475569"
                                                        sx={{
                                                            lineHeight: 1.7,
                                                            whiteSpace: "pre-wrap",
                                                            wordBreak: "break-word"
                                                        }}
                                                    >
                                                        {item.complaint}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </Box>
    );
};

export default TeacherComplain;