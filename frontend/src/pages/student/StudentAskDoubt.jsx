import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Paper, Typography, TextField, Button,
    CircularProgress, Avatar, Divider, Chip, IconButton, Tooltip, Grid, Card
} from '@mui/material';
import {
    AutoAwesome as AIIcon,
    Send as SendIcon,
    School as SchoolIcon,
    Psychology as PsychologyIcon,
    AttachFile as AttachFileIcon,
    Close as CloseIcon,
    DeleteOutline as DeleteIcon,
    ChatBubbleOutline as ChatIcon,
    AddCircleOutline as AddIcon,
    InsertDriveFile as FileIcon
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
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Staged attachment details
    const [attachedFile, setAttachedFile] = useState(null); // { name, type, content, dataUrl }
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to the bottom of the chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const max_size_mb = 4;
        if (file.size > max_size_mb * 1024 * 1024) {
            setError(`File is too large. Please select a file smaller than ${max_size_mb}MB.`);
            return;
        }

        const reader = new FileReader();

        if (file.type.startsWith("image/")) {
            reader.onload = (event) => {
                setAttachedFile({
                    name: file.name,
                    type: "image",
                    dataUrl: event.target.result // Base64 data URL
                });
                setError("");
            };
            reader.readAsDataURL(file);
        } else if (
            file.type.startsWith("text/") || 
            file.name.endsWith(".js") || 
            file.name.endsWith(".jsx") || 
            file.name.endsWith(".py") || 
            file.name.endsWith(".cpp") || 
            file.name.endsWith(".java") || 
            file.name.endsWith(".html") || 
            file.name.endsWith(".css") || 
            file.name.endsWith(".json") || 
            file.name.endsWith(".csv")
        ) {
            reader.onload = (event) => {
                setAttachedFile({
                    name: file.name,
                    type: "text",
                    content: event.target.result // Text content
                });
                setError("");
            };
            reader.readAsText(file);
        } else {
            setError("Unsupported file format. Please attach an image or a text/code file.");
        }

        // Clear input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Remove staged file
    const handleRemoveFile = () => {
        setAttachedFile(null);
    };

    // Send message handler
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!question.trim() && !attachedFile) return;

        setLoading(true);
        setError("");

        let userContent;
        let filePreviewUrl = null;
        let fileDisplayName = null;
        let fileDisplayType = null;

        // Formulate message based on attachment
        if (attachedFile) {
            fileDisplayName = attachedFile.name;
            fileDisplayType = attachedFile.type;

            if (attachedFile.type === "image") {
                // Groq format for user messages with image
                userContent = [
                    { type: "text", text: question || "Identify and explain what is in the attached image." },
                    { type: "image_url", image_url: { url: attachedFile.dataUrl } }
                ];
                filePreviewUrl = attachedFile.dataUrl;
            } else {
                // Text file attachment: inject inside markdown block
                const fileExt = attachedFile.name.split('.').pop() || 'text';
                userContent = `[Attached File: ${attachedFile.name}]\n\`\`\`${fileExt}\n${attachedFile.content}\n\`\`\`\n\n${question}`;
            }
        } else {
            userContent = question;
        }

        const newUserMessage = {
            role: "user",
            content: userContent,
            displayQuestion: question,
            attachment: attachedFile ? {
                name: fileDisplayName,
                type: fileDisplayType,
                previewUrl: filePreviewUrl
            } : null
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setQuestion("");
        setAttachedFile(null);

        try {
            const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
            // Map messages to format expected by backend (removing temporary UI keys)
            const payloadMessages = updatedMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await axios.post(`${baseUrl}/Student/AskDoubt`, { messages: payloadMessages });
            
            if (res.data?.answer) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: res.data.answer
                }]);
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

    const handleClearChat = () => {
        setMessages([]);
        setError("");
        setAttachedFile(null);
    };

    const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || "S";

    // Animated Typing Indicator
    const BouncingDots = () => (
        <Box sx={{ display: "inline-flex", gap: 0.6, py: 1, px: 1, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#7c3aed",
                        animation: "bounce 1.4s infinite ease-in-out both",
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes bounce": {
                            "0%, 80%, 100%": { transform: "scale(0)" },
                            "40%": { transform: "scale(1)" }
                        }
                    }}
                />
            ))}
        </Box>
    );

    return (
        <Box sx={{ height: "calc(100vh - 100px)", display: "flex", gap: 3, p: { xs: 1, md: 3 } }}>
            
            {/* Sidebar Controls (Hidden on mobile) */}
            <Paper
                elevation={0}
                sx={{
                    width: 260,
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    p: 3,
                    borderRadius: "20px",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    bgcolor: "#fff"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Avatar sx={{ background: "linear-gradient(135deg, #1e1b4b, #4f46e5)", width: 36, height: 36 }}>
                        <AIIcon fontSize="small" />
                    </Avatar>
                    <Typography fontWeight={800} fontSize="1.1rem" color="#1e1b4b">
                        Doubt Solver
                    </Typography>
                </Box>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClearChat}
                    sx={{
                        py: 1.2,
                        borderRadius: "12px",
                        fontWeight: 700,
                        textTransform: "none",
                        color: "#7c3aed",
                        borderColor: "rgba(124, 58, 237, 0.3)",
                        "&:hover": {
                            borderColor: "#7c3aed",
                            background: "rgba(124, 58, 237, 0.04)"
                        }
                    }}
                >
                    New Session
                </Button>

                <Box sx={{ flexGrow: 1 }} />
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid rgba(226, 232, 240, 0.5)" }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 1, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        💡 Attachment Guide
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.8, lineHeight: 1.5 }}>
                        📸 <strong>Images:</strong> PNG/JPG under 4MB. Visual math, diagrams or notes.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                        📄 <strong>Code/Text:</strong> .txt, .js, .py, .java, etc. We read codes instantly.
                    </Typography>
                </Box>
            </Paper>

            {/* Main Chat Area */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    bgcolor: "#fff",
                    overflow: "hidden"
                }}
            >
                {/* Chat Header */}
                <Box sx={{ p: 2, px: 3, borderBottom: "1px solid rgba(226, 232, 240, 0.6)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", width: 36, height: 36 }}>
                            <PsychologyIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography fontWeight={700} fontSize="0.95rem" color="#0f172a">
                                AI Tutor Assistant
                            </Typography>
                            <Typography variant="caption" color="#10b981" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10b981" }} /> Active
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton size="small" onClick={handleClearChat} sx={{ display: { xs: "flex", md: "none" } }} title="Clear Chat">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Conversation Panel */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 4.5 }, bgcolor: "#fafbfc" }}>
                    {messages.length === 0 ? (
                        /* Welcome Panel */
                        <Box sx={{ maxWidth: 650, mx: "auto", py: { xs: 2, md: 6 } }}>
                            <Box sx={{ textAlign: "center", mb: 5 }}>
                                <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 2, background: "linear-gradient(135deg, #1e1b4b, #4f46e5)" }}>
                                    <AIIcon sx={{ fontSize: 32, color: "#fff" }} />
                                </Avatar>
                                <Typography variant="h4" fontWeight={900} color="#0f172a" gutterBottom sx={{ letterSpacing: "-0.02em" }}>
                                    How can I help you learn today?
                                </Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ maxWidth: 460, mx: "auto" }}>
                                    Ask anything about science, math, coding or history. Send images of problems or code files for quick feedback!
                                </Typography>
                            </Box>

                            <Typography variant="body2" fontWeight={700} color="#64748b" mb={2} sx={{ letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.72rem", textAlign: "center" }}>
                                💡 Suggested starting topics
                              </Typography>
                            <Grid container spacing={1.5}>
                                {suggestedTopics.map((topic) => (
                                    <Grid item xs={12} sm={6} key={topic}>
                                        <Card
                                            onClick={() => handleSuggestedTopic(topic)}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: "12px",
                                                border: "1.5px solid rgba(226, 232, 240, 0.8)",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    borderColor: "#7c3aed",
                                                    background: "rgba(124, 58, 237, 0.02)",
                                                    transform: "translateY(-1px)"
                                                },
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight={600} color="#475569" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <ChatIcon fontSize="small" sx={{ color: "#7c3aed", opacity: 0.8 }} /> {topic}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        /* Messages List */
                        <Box sx={{ maxWidth: 750, mx: "auto" }}>
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === "user";
                                return (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: "flex",
                                            flexDirection: isUser ? "row-reverse" : "row",
                                            alignItems: "flex-start",
                                            gap: 2,
                                            mb: 4
                                        }}
                                    >
                                        {/* Avatar */}
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                                background: isUser ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "linear-gradient(135deg, #1e293b, #475569)"
                                            }}
                                        >
                                            {isUser ? userInitial : <PsychologyIcon sx={{ fontSize: 20 }} />}
                                        </Avatar>

                                        {/* Message Bubble Container */}
                                        <Box sx={{ maxWidth: "calc(100% - 70px)", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                                            {/* File attachment preview inside user bubble */}
                                            {isUser && msg.attachment && (
                                                <Box sx={{ mb: 1 }}>
                                                    {msg.attachment.type === "image" ? (
                                                        <Box
                                                            component="img"
                                                            src={msg.attachment.previewUrl}
                                                            alt="Attachment"
                                                            sx={{
                                                                maxWidth: 240,
                                                                maxHeight: 180,
                                                                borderRadius: "14px",
                                                                border: "2px solid #fff",
                                                                boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                                                            }}
                                                        />
                                                    ) : (
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                px: 2,
                                                                py: 1,
                                                                borderRadius: "12px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                                background: "rgba(79, 70, 229, 0.08)",
                                                                border: "1.5px solid rgba(79, 70, 229, 0.2)"
                                                            }}
                                                        >
                                                            <FileIcon fontSize="small" sx={{ color: "#4f46e5" }} />
                                                            <Typography variant="caption" fontWeight={700} color="#4f46e5">
                                                                {msg.attachment.name}
                                                            </Typography>
                                                        </Paper>
                                                    )}
                                                </Box>
                                            )}

                                            {/* Main Bubble Text */}
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.2,
                                                    px: 2.5,
                                                    borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                                                    bgcolor: isUser ? "#4f46e5" : "#fff",
                                                    color: isUser ? "#fff" : "#1e293b",
                                                    boxShadow: isUser ? "0 4px 12px rgba(79,70,229,0.15)" : "0 4px 12px rgba(0,0,0,0.02)",
                                                    border: isUser ? "none" : "1px solid rgba(226, 232, 240, 0.6)",
                                                    fontSize: "0.93rem"
                                                }}
                                            >
                                                {isUser ? (
                                                    /* For user, render raw text or handle displayQuestion */
                                                    <Typography style={{ whiteSpace: "pre-wrap" }}>
                                                        {msg.displayQuestion || (typeof msg.content === "string" ? msg.content : (msg.content[0]?.text || ""))}
                                                    </Typography>
                                                ) : (
                                                    /* For assistant, render ReactMarkdown */
                                                    <Box
                                                        sx={{
                                                            "& h1, & h2, & h3": { color: "#0f172a", fontWeight: 700, mt: 1.5, mb: 1 },
                                                            "& p": { color: "#334155", lineHeight: 1.7, m: 0, mb: 1 },
                                                            "& code": {
                                                                background: "#f1f5f9",
                                                                borderRadius: "6px",
                                                                px: 0.8,
                                                                py: 0.2,
                                                                fontFamily: "monospace",
                                                                fontSize: "0.85em",
                                                                color: "#b91c1c"
                                                            },
                                                            "& pre": {
                                                                background: "#1e293b",
                                                                borderRadius: "12px",
                                                                p: 2,
                                                                my: 1.5,
                                                                overflow: "auto",
                                                                "& code": { background: "none", color: "#e2e8f0", p: 0 }
                                                            },
                                                            "& ul, & ol": { pl: 2.5, my: 1, "& li": { mb: 0.5 } },
                                                            "& blockquote": {
                                                                borderLeft: "4px solid #4f46e5",
                                                                pl: 2,
                                                                ml: 0,
                                                                color: "#64748b",
                                                                fontStyle: "italic"
                                                            }
                                                        }}
                                                    >
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm, remarkMath]}
                                                            rehypePlugins={[rehypeKatex]}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </Box>
                                                )}
                                            </Paper>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}

                    {/* Pending state */}
                    {loading && (
                        <Box sx={{ maxWidth: 750, mx: "auto", display: "flex", gap: 2, mb: 4 }}>
                            <Avatar sx={{ width: 36, height: 36, background: "linear-gradient(135deg, #1e293b, #475569)" }}>
                                <PsychologyIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2.5,
                                    borderRadius: "4px 20px 20px 20px",
                                    bgcolor: "#fff",
                                    border: "1px solid rgba(226, 232, 240, 0.6)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                                }}
                            >
                                <BouncingDots />
                            </Paper>
                        </Box>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Box sx={{ maxWidth: 750, mx: "auto", mb: 3 }}>
                            <Paper sx={{ p: 2, px: 3, borderRadius: "14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <Typography color="error" variant="body2" fontWeight={600}>
                                    ⚠️ {error}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                    <Box ref={messagesEndRef} />
                </Box>

                {/* Input Bar */}
                <Box sx={{ p: 2, px: 3, borderTop: "1px solid rgba(226, 232, 240, 0.6)", bgcolor: "#fff" }}>
                    
                    {/* Staged file display badge */}
                    {attachedFile && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                            <Chip
                                label={attachedFile.name}
                                onDelete={handleRemoveFile}
                                deleteIcon={<CloseIcon fontSize="small" />}
                                icon={attachedFile.type === "image" ? undefined : <FileIcon />}
                                avatar={attachedFile.type === "image" ? <Avatar src={attachedFile.dataUrl} /> : undefined}
                                sx={{
                                    bgcolor: "rgba(124, 58, 237, 0.08)",
                                    color: "#7c3aed",
                                    fontWeight: 700,
                                    p: 0.5,
                                    borderRadius: "10px",
                                    "& .MuiChip-deleteIcon": { color: "#7c3aed" }
                                }}
                            />
                        </Box>
                    )}

                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
                        
                        {/* Staging hidden input */}
                        <input
                            type="file"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,text/*,.js,.jsx,.py,.java,.cpp,.html,.css,.json,.csv"
                        />

                        <Tooltip title="Attach Image or Code File">
                            <IconButton
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                sx={{
                                    p: 1.5,
                                    color: "#7c3aed",
                                    background: "rgba(124, 58, 237, 0.05)",
                                    "&:hover": { background: "rgba(124, 58, 237, 0.12)" },
                                    borderRadius: "14px"
                                }}
                            >
                                <AttachFileIcon />
                            </IconButton>
                        </Tooltip>

                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder={attachedFile ? "Add a message or description..." : "Type your question or doubt here..."}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "16px",
                                    background: "#f8fafc",
                                    p: 1.5,
                                    py: 1.2
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || (!question.trim() && !attachedFile)}
                            sx={{
                                minWidth: 50,
                                width: 50,
                                height: 50,
                                borderRadius: "16px",
                                p: 0,
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #3730a3, #5b21b6)",
                                    boxShadow: "0 6px 18px rgba(79, 70, 229, 0.4)",
                                }
                            }}
                        >
                            <SendIcon sx={{ color: "#fff", fontSize: 20 }} />
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default StudentAskDoubt;
