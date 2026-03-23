let pb;

// 🔐 функция входа
function login() {
  const pass = document.getElementById('password').value;

  if (pass !== '1234') {
    document.getElementById('auth-error').innerText = 'Неверный пароль';
    return;
  }

  document.getElementById('auth').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  loadData();
}

// загрузка данных
function loadData() {
  fetch('/config')
    .then(res => res.json())
    .then(config => {
      pb = new PocketBase(config.pbUrl);

      loadTable();

      // ⚡ REAL-TIME обновление
      pb.collection('grades').subscribe('*', function () {
        console.log('Обновление данных!');
        loadTable();
      });

    })
    .catch(err => {
      document.getElementById('content').innerHTML =
        `<div class="error">Ошибка конфигурации: ${err.message}</div>`;
    });
}

// отрисовка таблицы
function loadTable() {
  pb.collection('grades').getFullList()
    .then(grades => {

      if (!grades.length) {
        document.getElementById('content').innerHTML =
          '<div class="error">Нет данных</div>';
        return;
      }

      let html = `
        <table>
          <thead>
            <tr>
              <th>Студент</th>
              <th>Предмет</th>
              <th>Оценка</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
      `;

      grades.forEach(g => {

        let statusClass = '';
        let statusText = g.status || '';

        if (statusText === 'Arvestatud') statusClass = 'done';
        else if (statusText === 'Tegemisel') statusClass = 'progress';
        else if (statusText === 'Järelvastamine') statusClass = 'fail';

        html += `
          <tr>
            <td>${g.student_name}</td>
            <td>${g.subject}</td>
            <td><strong>${g.score}</strong></td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
          </tr>
        `;
      });

      html += '</tbody></table>';

      document.getElementById('content').innerHTML = html;

    })
    .catch(err => {
      document.getElementById('content').innerHTML =
        `<div class="error">Ошибка: ${err.message}</div>`;
    });
}
