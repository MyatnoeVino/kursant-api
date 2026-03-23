require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const PB_URL = process.env.PB_URL || 'http://localhost:8080';

// Статика фронтенда
app.use(express.static(path.join(__dirname, 'public')));

// Роут для передачи конфигурации фронтенду
app.get('/config', (req, res) => {
  res.json({ pbUrl: PB_URL });
});

// SPA wildcard — ловим все маршруты
app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
