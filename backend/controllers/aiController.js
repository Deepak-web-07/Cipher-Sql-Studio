const { GoogleGenerativeAI } = require("@google/generative-ai");

const getHint = async (req, res) => {
    const { question, userQuery } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required to generate a hint." });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API Key not found." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // This prompt ensures the AI gives a hint, NOT the full answer
        const prompt = `
            You are an SQL teacher. A student is trying to solve this question: "${question}".
            The student's current query is: "${userQuery || 'No query written yet'}".
            
            Give the student a small, helpful hint. Do NOT give them the direct SQL solution. 
            Keep it short and encouraging.
        `;

        const result = await model.generateContent(prompt);
        const hint = result.response.text();

        res.json({
            success: true,
            hint: hint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to generate hint: " + error.message
        });
    }
};

module.exports = {
    getHint
};
