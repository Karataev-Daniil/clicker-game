document.addEventListener('DOMContentLoaded', function() {
    let gameTimer;
    let incomeTimer;
    let countdownTimers = {};
    let elapsedTime = 0;
    let passiveIncomeRate = 0;
    let totalCoins = 0;
    let totalBTH = 0;
    let bthMiningRate = 0;
    let bthMiningInterval = 300;
    let speedBoostMultiplier = 1;
    let coinsPerClick = 1;
    let lastUpdateTimestamp = localStorage.getItem('lastUpdateTimestamp') || Date.now();
    let elapsedGameTime = 0; // Время в игре
    let baseMultiplier = 1;
    let bonusSpeedMultiplier = 1;
    let activeSpeedBonuses = [];

    function showPopup(message, missingType = null) {
        const popup = document.getElementById('popup-message');
        const popupText = document.getElementById('popup-text');
        if (popup && popupText) {
            popupText.innerHTML = message;
            if (missingType) {
                popupText.classList.add(missingType);
            }
            popup.style.display = 'block';
        }
    }

    function closePopup() {
        const popup = document.getElementById('popup-message');
        const popupText = document.getElementById('popup-text');
        if (popup) {
            popup.style.display = 'none';
            popupText.classList.remove('missing-coins', 'missing-bth');
        }
    }

    document.getElementById('popup-close').onclick = closePopup;

    function updateTimer() {
        elapsedTime += (1 * speedBoostMultiplier / 100);
        elapsedGameTime += (1 * speedBoostMultiplier / 100);
        
        if (Math.floor(elapsedGameTime) >= 86400) {
            elapsedTime = 0;
        }
        
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = Math.floor(elapsedTime % 60);
        document.getElementById('timer').innerText =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
        update365DaysCountdown();
    
        if (bthMiningRate > 0 && Math.floor(elapsedTime) % bthMiningInterval === 0) {
            mineBTH();
        }
    
        rotatePlanet();
        updateIncomeDisplay();
    }

    function earnPassiveIncome() {
        const totalMultiplier = baseMultiplier + activeSpeedBonuses.reduce((sum, bonus) => sum + bonus.multiplier, 0);
        totalCoins += passiveIncomeRate * totalMultiplier;
        document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
    }

    function updateIncomeDisplay() {
        document.getElementById('income').innerText = `Доход: ${passiveIncomeRate}`;
        document.getElementById('bth-income').innerText = `Доход bth: ${bthMiningRate} / 5 мин`;
    }

    function mineBTH() {
        totalBTH += bthMiningRate;
        updateBTHDisplay();
    }

    function rotatePlanet() {
        const rotationDegree = (elapsedTime / 86400) * 360;
        document.getElementById('planet').style.transform = `rotate(${rotationDegree}deg)`;
    }

    function updateCoinsBasedOnRealTime() {
        const currentTime = Date.now();
        const timeDifference = Math.floor((currentTime - lastUpdateTimestamp) / 1000);

        if (timeDifference > 0) {
            const earnedCoins = timeDifference * passiveIncomeRate;
            totalCoins += earnedCoins;
            lastUpdateTimestamp = currentTime;
            localStorage.setItem('lastUpdateTimestamp', lastUpdateTimestamp);
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
        }
    }

    function startIncomeTimer() {
        incomeTimer = setInterval(() => {
            if (passiveIncomeRate > 0) {
                earnPassiveIncome();
            }
        }, 1000);
    }

    function startGameTimer() {
        clearInterval(gameTimer);
        gameTimer = setInterval(() => {
            updateTimer();
        }, 10);
    }

    function startGame() {
        startIncomeTimer();
        startGameTimer();
    }

    startGame();

    document.getElementById('earn').onclick = () => {
        totalCoins += coinsPerClick;
        document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
    };

    const tabButtons = document.querySelectorAll('.tab-button');
    const upgradeSections = document.querySelectorAll('.upgrade-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Скрыть все секции улучшений
            upgradeSections.forEach(section => {
                section.style.display = 'none';
            });

            // Показать выбранную секцию
            const activeSection = document.getElementById(targetTab);
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    });

    document.getElementById('upgrade-income').onclick = () => {
        let costElement = document.getElementById('upgrade-income');
        let cost = parseInt(costElement.querySelector('.price').innerText.replace('$', ''));
        if (totalCoins >= cost) {
            totalCoins -= cost;
            coinsPerClick += 1;
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
            document.getElementById('earn').innerText = `Заработать ${coinsPerClick} доллар(ов)`;
            
            // Увеличиваем цену на 5%
            cost = Math.ceil(cost * 1.05);
            costElement.querySelector('.price').innerText = `$${cost}`;
        } else {
            showPopup('Недостаточно монет для улучшения дохода от нажатий!', 'missing-coins');
        }
    };

    document.getElementById('upgrade-passive-income').onclick = () => {
        let costElement = document.getElementById('upgrade-passive-income');
        let cost = parseInt(costElement.querySelector('.price').innerText.replace('$', ''));
        if (totalCoins >= cost) {
            totalCoins -= cost;
            passiveIncomeRate += 1;
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
            
            // Увеличиваем цену на 5%
            cost = Math.ceil(cost * 1.05);
            costElement.querySelector('.price').innerText = `$${cost}`;
        } else {
            showPopup('Недостаточно монет для улучшения пассивного дохода!', 'missing-coins');
        }
    };

    document.getElementById('upgrade-bth').onclick = () => {
        let costElement = document.getElementById('upgrade-bth');
        let cost = parseInt(costElement.querySelector('.price').innerText.replace('$', ''));
        if (totalCoins >= cost) {
            totalCoins -= cost;
            bthMiningRate += 1;
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
            
            // Увеличиваем цену на 5%
            cost = Math.ceil(cost * 1.05);
            costElement.querySelector('.price').innerText = `$${cost}`;
        } else {
            showPopup('Недостаточно монет для улучшения добычи bth!', 'missing-coins');
        }
    };

    document.querySelectorAll('.speed-btn').forEach(button => {
        button.onclick = () => {
            let cost = parseInt(button.querySelector('.price').innerText.replace('$', ''));
            if (totalCoins >= cost) {
                totalCoins -= cost;
                speedBoostMultiplier += parseInt(button.getAttribute('data-speed'));
                document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
                document.getElementById('base-multiplier').innerText = `x${speedBoostMultiplier}`;
                
                // Увеличиваем цену на 5%
                cost = Math.ceil(cost * 1.05);
                button.querySelector('.price').innerText = `$${cost}`;
            } else {
                showPopup('Недостаточно монет для улучшения скорости!', 'missing-coins');
            }
        };
    });

    document.getElementById('activate-bonus').onclick = () => {
        if (totalBTH >= 1) {
            totalBTH -= 1; 
            bonusSpeedMultiplier = 50; 
            speedBoostMultiplier += bonusSpeedMultiplier;
            const bonusId = activeSpeedBonuses.length;
            activeSpeedBonuses.push({ multiplier: bonusSpeedMultiplier, duration: 300, remainingTime: 300 }); 
            document.getElementById('bth-balance').innerText = `Баланс bth: ${totalBTH}`;

            clearInterval(countdownTimers[bonusId]); 
            countdownTimers[bonusId] = setInterval(() => {
                activeSpeedBonuses[bonusId].remainingTime--; 
                updateBonusList(bonusId); 

                if (activeSpeedBonuses[bonusId].remainingTime <= 0) {
                    clearInterval(countdownTimers[bonusId]);
                    speedBoostMultiplier -= bonusSpeedMultiplier; 
                    activeSpeedBonuses.pop(); 
                    alert('Бонус ускорения времени закончился!');
                    updateBonusList(); 
                }
            }, 1000);

            updateBonusList(bonusId); 
        } else {
            showPopup('Недостаточно bth для активации бонуса!', 'missing-bth');
        }
    };
    
    function updateBonusList(bonusId = null) {
        const bonusList = document.getElementById('bonus-list');
        bonusList.innerHTML = ''; 
    
        activeSpeedBonuses.forEach((bonus, index) => {
            const remainingTime = bonus.remainingTime;
            const listItem = document.createElement('div');
            listItem.classList.add('bonus-item');
            
            listItem.innerHTML = `
                <span>Бонус: x${bonus.multiplier}</span>
                <span>Осталось: ${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}</span>
            `;
            
            bonusList.appendChild(listItem);
        });
    
        if (activeSpeedBonuses.length === 0) {
            bonusList.innerText = 'Нет активных бонусов';
        }
    }

    
    function update365DaysCountdown() {
        // Преобразуем игровое время в дни
        const daysElapsed = Math.floor(elapsedGameTime / (24 * 60 * 60));
        const remainingDays = 365 - daysElapsed;

        document.getElementById('countdown-365').innerText = 
            `Осталось времени: ${remainingDays} дн.`;

        if (remainingDays <= 0) {
            // Сбросить таймер, если прошло 365 дней
            alert('365 дней прошло! Время для нового цикла.');
            elapsedGameTime = 0; // Сбрасываем игровое время
        }
    }
    



    const starField = document.querySelector('.background-stars'); // Измените здесь
    const colors = ['#ffcc00', '#ff6699', '#3399ff', '#66ccff', '#cc99ff'];

    function createStar() {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.borderRadius = '50%';
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.opacity = Math.random(); 
        star.style.width = `${Math.random() * 2 + 1}px`; 
        star.style.height = star.style.width; 

        // Позиция звезды
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;

        // Анимация звезды
        const animationDuration = Math.random() * 1 + 0.5; 
        star.style.animation = `twinkle ${animationDuration}s infinite alternate`;

        starField.appendChild(star);
    }

    // Создание множества звезд
    for (let i = 0; i < 200; i++) {
        createStar();
    }

    // CSS для анимации
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes twinkle {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
});
