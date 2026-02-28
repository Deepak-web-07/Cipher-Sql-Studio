const pgPool = require('../config/postgresDb');
const Attempt = require('../models/Attempt');

// Controller to execute the SQL query written by the user
const executeQuery = async (req, res) => {
    const { query, assignmentId } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Please provide an SQL query." });
    }

    let status = 'success';
    let data = [];
    let rowCount = 0;
    let errorMessage = '';

    try {
        // Execute the query in PostgreSQL
        const result = await pgPool.query(query);
        data = result.rows;
        rowCount = result.rowCount;
    } catch (error) {
        status = 'error';
        errorMessage = error.message;
    }

    // Save the attempt if the user is authenticated and assignmentId is provided
    if (req.user && assignmentId) {
        try {
            await Attempt.create({
                userId: req.user._id,
                assignmentId,
                query,
                status
            });
        } catch (attemptError) {
            console.error("Failed to save attempt:", attemptError);
        }
    }

    if (status === 'error') {
        return res.status(500).json({
            success: false,
            error: errorMessage
        });
    }

    res.json({
        success: true,
        data,
        rowCount
    });
};

const getAttempts = async (req, res) => {
    const { assignmentId } = req.params;

    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    try {
        const attempts = await Attempt.find({ userId: req.user._id, assignmentId }).sort({ timestamp: -1 });
        res.json({ success: true, attempts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    executeQuery,
    getAttempts
};
