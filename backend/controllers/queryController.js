const pgPool = require('../config/postgresDb');

// Controller to execute the SQL query written by the user
const executeQuery = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Please provide an SQL query." });
    }

    try {
        // Execute the query in PostgreSQL
        const result = await pgPool.query(query);

        // Return the rows found
        res.json({
            success: true,
            data: result.rows,
            rowCount: result.rowCount
        });

    } catch (error) {
        // If query fails (like a syntax error), send back the error message
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    executeQuery
};
