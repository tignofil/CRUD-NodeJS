const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());


const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Conectado ao banco de dados SqLite.');
});

db.run('CREATE TABLE users (id INTEGER PRIMARY KEY  AUTOINCREMENT, name TEXT, email TEXT)', (err) => {
    if (err) {
        console.log(err.messasge);
    }

    console.log('Tabela "users" criada.');
});

// Rotas
app.get('/', (req, res) => {
    res.send('API CRUD com express e SQLite');
});

// POST
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?,?)';

    db.run(query, [name, email], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    })
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ users: rows });
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(row);
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?';

    db.run(query, [name, email, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updatedID: id });
    })
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ err: err.message });
        }
        res.json({ deleteID: id });
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});