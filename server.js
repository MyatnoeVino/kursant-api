// server.js
const express = require('express');
const path = require('path');
const app = express();

// Порт из .env или 3000 по умолчанию
const PORT = parseInt(process.env.PORT, 10) || 3000;

// URL вашего PocketBase в Coolify
const PB_URL = 'http://pocketbase-fvz5oclyfmgiesbdipcfquzc:8080';

// Раздаём статические файлы (index.html, front.js, css и т.д.)
app.use(express.static(__dirname));

// Роут для передачи конфигурации фронтенду
app.get('/config', (req, res) => {
    res.json({ pbUrl: PB_URL });
});

// Wildcard роут: любой путь возвращает index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
