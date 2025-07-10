const express = require('express');
const app = express();
app.use(express.json());

app.post('/user', (req, res) => res.status(200).send('User created'));
app.post('/customer', (req, res) => res.status(200).send('Customer created'));
app.post('/rapidsteptest', (req, res) => res.status(200).send('Saved'));
app.get('/riskscore/:email', (req, res) => res.status(200).json({ score: 1 }));

module.exports = app; 