// Проверяем наличие сессии при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        showMainScreen(JSON.parse(savedUser));
    }
});

// Эта функция вызывается виджетом Telegram
async function onTelegramAuth(user) {
    // 1. Показываем лоадер
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('loader').classList.remove('hidden');

    try {
        // 2. ОТПРАВКА НА БЭКЕНД ДЛЯ ПРОВЕРКИ (Задел на будущее)
        // Важно: Бэкенд должен проверить hash!
        /*
        const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const result = await response.json();
        */

        // Пока бэкенд не готов, просто симулируем успешный вход:
        localStorage.setItem('user', JSON.stringify(user));
        showMainScreen(user);

    } catch (error) {
        console.error('Auth error:', error);
        alert('Login failed');
        logout();
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

function showMainScreen(user) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');

    document.getElementById('user-name').innerText = user.first_name;

    if (user.photo_url) {
        const img = document.getElementById('user-photo');
        img.src = user.photo_url;
        img.classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('user');
    location.reload(); // Самый простой способ сбросить состояние SPA
}