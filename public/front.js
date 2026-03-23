// Подгружаем конфиг сервера
fetch('/config')
  .then(res => res.json())
  .then(async config => {
    const pbUrl = config.pbUrl;

    try {
      // Подключаемся к PocketBase
      const { default: PocketBase } = await import('pocketbase');
      const pb = new PocketBase(pbUrl);

      // Получаем все записи из коллекции grades
      const records = await pb.collection('grades').getFullList();

      if (!records.length) {
        document.getElementById('content').innerHTML = 'Нет записей для отображения.';
        return;
      }

      // Строим HTML-таблицу
      let table = '<table>';
      table += '<tr><th>Студент</th><th>Предмет</th><th>Оценка</th><th>Статус</th></tr>';

      records.forEach(r => {
        table += `<tr>
                    <td>${r.student_name}</td>
                    <td>${r.subject}</td>
                    <td>${r.score}</td>
                    <td>${r.status}</td>
                  </tr>`;
      });

      table += '</table>';
      document.getElementById('content').innerHTML = table;

    } catch (err) {
      console.error(err);
      document.getElementById('content').innerHTML = '';
      document.getElementById('error').innerText = 'Ошибка при загрузке данных: ' + err.message;
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('content').innerHTML = '';
    document.getElementById('error').innerText = 'Ошибка при получении конфигурации: ' + err.message;
  });
