const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        user_id INTEGER,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');

const User = {
    create: (name, email, callback) => {
        const query = 'INSERT INTO users (name, email) VALUES (?,?)';
        db.run(query, [name, email], function (err) {
            if (err) {
                return callback(err);
            }

            const auditQuery = 'INSERT INTO audit_logs (action, user_id, details) VALUES (?, ?, ?)';
            const details = `Nome: ${name}, Email: ${email}`;
            db.run(auditQuery, ['CREATE', this.lastID, details], (auditErr) => {
                if (auditErr) {
                    console.error(`Erro ao inserir log de auditoria: ${auditErr.message}`);
                }
            });

            callback(null, this.lastID);

        });
    },

    findAll: (callback) => {
        const query = 'SELECT * FROM users';
        db.all(query, [], (err, rows) => {
            if (err) {
                callback(err);

            }
            // Inserir log de auditoria no banco de dados
            if (rows) {
                const auditQuery = 'INSERT INTO audit_logs (action, user_id, details) VALUES (?, ?, ?)';
                const details = `Visualizou todos os usuários`;
                db.run(auditQuery, ['VIEW ALL', null, details], (auditErr) => {
                    if (auditErr) {
                        console.error(`Erro ao inserir log de auditoria: ${auditErr.message}`);
                    }
                });
            }
            callback(err, rows);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.get(query, [id], (err, row) => {

            if (err) {
                callback(err);

            }
            // Inserir log de auditoria no banco de dados
            if (row) {
                const auditQuery = 'INSERT INTO audit_logs (action, user_id, details) VALUES (?, ?, ?)';
                const details = `Visualizou usuário: Nome: ${row.name}, Email: ${row.email}`;
                db.run(auditQuery, ['VIEW', id, details], (auditErr) => {
                    if (auditErr) {
                        console.error(`Erro ao inserir log de auditoria: ${auditErr.message}`);
                    }
                });
            }

            callback(err, row);
        });
    },

    update: (id, name, email, callback) => {
        const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
        db.run(query, [name, email, id], function (err) {
            if (err) {
                callback(err);

            } else {
                // Inserir log de auditoria
                const auditQuery = 'INSERT INTO audit_logs (action, user_id, details) VALUES (?, ?, ?)';
                const details = `Nome alterado para: ${name}, Email alterado para: ${email}`;
                db.run(auditQuery, ['UPDATE', id, details]);
                callback(null);
            }
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM users WHERE id = ?';
        db.run(query, [id], function (err) {
            if (err) {
                callback(err);

            } else {
                // Inserir log de auditoria
                const auditQuery = 'INSERT INTO audit_logs (action, user_id, details) VALUES (?, ?, ?)';
                const details = `Usuario excluído: ${id}`;
                db.run(auditQuery, ['DELETE', id, details]);
                callback(null);
            }
        });
    }

}


module.exports = User;