let tg = window.Telegram.WebApp;
let userBalance = 0;
let userId = null;

// Инициализация
function init() {
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Получаем user_id из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('user_id');
    
    // Загружаем баланс пользователя (здесь должна быть интеграция с бэкендом)
    loadUserBalance();
}

// Загрузка баланса пользователя
function loadUserBalance() {
    // В реальном приложении здесь должен быть запрос к вашему бэкенду
    // Для демонстрации используем фиктивный баланс
    userBalance = 100;
    updateBalanceDisplay();
}

// Обновление отображения баланса
function updateBalanceDisplay() {
    document.getElementById('balance').textContent = userBalance;
}

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Вращение рулетки
function spinRoulette() {
    if (userBalance < 50) {
        alert('Недостаточно звезд для спина!');
        return;
    }
    
    const spinButton = document.getElementById('spinButton');
    const rouletteWheel = document.getElementById('rouletteWheel');
    
    spinButton.disabled = true;
    
    // Анимация вращения
    rouletteWheel.classList.add('spinning');
    
    // Определяем выигрышный предмет на основе вероятностей
    const items = [
        { name: "Мишка", value: 15, chance: 70 },
        { name: "Сердечко", value: 15, chance: 70 },
        { name: "Ракета", value: 50, chance: 20 },
        { name: "Торт", value: 50, chance: 20 },
        { name: "Кубок", value: 100, chance: 10 },
        { name: "Кольцо", value: 100, chance: 10 }
    ];
    
    const winner = getRandomItem(items);
    
    setTimeout(() => {
        rouletteWheel.classList.remove('spinning');
        spinButton.disabled = false;
        
        // Обновляем баланс
        userBalance -= 50;
        updateBalanceDisplay();
        
        // Показываем результат
        alert(`🎉 Поздравляем! Вы выиграли: ${winner.name} (${winner.value}⭐)`);
        
        // Отправляем данные в бот
        sendDataToBot({
            action: 'spin_result',
            user_id: userId,
            item: winner,
            cost: 50
        });
        
    }, 3000);
}

// Ежедневный бонус
function openDailyBonus() {
    const bonusBox = document.getElementById('bonusBox');
    const bonusResult = document.getElementById('bonusResult');
    
    bonusBox.style.display = 'none';
    
    const bonuses = [
        { stars: 5, chance: 70 },
        { stars: 10, chance: 15 },
        { stars: 25, chance: 10 },
        { stars: 50, chance: 5 }
    ];
    
    const bonus = getRandomItem(bonuses);
    
    bonusResult.textContent = `🎁 Вы получили: ${bonus.stars}⭐`;
    bonusResult.classList.add('pulse');
    
    // Обновляем баланс
    userBalance += bonus.stars;
    updateBalanceDisplay();
    
    // Отправляем данные в бот
    sendDataToBot({
        action: 'daily_bonus',
        user_id: userId,
        stars: bonus.stars
    });
}

// Покупка звезд
function contactAdmin(amount) {
    const message = `Хочу купить ${amount} звезд для Ghost FluX Casino. Мой ID: ${userId}`;
    const url = `https://t.me/KXKXKXKXKXKXKXKXKXKXK?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Показать канал
function showChannel() {
    window.open('https://t.me/Ghost_FluX', '_blank');
}

// Вспомогательная функция для получения случайного предмета с учетом вероятностей
function getRandomItem(items) {
    const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
    let random = Math.random() * totalChance;
    
    for (const item of items) {
        random -= item.chance;
        if (random <= 0) {
            return item;
        }
    }
    
    return items[items.length - 1];
}

// Отправка данных в бот
function sendDataToBot(data) {
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);