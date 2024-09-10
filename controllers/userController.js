const User = require('../models/userModel');
const logger = require('../logger');

const userController = {
    createUser: (req, res) => {
        const { name, email } = req.body;
        if (!name || !email) {
            logger.warn(`Tentativa de criação de usuário sem nome ou email.`);
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }
        User.create(name, email, (err, userId) => {
            if (err) {
                logger.error(`Erro ao criar usuário: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            logger.info(`Usuário criado: ID ${userId}, Nome: ${name}, Email: ${email}`);
            res.status(201).json({ id: userId });
        });
    },

    getAllUsers: (req, res) => {
        User.findAll((err, users) => {
            if (err) {
                logger.error(`Erro ao buscar os usuários: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            logger.info(`Busca de todos os usuários`);
            res.json({ users });
        });
    },

    getUserById: (req, res) => {
        const { id } = req.params;
        User.findById(id, (err, user) => {
            if (err) {
                logger.error(`Erro ao buscar o usuário - ${id}: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                logger.warn(`Usuário - ${id} não encontrado!`);
                return res.status(404).json({ error: 'Usuário não encontrado!' });
            }
            logger.info(`Usuário ${id} encontrado com sucesso!`);
            res.json(user);
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;
        if (!name || !email) {
            logger.warn(`Tentativa de atualização de usuário sem nome ou email.`);
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }
        User.update(id, name, email, (err) => {
            if (err) {
                logger.error(`Erro ao atualizar o usuário - ${id}: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            logger.info(`Usuário ${id} atualizado com sucesso!`);
            res.json({ message: 'Usuário atualizado com sucesso!' });
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        User.delete(id, (err) => {
            if (err) {
                logger.error(`Erro ao excluir o usuário - ${id}: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            logger.info(`Usuário ${id} excluído com sucesso!`);
            res.json({ message: 'Usuário excluído com sucesso' });
        });
    }
}

module.exports = userController;
