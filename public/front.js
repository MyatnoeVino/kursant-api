async function loadGrades() {
  const container = document.getElementById('content');

  try {
    const res = await fetch('/grades');
    if (!res.ok) throw new Error('Сеть недоступна');

    const grades = await res.json();
    if (!grades.length) {
      container.innerHTML = '<p>Оценки не найдены.</p>';
      return;
    }

    let html = '<table><tr><th>Студент</th><th>Предмет</th><th>Оценка</th><th>Статус</th></tr>';
    grades.forEach(g => {
      html += `<tr>
        <td>${g.student_name || '-'}</td>
        <td>${g.subject || '-'}</td>
        <td>${g.score || '-'}</td>
        <td>${g.status || '-'}</td>
      </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<p>Ошибка при загрузке данных: ${err.message}</p>`;
  }
}

loadGrades();
