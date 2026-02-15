/* =============================================
   Zodiac Mafia - UI & Interaction (رابط کاربری)
   ============================================= */

// انتخاب المان‌های اصلی از HTML
const phaseTitle = document.getElementById('phase-title');
const timerDisplay = document.getElementById('timer');

/**
 * نمایش بازیکنان به صورت دایره‌ای (مطابق زودیاک)
 */
function renderPlayers() {
    const container = document.getElementById('players-circle');
    if (!container) return;

    container.innerHTML = ''; // پاک کردن وضعیت قبلی

    GameState.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player-slot ${player.isAlive ? 'alive' : 'dead'}`;
        playerDiv.id = `player-${player.id}`;

        playerDiv.innerHTML = `
            <div class="player-avatar">
                <img src="https://via.placeholder.com/80/333/fff?text=User" alt="${player.name}">
                ${player.isSilenced ? '<div class="silence-mask">🤐</div>' : ''}
            </div>
            <div class="player-info">
                <span class="p-name">${player.name}</span>
            </div>
            <div class="vote-count" id="v-count-${player.id}">0</div>
        `;

        // رویداد کلیک برای انتخاب هدف
        playerDiv.onclick = () => {
            if (player.isAlive) handleInteraction(player.id);
        };

        container.appendChild(playerDiv);
    });
}

/**
 * مدیریت کلیک روی بازیکنان در فازهای مختلف
 */
function handleInteraction(targetId) {
    if (GameState.phase === "night") {
        console.log(`هدف شب انتخاب شد: ${targetId}`);
        // اینجا افکت انتخاب شدن هدف رو نشون میدیم
        const slots = document.querySelectorAll('.player-slot');
        slots.forEach(s => s.classList.remove('selected-target'));
        document.getElementById(`player-${targetId}`).classList.add('selected-target');
    }
}

/**
 * تغییر ظاهر صفحه بین شب و روز
 */
function updateTheme() {
    const body = document.body;
    if (GameState.phase === "night") {
        body.classList.add('night-theme');
        body.classList.remove('day-theme');
        if (phaseTitle) phaseTitle.innerText = `شب ${GameState.nightCount}`;
    } else {
        body.classList.add('day-theme');
        body.classList.remove('night-theme');
        if (phaseTitle) phaseTitle.innerText = `روز ${GameState.dayCount}`;
    }
}

/**
 * تایمر معکوس برای صحبت کردن (۳۰ ثانیه)
 */
function startCountdown(seconds) {
    let timeLeft = seconds;
    if (timerDisplay) timerDisplay.innerText = timeLeft;

    const timerInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            console.log("زمان تمام شد!");
        }
    }, 1000);
}

/**
 * نمایش نقش به بازیکن در ابتدای بازی
 */
function showRoleModal(roleName) {
    alert(`نقش شما: ${roleName}`); 
    // در آینده این رو به یک مودال گرافیکی زیبا تبدیل می‌کنیم
}
