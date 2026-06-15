import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Paper, Typography, TextField, Button,
    CircularProgress, Avatar, Divider, Chip,
} from '@mui/material';
import {
    AutoAwesome as AIIcon,
    Send as SendIcon,
    School as SchoolIcon,
    Psychology as PsychologyIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useSelector } from 'react-redux';

const suggestedTopics = [
    "Explain Newton's laws of motion",
    "What is photosynthesis?",
    "How does the water cycle work?",
    "Explain the Pythagorean theorem",
    "What are the key events of WW2?",
];

const StudentAskDoubt = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [asked, setAsked] = useState(false);
    const answerRef = useRef(null);

    useEffect(() => {
        if (answer && answerRef.current) {
            answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [answer]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError("");
        setAnswer("");
        setAsked(true);

        try {
            const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
            const res = await axios.post(`${baseUrl}/Student/AskDoubt`, { question });
            if (res.data?.answer) {
                setAnswer(res.data.answer);
            } else {
                setError("Received an unexpected response from the AI.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to communicate with AI. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestedTopic = (topic) => {
        setQuestion(topic);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }} className="animate-fadeInUp">
            {/* Header Banner */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "absolute", bottom: -50, right: 80, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            background: "rgba(255,255,255,0.15)",
                            border: "2px solid rgba(255,255,255,0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <AIIcon sx={{ fontSize: 32, color: "#c7d2fe" }} />
                    </Avatar>
                    <Box>
                        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", display: "block" }}>
                            Powered by AI
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="#fff">
                            AI Doubt Solver
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", mt: 0.3 }}>
                            Ask any school subject question and get a clear, detailed explanation.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Quick Topics */}
            <Paper sx={{ p: 2.5, borderRadius: "16px", mb: 3 }}>
                <Typography variant="body2" fontWeight={700} color="#64748b" mb={1.5} sx={{ letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem" }}>
                    💡 Quick Topics
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {suggestedTopics.map((topic) => (
                        <Chip
                            key={topic}
                            label={topic}
                            onClick={() => handleSuggestedTopic(topic)}
                            clickable
                            variant="outlined"
                            sx={{
                                borderColor: "rgba(79,70,229,0.3)",
                                color: "#4f46e5",
                                fontWeight: 500,
                                borderRadius: "10px",
                                "&:hover": {
                                    background: "rgba(79,70,229,0.06)",
                                    borderColor: "#4f46e5",
                                },
                            }}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Question Input */}
            <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "20px", mb: 3, boxShadow: "0 4px 24px rgba(79,70,229,0.08)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        <SchoolIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography fontWeight={700} color="#0f172a">
                        {currentUser?.name || "You"}
                    </Typography>
                </Box>

                <form onSubmit={handleAskQuestion}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Type your doubt or question here... e.g. 'Explain the difference between mitosis and meiosis in simple terms.'"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5" },
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || !question.trim()}
                            endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                            sx={{
                                px: 4,
                                py: 1.3,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: "0.95rem",
                                boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #3730a3, #5b21b6)",
                                    boxShadow: "0 6px 20px rgba(79,70,229,0.4)",
                                },
                            }}
                        >
                            {loading ? "Thinking..." : "Ask AI"}
                        </Button>
                    </Box>
                </form>
            </Paper>

            {/* Error */}
            {error && (
                <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Typography color="error" fontWeight={600}>
                        ⚠️ {error}
                    </Typography>
                </Paper>
            )}

            {/* Loading Skeleton */}
            {loading && (
                <Paper sx={{ p: 4, borderRadius: "20px", mb: 3, textAlign: "center" }}>
                    <CircularProgress sx={{ color: "#4f46e5", mb: 2 }} />
                    <Typography color="#64748b" fontWeight={500}>
                        AI Tutor is thinking...
                    </Typography>
                </Paper>
            )}

            {/* Answer */}
            {answer && !loading && (
                <Paper
                    ref={answerRef}
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        borderRadius: "20px",
                        boxShadow: "0 8px 32px rgba(79,70,229,0.10)",
                        border: "1px solid rgba(79,70,229,0.1)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
                            }}
                        >
                            <PsychologyIcon sx={{ fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography fontWeight={700} color="#0f172a">
                                AI Tutor
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                                Here's a detailed explanation for your question
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Box
                        sx={{
                            "& h1, & h2, & h3": { color: "#0f172a", fontWeight: 700 },
                            "& p": { color: "#334155", lineHeight: 1.8 },
                            "& code": {
                                background: "#f1f5f9",
                                borderRadius: "6px",
                                px: 0.8,
                                py: 0.2,
                                fontFamily: "monospace",
                                fontSize: "0.85em",
                            },
                            "& pre": {
                                background: "#1e293b",
                                borderRadius: "12px",
                                p: 2,
                                overflow: "auto",
                                "& code": { background: "none", color: "#e2e8f0" },
                            },
                            "& ul, & ol": { pl: 2.5, "& li": { mb: 0.5 } },
                            "& blockquote": {
                                borderLeft: "4px solid #4f46e5",
                                pl: 2,
                                ml: 0,
                                color: "#64748b",
                                fontStyle: "italic",
                            },
                        }}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {answer}
                        </ReactMarkdown>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default StudentAskDoubt;
