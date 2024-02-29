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
app.get('/get_jewellery_items', (req, res) => {
    const sql = "SELECT * FROM jewellery_item";
    connection.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.post('/delete_jewellery_item', (req, res) => {
    const { jewellery_id } = req.body;

    const sql = 'DELETE FROM jewellery_item WHERE jewellery_id = ?';
    connection.query(sql, [jewellery_id], (err, data) => {
        if (err) {
            console.error('Error deleting jewellery item:', jewellery_id, err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Jewellery item deleted successfully:', data);
        res.json({ success: true });
    })
});
app.post('/add_jewellery_item', (req, res) => {
    const { descr, jewellery_id, item_name, stock, buy_cost, rent_cost, weight } = req.body;

    // You should perform validation on the received data before inserting it into the database

    const sql = 'INSERT INTO jewellery_item (descr, jewellery_id, item_name, stock, buy_cost, rent_cost, weight) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [descr, jewellery_id, item_name, stock, buy_cost, rent_cost, weight], (err, result) => {
        if (err) {
            console.error('Error adding jewellery item:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Jewellery item added successfully:', result);
        res.json({ success: true });
    });
});

app.get('/suppliers', (req, res) => {
    const sql = "SELECT * FROM supplier";
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