const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); 

const app = express();
app.use(cors());  

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pettshop'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// CRUD APIs untuk Services
app.get('/services', (req, res) => {
    console.log('GET /services called');
    let sql = 'SELECT * FROM services';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            throw err;
        }
        console.log('Results:', results);
        res.send(results);
    });
});

app.post('/services', (req, res) => {
    let data = req.body;
    let sql = 'INSERT INTO services SET ?';
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Service added...');
    });
});

app.put('/services/:id', (req, res) => {
    let data = req.body;
    let sql = `UPDATE services SET ? WHERE id = ${req.params.id}`;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Service updated...');
    });
});

app.delete('/services/:id', (req, res) => {
    let sql = `DELETE FROM services WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Service deleted...');
    });
});


//untuk fungsi login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT id, role FROM users WHERE username = ? AND password = ?`;

    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ error: "Terjadi kesalahan pada server" });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(401).json({ success: false, message: "Username atau password salah" });
        }
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
