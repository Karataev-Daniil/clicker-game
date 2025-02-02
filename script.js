document.addEventListener('DOMContentLoaded', function() {
    let gameTimer;
    let incomeTimer;
    let countdownTimers = {};
    let elapsedTime = 0;
    let passiveSpeedMultiplier = 1;
    let passiveCoins = 0;
    let totalCoins = 1000;
    let passiveBTH = 0;
    let totalBTH = 10;
    let bthMiningInterval = 300;
    let speedBoostMultiplier = 1;
    let coinsPerClick = 1;
    let lastUpdateTimestamp = localStorage.getItem('lastUpdateTimestamp') || Date.now();
    let elapsedGameTime = 0;
    let baseMultiplier = 1;
    let bonusSpeedMultiplier = 1;
    let activeSpeedBonuses = [];
    let totalElapsedTime = 0;
    let dayStartTime = 0;
    let earthRotation = 0;

    function startGame() {
        document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
        document.getElementById('bth-balance').innerText = `Баланс bth: ${totalBTH}`;
        
        startIncomeTimer();
        startGameTimer();
    }

    startGame();

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
        totalElapsedTime += (1 * speedBoostMultiplier / 100);
        
        const daysElapsed = Math.floor(totalElapsedTime / 86400);
        const elapsedTimeToday = totalElapsedTime % 86400;
        
        const hours = Math.floor(elapsedTimeToday / 3600);
        const minutes = Math.floor((elapsedTimeToday % 3600) / 60);
        const seconds = Math.floor(elapsedTimeToday % 60);
        
        document.getElementById('timer').innerText =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const remainingDays = 365 - daysElapsed;
        document.getElementById('countdown-365').innerText = `Осталось дней: ${remainingDays}`;

        earthRotation += 360 / 86400;
        
        if (earthRotation >= 360) {
            earthRotation = 0;
        }
        
        update365DaysCountdown();
        rotatePlanet();
        updateIncomeDisplay();
    }
    
    function update365DaysCountdown() {
        const daysElapsed = Math.floor(totalElapsedTime / (24 * 60 * 60));
        const remainingDays = 365 - daysElapsed;
    
        document.getElementById('countdown-365').innerText = 
            `Осталось времени: ${remainingDays} дн.`;
    
        if (remainingDays <= 0) {
            alert('365 дней прошло! Время для нового цикла.');
            totalElapsedTime = 0;
        }
    }
    
    function earnPassiveIncome() {
        const totalMultiplier = baseMultiplier;
        totalCoins += passiveCoins * totalMultiplier;
        document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
    }
    
    function updateIncomeDisplay() {
        document.getElementById('income').innerText = `Доход: ${passiveCoins}`;
        document.getElementById('bth-income').innerText = `Доход bth: ${passiveBTH} / 5 мин`;
    }

    function rotatePlanet() {
        const earth = document.getElementById('planet');
        earth.style.transform = `rotate(${earthRotation}deg)`;
    }

    function startIncomeTimer() {
        incomeTimer = setInterval(() => {
            if (passiveCoins > 0) {
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

    document.getElementById('earn').onclick = () => {
        totalCoins += coinsPerClick;
        document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
    };

    const tabButtons = document.querySelectorAll('.tab-button');
    const upgradeSections = document.querySelectorAll('.upgrade-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            upgradeSections.forEach(section => {
                section.style.display = 'none';
            });

            const activeSection = document.getElementById(targetTab);
            if (activeSection) {
                activeSection.style.display = 'flex';
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
            passiveCoins += 1;
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
            
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
            passiveBTH += 1;
            document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
            
            cost = Math.ceil(cost * 1.05);
            costElement.querySelector('.price').innerText = `$${cost}`;
        } else {
            showPopup('Недостаточно монет для улучшения добычи bth!', 'missing-coins');
        }
    };

    function updateBaseMultiplier() {
        document.getElementById('base-multiplier').innerText = `x${speedBoostMultiplier}`;
    }

    document.querySelectorAll('.speed-btn').forEach(button => {
        button.onclick = () => {
            let cost = parseInt(button.querySelector('.price').innerText.replace('$', ''));
            if (totalCoins >= cost) {
                totalCoins -= cost;
                speedBoostMultiplier += parseInt(button.getAttribute('data-speed'));
                document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;

                updateBaseMultiplier();

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
            const bonusSpeedMultiplier = 50;
            speedBoostMultiplier += bonusSpeedMultiplier;

            const bonusId = activeSpeedBonuses.length;
            activeSpeedBonuses.push({
                multiplier: bonusSpeedMultiplier,
                duration: 30,
                remainingTime: 30,
                timer: null
            });

            document.getElementById('bth-balance').innerText = `Баланс bth: ${totalBTH}`;

            updateBaseMultiplier();

            activeSpeedBonuses[bonusId].timer = setInterval(() => {
                activeSpeedBonuses[bonusId].remainingTime--;

                updateBonusList(bonusId);

                if (activeSpeedBonuses[bonusId].remainingTime <= 0) {
                    clearInterval(activeSpeedBonuses[bonusId].timer);
                    speedBoostMultiplier -= bonusSpeedMultiplier;

                    activeSpeedBonuses.splice(bonusId, 1);
                    updateBonusList();

                    updateBaseMultiplier();
                }
            }, 1000);

            updateBonusList(bonusId);

        } else {
            showPopup('Недостаточно bth для активации бонуса!', 'missing-bth');
        }
    };

    setInterval(() => {
        for (let i = activeSpeedBonuses.length - 1; i >= 0; i--) {
            const bonus = activeSpeedBonuses[i];

            if (bonus.remainingTime <= 0) {
                clearInterval(bonus.timer);
                speedBoostMultiplier -= bonus.multiplier;

                activeSpeedBonuses.splice(i, 1);

                updateBaseMultiplier();
            } else {
                bonus.remainingTime--;
            }
        }

        updateBonusList();
    }, 1000);
    
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
            
        }
    }

    const starField = document.querySelector('.background-stars');
    const colors = ['#ffcc00', '#ff6699', '#3399ff', '#66ccff', '#cc99ff'];

    function createStar() {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.borderRadius = '50%';
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.opacity = Math.random(); 
        star.style.width = `${Math.random() * 2 + 1}px`; 
        star.style.height = star.style.width; 

        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;

        const animationDuration = Math.random() * 1 + 0.5; 
        star.style.animation = `twinkle ${animationDuration}s infinite alternate`;

        starField.appendChild(star);
    }

    for (let i = 0; i < 200; i++) {
        createStar();
    }
});
