const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('❌ Error creating table:', err.message);
            } else {
                console.log('✅ Users table ready');
            }
        });
    }
});

// Logging middleware to show communication flow
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log('\n🌐 FRONTEND → BACKEND COMMUNICATION');
    console.log(`📅 Time: ${timestamp}`);
    console.log(`📍 Method: ${req.method}`);
    console.log(`🔗 URL: ${req.url}`);
    console.log(`📦 Body:`, req.body);
    console.log('─'.repeat(50));
    next();
});

// API Routes

// GET /api/users - Retrieve all users
app.get('/api/users', (req, res) => {
    console.log('🔍 BACKEND → DATABASE: Querying all users');
    
    db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('❌ DATABASE ERROR:', err.message);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log(`✅ DATABASE → BACKEND: Found ${rows.length} users`);
            console.log('📊 Data:', rows);
            console.log('📤 BACKEND → FRONTEND: Sending user data');
            res.json({ success: true, users: rows });
        }
    });
});

// POST /api/users - Add a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        console.log('❌ VALIDATION ERROR: Missing name or email');
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    console.log('💾 BACKEND → DATABASE: Inserting new user');
    console.log(`👤 User data: ${name} (${email})`);
    
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
        if (err) {
            console.error('❌ DATABASE ERROR:', err.message);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log(`✅ DATABASE → BACKEND: User created with ID ${this.lastID}`);
            console.log('📤 BACKEND → FRONTEND: Sending success response');
            res.json({ 
                success: true, 
                message: 'User created successfully',
                userId: this.lastID 
            });
        }
    });
});

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`🗑️ BACKEND → DATABASE: Deleting user with ID ${userId}`);
    
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('❌ DATABASE ERROR:', err.message);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log(`✅ DATABASE → BACKEND: Deleted ${this.changes} user(s)`);
            console.log('📤 BACKEND → FRONTEND: Sending delete confirmation');
            res.json({ 
                success: true, 
                message: 'User deleted successfully',
                deletedCount: this.changes 
            });
        }
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 SERVER STARTED');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('🎯 Ready to demonstrate server-to-server communication!');
    console.log('\n' + '='.repeat(60));
    console.log('COMMUNICATION FLOW VISUALIZATION:');
    console.log('Frontend (Browser) ↔️ Backend (Express) ↔️ Database (SQLite)');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});
