// server.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PB_URL = 'http://pocketbase-fvz5oclyfmgiesbdipcfquzc:8080';

// Статика фронтенда
app.use(express.static(__dirname));

// Роут для передачи конфигурации фронтенду
app.get('/config', (req, res) => {
    res.json({ pbUrl: PB_URL });
});

// Wildcard для фронтенда
// В Express 4 нужно просто '*', а не '/*'
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
