import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/_assignmentList.scss'; // We will create this specific SCSS file

const AssignmentListPage = () => {
    // This state will hold the list of assignments
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch assignments when the component loads
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Fetch from your MongoDB backend
                const response = await fetch('http://localhost:5000/api/assignments');
                const data = await response.json();

                setAssignments(data);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching assignments:", error);
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    if (loading) return <div className="loading">Loading assignments...</div>;

    return (
        <div className="assignment-list-page">
            <h1 className="assignment-list-page__title">Available SQL Assignments</h1>

            <div className="assignment-list-page__grid">
                {assignments.map((assignment) => (
                    <div className="assignment-card" key={assignment._id}>
                        {/* We use BEM naming convention here: Block__Element--Modifier */}
                        <div className="assignment-card__header">
                            <h2 className="assignment-card__title">{assignment.title}</h2>
                            <span className={`assignment-card__difficulty assignment-card__difficulty--${assignment.difficulty.toLowerCase()}`}>
                                {assignment.difficulty}
                            </span>
                        </div>

                        <p className="assignment-card__desc">{assignment.description}</p>

                        <div className="assignment-card__footer">
                            <Link to={`/attempt/${assignment._id}`} className="btn btn--primary">
                                Attempt Assignment
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignmentListPage;
