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
function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
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
//Jewellery items
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
app.post('/update_jewellery_item', (req, res) => {
    const { descr, jewellery_id, item_name, stock, buy_cost, rent_cost, weight } = req.body;
    const sql = `
        UPDATE jewellery_item
        SET descr=?,item_name=?,stock=?,buy_cost=?,rent_cost=?,weight=?
        WHERE supplier_id = ?;
    `;
    connection.query(sql, [descr, item_name, stock, buy_cost, rent_cost, weight, jewellery_id], (err, result) => {
        if (err) {
            console.error('Error updating Jewellery details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Jewellery details updated successfully:', result);
        res.json({ success: true });
    });
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
//Supplier details
app.get('/get_suppliers', (req, res) => {
    const sql = "SELECT * FROM supplier";
    connection.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});
app.post('/add_supplier', (req, res) => {
    const { supplier_id, FName, LName, Contact_no } = req.body;
    const sql = 'INSERT INTO supplier (supplier_id,FName,LName,Contact_no) VALUES (?,?,?,?)';

    connection.query(sql, [supplier_id, FName, LName, Contact_no], (err, result) => {
        if (err) {
            console.error('Error adding supplier:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Supplier details added successfully:', result);
        res.json({ success: true });
    })
});
app.post('/update_supplier', (req, res) => {
    const { supplier_id, FName, LName, Contact_no } = req.body;
    const sql = `
        UPDATE supplier
        SET FName=?,LName=?,Contact_no=?
        WHERE supplier_id = ?;
    `;
    connection.query(sql, [FName, LName, Contact_no, supplier_id], (err, result) => {
        if (err) {
            console.error('Error updating supplier details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Supplier details updated successfully:', result);
        res.json({ success: true });
    });
});
app.post('/delete_supplier', (req, res) => {
    const { supplier_id } = req.body;
    const sql = 'DELETE FROM supplier WHERE supplier_id = ?';

    connection.query(sql, [supplier_id], (err, result) => {
        if (err) {
            console.error('Error deleting supplier:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
            // If no rows were affected, it means the supplier with the given ID was not found
            return res.status(404).json({ error: 'Supplier not found' });
        }

        console.log('Supplier deleted successfully:', result);
        res.json({ success: true });
    });
});
//Customer CRUD
// Add Customer
app.post('/add_customer', (req, res) => {
    const { cust_id, FName, LName, Contact, loyalty_points } = req.body;
    const sql = 'INSERT INTO customer (cust_id,FName, LName, Contact, loyalty_points) VALUES (?,?, ?, ?, ?)';

    connection.query(sql, [cust_id, FName, LName, Contact, loyalty_points], (err, result) => {
        if (err) {
            console.error('Error adding customer:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Customer details added successfully:', result);
        res.json({ success: true });
    });
});

// Delete Customer
app.delete('/delete_customer', (req, res) => {
    const { cust_id } = req.body;
    const sql = 'DELETE FROM customer WHERE cust_id = ?';

    connection.query(sql, [cust_id], (err, result) => {
        if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
            // If no rows were affected, it means the customer with the given ID was not found
            return res.status(404).json({ error: 'Customer not found' });
        }

        console.log('Customer deleted successfully:', result);
        res.json({ success: true });
    });
});
app.post('/update_customer', (req, res) => {
    const { cust_id, FName, LName, Contact, loyalty_points } = req.body;
    const sql = `
        UPDATE customer
        SET FName=?,LName=?,Contact=?,loyalty_points=?
        WHERE cust_id = ?;
    `;
    connection.query(sql, [FName, LName, Contact, loyalty_points, cust_id], (err, result) => {
        if (err) {
            console.error('Error updating customer details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Customer details updated successfully:', result);
        res.json({ success: true });
    });
});
// Get Customers
app.get('/get_customers', (req, res) => {
    const sql = 'SELECT * FROM customer';

    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Customers fetched successfully');
        res.json(rows);
    });
});

// Endpoint for adding an occasion
app.post('/add_occasion', (req, res) => {
    const { occasion_id, Name, discount_percent } = req.body;
    const sql = 'INSERT INTO occasion (occasion_id, Name, discount_percent) VALUES (?,?,?)';

    connection.query(sql, [occasion_id, Name, discount_percent], (err, result) => {
        if (err) {
            console.error('Error adding occasion:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Occasion details added successfully:', result);
        res.json({ success: true });
    });
});

app.post('/update_occasion', (req, res) => {
    const { occasion_id, Name, discount_percent } = req.body;

    const sql = `
        UPDATE occasion
        SET Name=?,discount_percent=?
        WHERE occasion_id = ?;
    `;

    connection.query(sql, [Name, discount_percent, occasion_id], (err, result) => {
        if (err) {
            console.error('Error updating occasion details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Occasion details updated successfully:', result);
        res.json({ success: true });
    });
});
// Endpoint for deleting an occasion
app.post('/delete_occasion', (req, res) => {
    const { occasion_id } = req.body;
    const sql = 'DELETE FROM occasion WHERE occasion_id = ?';

    connection.query(sql, [occasion_id], (err, result) => {
        if (err) {
            console.error('Error deleting occasion:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Occasion deleted successfully:', result);
        res.json({ success: true });
    });
});

// Endpoint for fetching occasion data
app.get('/get_occasions', (req, res) => {
    const sql = 'SELECT * FROM occasion';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching occasions:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});

// Endpoint for adding a buy record
app.post('/add_buy_details', async (req, res) => {
    const { buy_id, occasion_id, jewellery_id, customer_id, quantity, buy_date } = req.body;

    try {
        // Validate input if needed

        // Add the buy record to the buys table
        const addBuySql = 'INSERT INTO buys (buy_id, occasion_id, jewellery_id, customer_id, quantity, buy_date) VALUES (?, ?, ?, ?, ?, ?)';
        await executeQuery(addBuySql, [buy_id, occasion_id, jewellery_id, customer_id, quantity, buy_date]);

        // Update the stock in the jewellery_item table
        const updateStockSql = 'UPDATE jewellery_item SET stock = stock - ? WHERE jewellery_id = ?';
        await executeQuery(updateStockSql, [quantity, jewellery_id]);

        console.log('Buy record and stock updated successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding buy record:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint for deleting a buy record
app.post('/delete_buy_details', (req, res) => {
    const { buy_id } = req.body;
    const sql = 'DELETE FROM buys WHERE buy_id = ?';

    connection.query(sql, [buy_id], (err, result) => {
        if (err) {
            console.error('Error deleting buy record:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Buy record deleted successfully:', result);
        res.json({ success: true });
    });
});
app.post('/update_buy_details', (req, res) => {
    const { buy_id, occasion_id, jewellery_id, customer_id, quantity, buy_date } = req.body;

    // Assuming you have a table named 'rents' in your database
    const sql = `
        UPDATE buys
        SET occasion_id = ?, jewellery_id = ?, customer_id = ?, quantity = ?, buy_date = ?
        WHERE buy_id = ?;
    `;

    connection.query(sql, [occasion_id, jewellery_id, customer_id, quantity, buy_date, buy_id], (err, result) => {
        if (err) {
            console.error('Error updating buy details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Buy details updated successfully:', result);
        res.json({ success: true });
    });
});
// Endpoint for fetching buy records
app.get('/get_buy_details', (req, res) => {
    const sql = 'SELECT * FROM buys';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching buy records:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});


app.get('/rentdetails', (req, res) => {
    const sql = 'SELECT * FROM rents';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching rent details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});

// Endpoint to add rent details
app.post('/add_rent', async (req, res) => {
    const { rent_id, occasion_id, jewellery_id, customer_id, quantity, rent_date, return_date } = req.body;

    try {
        // Check if the rent_date is not null and return_date is null
        if (rent_date && !return_date) {
            // If conditions are met, update the stock in the jewellery_item table
            const updateStockQuery = 'UPDATE jewellery_item SET stock = stock - ? WHERE jewellery_id = ?';
            await executeQuery(updateStockQuery, [quantity, jewellery_id]);
        }

        // Insert the rent details into the rents table
        const insertRentQuery = 'INSERT INTO rents (rent_id, occasion_id, jewellery_id, customer_id, quantity, rent_date, return_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await executeQuery(insertRentQuery, [rent_id, occasion_id, jewellery_id, customer_id, quantity, rent_date, return_date]);

        console.log('Rent record added successfully:', result);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding rent record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/update_rent', (req, res) => {
    const { rent_id, occasion_id, jewellery_id, customer_id, quantity, rent_date, return_date } = req.body;

    // Assuming you have a table named 'rents' in your database
    const sql = `
        UPDATE rents 
        SET occasion_id = ?, jewellery_id = ?, customer_id = ?, quantity = ?, rent_date = ?, return_date = ?
        WHERE rent_id = ?;
    `;

    connection.query(sql, [occasion_id, jewellery_id, customer_id, quantity, rent_date, return_date, rent_id], (err, result) => {
        if (err) {
            console.error('Error updating rent details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Rent details updated successfully:', result);
        res.json({ success: true });
    });
});
// Endpoint to delete rent details
app.post('/delete_rent', (req, res) => {
    const { rent_id } = req.body;
    const sql = 'DELETE FROM rents WHERE rent_id = ?';

    connection.query(sql, [rent_id], (err, result) => {
        if (err) {
            console.error('Error deleting rent details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Rent details deleted successfully:', result);
        res.json({ success: true });
    });
});
//User registration
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


app.get('/get_loyalty_points/:customer_id', async (req, res) => {
    const { customer_id } = req.params;
    try {
        const query = 'SELECT loyalty_points FROM customer WHERE cust_id = ?';
        connection.query(query, [customer_id], (error, results) => {
            if (error) {
                console.error('Error fetching Loyalty Points:', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            //console.log(results[0].loyalty_points)
            if (results.length > 0) {
                res.json({ loyalty_points: results[0].loyalty_points });
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching Loyalty Points:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get_discount_per/:occasion_id', async (req, res) => {
    const { occasion_id } = req.params;
    try {
        const query = 'SELECT discount_percent FROM occasion WHERE occasion_id = ?';
        connection.query(query, [occasion_id], (error, results) => {
            if (error) {
                console.error('Error fetching Discount %:', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            //console.log(results[0].discount_percent)
            if (results.length > 0) {
                res.json({ discount: results[0].discount_percent });
            } else {
                res.status(404).json({ error: 'Occasion not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching Discount %:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(8081, () => {
    console.log("listening")
})