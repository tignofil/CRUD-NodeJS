const User = require('../models/userModel');

const userController = {
    createUser: (req, res) => {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        User.create(name, email, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: userId });
        });
    },

    getAllUsers: (req, res) => {
        User.findAll((err, users) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ users });
        });
    },

    getUserById: (req, res) => {
        const { id } = req.params;
        User.findById(id, (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        User.update(id, name, email, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User updated successfully' });
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        User.delete(id, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User deleted successfully' });
        });
    }
}

module.exports = userController;
