const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab',
});
app.get('/', (req, res) => {
    res.json("hello");
});
app.get('/signIn', (req, res) => {
    const sql = "SELECT * FROM users";
    connection.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.post('/register', (req, res) => {
    const { name, id, email, password } = req.body;

    // You should perform validation on the received data before inserting it into the database

    const sql = 'INSERT INTO users (name, id, email, password) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, id, email, password], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('User registered successfully:', result);
        res.json({ success: true });
    });
});

app.listen(8081, () => {
    console.log("listening")
})