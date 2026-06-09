const { GoogleGenerativeAI } = require("@google/generative-ai");

const askDoubt = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required." });
        }

        // Initialize Gemini with the API key from environment variables
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Select the model, using gemini-flash-latest which is highly capable and fast
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // System prompt to define the friendly tutor persona
        const systemPrompt = `You are an AI Doubt Solver integrated into the Axiora School Management System. 
Your primary user is a student. 
Act as a friendly, patient, and encouraging tutor. 
Provide clear, accurate, and easy-to-understand explanations. 
If the question is not related to school subjects or general knowledge, gently remind the student to stay on topic.
Do not provide direct answers for assignments, but rather guide them to understand the concepts.`;

        // Combine the system prompt and the user's question
        const prompt = `${systemPrompt}\n\nStudent's Doubt:\n${question}\n\nAnswer:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ answer: responseText });
    } catch (error) {
        console.error("Error in askDoubt:", error);
        res.status(500).json({ message: "An error occurred while communicating with the AI. Please try again later." });
    }
};

module.exports = { askDoubt };
