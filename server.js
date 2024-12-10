const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config

// RDS Database Connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// API to Submit Feedback
app.post('/submit-feedback', (req, res) => {
    const {
        courseName,
        instructorName,
        rating,
        contentRelevant,
        materialsClear,
        instructorEffective,
        instructorEngagement,
        liked,
        improvement,
    } = req.body;

    const query = `
        INSERT INTO course_feedback 
        (course_name, instructor_name, rating, content_relevant, materials_clear, instructor_effective, instructor_engagement, liked, improvement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        courseName, instructorName, rating, contentRelevant, materialsClear, instructorEffective, instructorEngagement, liked, improvement
    ], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving feedback');
        } else {
            res.send('Feedback submitted successfully');
        }
    });
});

// Fallback for non-API routes to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
