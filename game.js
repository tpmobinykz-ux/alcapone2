/* =============================================
   Zodiac Mafia - Core Game Controller (کنترلر اصلی)
   ============================================= */

// وقتی کل صفحه لود شد، بازی آماده است
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * شروع اولیه برنامه و چک کردن وضعیت لاگین
 */
function initApp() {
    console.log("برنامه زودیاک اجرا شد...");
    
    // چک کردن اینکه آیا کاربر قبلاً اکانت ساخته یا نه
    const savedUser = localStorage.getItem('zodiac_user');
    
    if (savedUser) {
        showLobby();
    } else {
        showLoginScreen();
    }
}

/**
 * مدیریت صفحه ورود و ثبت‌نام
 */
function handleAuth(mode) {
    const nameInput = document.getElementById('username-input');
    const username = nameInput.value.trim();

    if (username.length < 3) {
        alert("لطفاً یک نام کاربری معتبر (حداقل ۳ حرف) وارد کنید.");
        return;
    }

    // ذخیره در LocalStorage برای مراجعات بعدی
    localStorage.setItem('zodiac_user', JSON.stringify({
        name: username,
        id: Date.now()
    }));

    showLobby();
}

/**
 * نمایش لابی و انتظار برای تکمیل ظرفیت
 */
function showLobby() {
    const mainScreen = document.getElementById('main-screen');
    const lobbyScreen = document.getElementById('lobby-screen');
    
    if (mainScreen) mainScreen.classList.add('hidden');
    if (lobbyScreen) lobbyScreen.classList.remove('hidden');

    console.log("در حال انتظار برای بازیکنان...");
    
    // شبیه‌سازی پر شدن لابی (در نسخه اصلی این بخش به سرور وصل می‌شود)
    setTimeout(() => {
        startGame();
    }, 2000); 
}

/**
 * استارت رسمی بازی
 */
function startGame() {
    console.log("بازی شروع شد!");
    
    // 1. مقداردهی اولیه به منطق بازی (Logic)
    initializeGame();

    // 2. مخفی کردن لابی و نمایش صفحه بازی
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    // 3. نمایش بازیکنان در رابط کاربری (UI)
    renderPlayers();
    
    // 4. نمایش نقش به بازیکن (مثلاً بازیکن شماره ۰ خود کاربر است)
    const userRole = GameState.players[0].role;
    showRoleModal(userRole);

    // 5. شروع فاز اول (روز ۱)
    updateTheme();
}

/**
 * دکمه پایان فاز یا تایید رای
 */
function onActionBtnClick() {
    if (GameState.phase === "day") {
        // اگر در فاز روز هستیم، برو به فاز رای‌گیری یا شب
        nextPhase();
        updateTheme();
        renderPlayers();
    } else {
        // منطق تایید انتخاب‌های شب
        processNightActions();
        nextPhase();
        updateTheme();
        renderPlayers();
    }
}

// گوش دادن به دکمه‌های صفحه برای تعامل
window.handleAuth = handleAuth;
window.onActionBtnClick = onActionBtnClick;
