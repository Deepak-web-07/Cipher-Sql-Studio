const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const aiController = require('../controllers/aiController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

router.post('/execute-query', optionalAuth, queryController.executeQuery);

router.get('/attempts/:assignmentId', protect, queryController.getAttempts);

router.post('/get-hint', aiController.getHint);

// get dummy assignments
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

// get specific assignment
router.get('/assignments/:id', (req, res) => {
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
        ],
        sampleData: [
            { id: 1, first_name: 'John', last_name: 'Doe', age: 25 },
            { id: 2, first_name: 'Jane', last_name: 'Smith', age: 30 },
            { id: 3, first_name: 'Alice', last_name: 'Johnson', age: 22 }
        ]
    });
});

module.exports = router;
