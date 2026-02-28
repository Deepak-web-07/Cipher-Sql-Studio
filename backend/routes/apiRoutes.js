const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const aiController = require('../controllers/aiController');

// Route to execute SQL queries
router.post('/execute-query', queryController.executeQuery);

// Route to get a hint from AI
router.post('/get-hint', aiController.getHint);

// Route to get all assignments (dummy data for now)
router.get('/assignments', (req, res) => {
    res.json([
        {
            _id: 1,
            title: "Basic SELECT Query",
            description: "Write a query to select all users from the users table.",
            difficulty: "Easy"
        },
        {
            _id: 2,
            title: "Filter with WHERE clause",
            description: "Find all users who are over 18 years old.",
            difficulty: "Medium"
        }
    ]);
});

// Route to get a specific assignment by ID
router.get('/assignments/:id', (req, res) => {
    // For now, always return this dummy assignment for testing
    res.json({
        _id: req.params.id,
        title: "Basic SELECT Query",
        tableName: "users",
        defaultQuery: "SELECT * FROM users;",
        question: "Write a query to select all first names and last names from the 'users' table.",
        schemaDetails: [
            { column: 'id', type: 'integer' },
            { column: 'first_name', type: 'varchar' },
            { column: 'last_name', type: 'varchar' },
            { column: 'age', type: 'integer' }
        ]
    });
});

module.exports = router;
