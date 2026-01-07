const chatIds = [100001, 100002, 100003, 100004];
const users = ["admin", "user_test", "manager", "guest_bot"];
const messagesBody = [
    "Привет! Как дела?",
    "Проект собран на Docker успешно.",
    "Кто-нибудь видел логи бэкенда?",
    "Нужно проверить пагинацию на фронте.",
    "PostgreSQL работает быстрее, чем я думал.",
    "Не забываем про Level 3 требования!",
    "Тестовое сообщение для проверки MongoDB.",
    "Встреча через 15 минут в основном канале.",
    "Все таблицы в базе созданы правильно.",
    "Проверка связи... 1, 2, 3."
];

const randomData = [];

for (let i = 0; i < 50; i++) {
    const randomChatId = chatIds[Math.floor(Math.random() * chatIds.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomText = messagesBody[Math.floor(Math.random() * messagesBody.length)];

    randomData.push({
        chatId: randomChatId
        telegramUserId: Math.floor(Math.random() * 9000000) + 1000000,
        text: `[${randomUser}]: ${randomText}`,
        createdAt: new Date(new Date().getTime() - (Math.random() * 1000000000))
    });
}

db.messages.insertMany(randomData);

db.messages.createIndex({ chatId: 1 });

print("--- MongoDB Initialization Complete: 50 messages added ---");