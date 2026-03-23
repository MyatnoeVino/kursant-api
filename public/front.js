// Получаем конфигурацию с сервера
fetch('/config')
  .then(res => res.json())
  .then(config => {
    const pb = new PocketBase(config.pbUrl); // UMD версия создаёт глобальный PocketBase

    pb.collection('grades').getFullList()
      .then(grades => {
        if (!grades.length) {
          document.getElementById('content').innerText = 'Нет данных для отображения.';
          return;
        }

        // Создаём HTML таблицу
        let html = '<table><thead><tr>';
        html += '<th>Имя студента</th><th>Предмет</th><th>Оценка</th><th>Статус</th>';
        html += '</tr></thead><tbody>';

        grades.forEach(g => {
          html += `<tr>
            <td>${g.student_name || ''}</td>
            <td>${g.subject || ''}</td>
            <td>${g.score || ''}</td>
            <td>${g.status || ''}</td>
          </tr>`;
        });

        html += '</tbody></table>';
        document.getElementById('content').innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        document.getElementById('content').innerText = 'Ошибка при загрузке данных: ' + err.message;
      });
  })
  .catch(err => {
    console.error(err);
    document.getElementById('content').innerText = 'Ошибка при получении конфигурации: ' + err.message;
  });
