import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Stack,
    Divider
} from '@mui/material';
import { Lightbulb as LightbulbIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
const StudentAskDoubt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError("");
        setAnswer("");

        try {
            const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
            const res = await axios.post(`${baseUrl}/Student/AskDoubt`, { question });
            
            if (res.data && res.data.answer) {
                setAnswer(res.data.answer);
            } else {
                setError("Received an unexpected response from the AI.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to communicate with AI. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LightbulbIcon sx={{ color: '#7c3aed', mr: 2, fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                        AI Doubt Solver
                    </Typography>
                </Box>
                
                <Typography color="text.secondary" mb={4}>
                    Stuck on a topic? Ask our AI Tutor! It's designed to be friendly, patient, and provide clear explanations to help you understand your school subjects better.
                </Typography>

                <form onSubmit={handleAskQuestion}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 3 }}
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading || !question.trim()}
                        sx={{
                            mb: 4,
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                            "&:hover": {
                                background: "linear-gradient(135deg,#1d4ed8,#6d28d9)",
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Ask AI"}
                    </Button>
                </form>

                {error && (
                    <Typography color="error" sx={{ mb: 3 }}>
                        {error}
                    </Typography>
                )}

                {answer && (
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                            AI Tutor's Answer:
                        </Typography>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                bgcolor: '#f8fafc', 
                                borderRadius: 2,
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'inherit',
                                lineHeight: 1.6
                            }}
                        >
                            <Typography variant="body1" component="div">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {answer}
                                </ReactMarkdown>
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default StudentAskDoubt;
