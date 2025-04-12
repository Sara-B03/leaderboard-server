const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // allow cross-origin requests
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'leaderboard_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL!');
});

// 📥 Route to submit score
app.post('/submit', (req, res) => {
  const { name, score } = req.body;

  if (!name || score == null) {
      return res.status(400).json({ error: 'Missing player name or score' });
  }

  const sql = 'INSERT INTO scores (name, score) VALUES (?, ?)';
  db.query(sql, [name, score], (err, result) => {
      if (err) {
          console.error('❌ MySQL Insert Error:', err); // Log the actual error
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: result.insertId });
  });
});


// 📊 Route to get top scores
app.get('/leaderboard', (req, res) => {
    const sql = 'SELECT name, score FROM scores ORDER BY score DESC LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving leaderboard:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
