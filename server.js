require('dotenv').config();
const express = require('express');
const path = require('path');
const PocketBase = require('pocketbase/cjs');
const app = express();

const PORT = process.env.PORT || 3000;
const PB_URL = process.env.PB_URL || 'http://localhost:8080';

// Логирование каждого запроса
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} посетил ${req.originalUrl}`);
  next();
});

// Статика фронтенда
app.use(express.static(path.join(__dirname, 'public')));

// API для конфигурации фронтенда
app.get('/config', (req, res) => {
  res.json({ pbUrl: PB_URL });
});

// API для получения оценок студентов
app.get('/grades', async (req, res) => {
  const pb = new PocketBase(PB_URL);

  try {
    const grades = await pb.collection('grades').getFullList();
    res.json(grades);
  } catch (err) {
    console.error('Ошибка PocketBase:', err.message);
    res.status(500).json({ error: 'База данных временно недоступна. Попробуйте позже.' });
  }
});

// SPA fallback (Express 5 совместимый)
// Должен идти **после всех API маршрутов**
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
