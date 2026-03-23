require('dotenv').config();
const express = require('express');
const PocketBase = require('pocketbase/cjs');

const app = express();
const pb = new PocketBase(process.env.PB_URL);

// Middleware: проверка пароля через query ?auth=
app.use((req, res, next) => {
  const auth = req.query.auth;
  if (auth !== process.env.PASSWORD) {
    return res.send('<h1>Доступ запрещен. Укажите правильный пароль через ?auth=ВАШ_ПАРОЛЬ</h1>');
  }
  next();
});

app.get('/', async (req, res) => {
  try {
    const records = await pb.collection('grades').getFullList({ sort: '-created' });

    let html = `<h1>Лист личных достижений курсанта</h1>`;
    html += `<table border="1" cellpadding="5" cellspacing="0">
              <tr>
                <th>Имя студента</th>
                <th>Предмет</th>
                <th>Оценка</th>
                <th>Статус</th>
              </tr>`;

    records.forEach(r => {
      html += `<tr>
                <td>${r.student_name}</td>
                <td>${r.subject}</td>
                <td>${r.score}</td>
                <td>${r.status}</td>
              </tr>`;
    });

    html += `</table>`;
    res.send(html);

    // Логирование посещений с IP
    console.log(`[${new Date().toLocaleString()}] Посещение: ${req.ip}`);
  } catch (err) {
    console.error('Ошибка при подключении к PB:', err.message);
    res.send('<h1>Ошибка: база данных недоступна. Попробуйте позже.</h1>');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});