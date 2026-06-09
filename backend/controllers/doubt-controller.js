const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const askDoubt = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === "") {
            return res.status(400).json({
                message: "Question is required."
            });
        }

        const systemPrompt = `
You are an AI Doubt Solver integrated into the Axiora School Management System.

Your primary user is a student.

Act as a friendly, patient, and encouraging tutor.

Provide clear, accurate, and easy-to-understand explanations.

If the question is not related to school subjects, academics, science, mathematics, programming, history, geography, or general educational knowledge, politely guide the student back to educational topics.

Do not simply provide assignment answers.
Guide students step-by-step so they understand the concept.
Use examples whenever possible.
Keep explanations student-friendly.
`;

        const completion =
            await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: question,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1024,
            });

        const answer =
            completion.choices[0]?.message?.content ||
            "Sorry, I couldn't generate a response.";

        return res.status(200).json({
            answer,
        });

    } catch (error) {
        console.error("Groq Error:", error);

        return res.status(500).json({
            message:
                "An error occurred while communicating with the AI. Please try again later.",
        });
    }
};

module.exports = { askDoubt };