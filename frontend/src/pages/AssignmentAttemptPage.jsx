import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import '../styles/pages/_assignmentAttempt.scss';

const AssignmentAttemptPage = () => {
    // Get the assignment ID from the URL
    const { assignmentId } = useParams();

    // States for our editor, results, and AI hints
    const [query, setQuery] = useState('-- Write your SQL query here\nSELECT * FROM users;');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [hint, setHint] = useState('');
    const [loadingHint, setLoadingHint] = useState(false);

    const [assignmentDetails, setAssignmentDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    // Fetch the specific assignment details when the page loads
    React.useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}`);
                const data = await response.json();
                setAssignmentDetails(data);
                if (data.defaultQuery) setQuery(data.defaultQuery);
            } catch (error) {
                console.error("Failed to load assignment:", error);
            } finally {
                setLoadingDetails(false);
            }
        };
        fetchDetails();
    }, [assignmentId]);

    // Function to handle the "Execute Query" button click
    const handleExecute = async () => {
        setError(null);
        setResults(null); // Clear previous results

        try {
            const response = await fetch('http://localhost:5000/api/execute-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to connect to backend server. Make sure it is running on port 5000!");
        }
    };

    // Function to get a hint from Gemini
    const handleGetHint = async () => {
        setLoadingHint(true);
        setHint(''); // Clear previous hint

        try {
            const response = await fetch('http://localhost:5000/api/get-hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: assignmentDetails.question,
                    userQuery: query
                })
            });
            const data = await response.json();

            if (data.success) {
                setHint(data.hint);
            } else {
                setHint('Error getting hint: ' + data.error);
            }
        } catch (error) {
            setHint('Failed to connect to AI server. Check your internet connection or backend.');
        } finally {
            setLoadingHint(false);
        }
    };

    if (loadingDetails) return <div className="loading">Loading assignment details...</div>;
    if (!assignmentDetails) return <div className="error">Assignment not found.</div>;

    return (
        <div className="attempt-page">
            <Link to="/" className="attempt-page__back-link">← Back to Assignments</Link>

            <div className="attempt-page__layout">
                {/* Left side: Question and Schema */}
                <div className="attempt-page__left-panel">
                    <div className="question-box">
                        <h2 className="question-box__title">{assignmentDetails.title}</h2>
                        <p className="question-box__text">{assignmentDetails.question}</p>
                    </div>

                    <div className="schema-box">
                        <h3 className="schema-box__title">Schema Info</h3>
                        <p className="schema-box__table-name">Table: {assignmentDetails.tableName}</p>
                        <ul className="schema-box__columns">
                            {assignmentDetails.schemaDetails && assignmentDetails.schemaDetails.map((col, idx) => (
                                <li key={idx}>
                                    <span className="col-name">{col.column}</span>
                                    <span className="col-type">{col.type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right side: Editor, Actions, Results, API Hint */}
                <div className="attempt-page__right-panel">

                    {/* The Code Editor */}
                    <div className="editor-container">
                        <Editor
                            height="300px"
                            defaultLanguage="sql"
                            theme="vs-dark"
                            value={query}
                            onChange={(value) => setQuery(value)}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="action-bar">
                        <button className="btn btn--primary" onClick={handleExecute}>
                            Run Query
                        </button>
                        <button className="btn btn--secondary" onClick={handleGetHint} disabled={loadingHint}>
                            {loadingHint ? 'Asking AI...' : 'Get a Hint'}
                        </button>
                    </div>

                    {/* AI Hint Section */}
                    {hint && (
                        <div className="hint-box">
                            <strong>AI Hint:</strong> {hint}
                        </div>
                    )}

                    {/* Results or Errors displaying */}
                    <div className="results-panel">
                        <h3 className="results-panel__title">Results</h3>

                        {error && <div className="results-panel__error">{error}</div>}

                        {results && results.length > 0 && (
                            <div className="table-responsive">
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            {/* Get the headers automatically from the first object keys */}
                                            {Object.keys(results[0]).map((key) => (
                                                <th key={key}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((row, index) => (
                                            <tr key={index}>
                                                {Object.values(row).map((val, i) => (
                                                    <td key={i}>{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {results && results.length === 0 && <p>No rows returned.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentAttemptPage;
