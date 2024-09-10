const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());

//Routes
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});