fetch('/config')
  .then(res => res.json())
  .then(config => {
    console.log('PocketBase URL:', config.pbUrl);

    // Пример использования PocketBase через официальный SDK
    import('pocketbase').then(({ default: PocketBase }) => {
      const pb = new PocketBase(config.pbUrl);

      // Проверка подключения
      pb.collection('users').getList(1, 10).then(result => {
        document.getElementById('content').innerText =
          `Найдено пользователей: ${result.items.length}`;
      }).catch(err => {
        document.getElementById('content').innerText =
          `Ошибка подключения к PocketBase: ${err.message}`;
      });
    });
  });
