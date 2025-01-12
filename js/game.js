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

function earnPassiveIncome() {
    const totalMultiplier = baseMultiplier + activeSpeedBonuses.reduce((sum, bonus) => sum + bonus.multiplier, 0);
    totalCoins += passiveIncomeRate * totalMultiplier;
    document.getElementById('balance').innerText = `Баланс: ${totalCoins}`;
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

function rotatePlanet() {
    const rotationDegree = (elapsedTime / 86400) * 360;
    document.getElementById('planet').style.transform = `rotate(${rotationDegree}deg)`;
}

export { updateTimer, startIncomeTimer, startGameTimer, earnPassiveIncome, updateCoinsBasedOnRealTime, rotatePlanet };