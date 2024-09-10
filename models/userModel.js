const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');

const User = {
    create: (name, email, callback) => {
        const query = 'INSERT INTO users (name, email) VALUES (?,?)';
        db.run(query, [name, email], function (err) {
            callback(err, this ? this.lastID : null);
        });
    },

    findAll: (callback) => {
        const query = 'SELECT * FROM users';
        db.all(query, [], (err, rows) => {
            callback(err, rows);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.get(query, [id], (err, row) => {
            callback(err, row);
        });
    },

    update: (id, name, email, callback) => {
        const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
        db.run(query, [name, email, id], function (err) {
            callback(err);
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM users WHERE id = ?';
        db.run(query, [id], function (err) {
            callback(err);
        });
    }

}

module.exports = User;