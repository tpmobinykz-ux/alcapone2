/* =============================================
   Zodiac Mafia - Core Game Logic (Clean-Room)
   ============================================= */

// وضعیت کلی بازی
const GameState = {
    phase: "lobby", // lobby, night, day, voting, defense, ended
    dayCount: 1,
    nightCount: 1,
    players: [],
    currentSpeakerIndex: 0,
    votes: {},
    nightActions: {
        kill: null,
        heal: null,
        investigate: null,
        silence: null
    },
    winner: null
};

// لیست نقش‌ها
const Roles = {
    ALCAPONE: { name: "الکاپن", side: "mafia" },
    MAGICIAN: { name: "شعبده‌باز", side: "mafia" },
    DOCTOR: { name: "دکتر", side: "citizen" },
    DETECTIVE: { name: "کارآگاه", side: "citizen" },
    PRO_CITIZEN: { name: "شهروند حرفه‌ای", side: "citizen" },
    CITIZEN: { name: "شهروند ساده", side: "citizen" }
};

/**
 * شروع بازی و تخصیص نقش‌ها به صورت تصادفی
 */
function setupGame(playerNames) {
    const rolesArray = [
        Roles.ALCAPONE, Roles.MAGICIAN, 
        Roles.DOCTOR, Roles.DETECTIVE, 
        Roles.PRO_CITIZEN, Roles.CITIZEN
    ];

    // مخلوط کردن نقش‌ها (Shuffle)
    rolesArray.sort(() => Math.random() - 0.5);

    GameState.players = playerNames.map((name, index) => ({
        id: index,
        name: name,
        role: rolesArray[index],
        isAlive: true,
        isSilenced: false,
        isProtected: false
    }));

    console.log("بازی با ۶ بازیکن شروع شد.");
    startNight();
}

/**
 * فاز شب
 */
function startNight() {
    GameState.phase = "night";
    GameState.nightActions = { kill: null, heal: null, investigate: null, silence: null };
    console.log(`--- شب ${GameState.nightCount} ---`);
    // اینجا در UI باید منوی انتخاب اهداف برای نقش‌ها باز شود
}

// اکشن‌های شب
function performNightAction(roleType, targetId) {
    switch(roleType) {
        case 'mafia': GameState.nightActions.kill = targetId; break;
        case 'doctor': GameState.nightActions.heal = targetId; break;
        case 'magician': GameState.nightActions.silence = targetId; break;
        case 'detective': 
            const target = GameState.players[targetId];
            return target.role.side === 'mafia'; // نتیجه استعلام
    }
}

/**
 * پردازش اتفاقات شب و رفتن به روز
 */
function processNightToDay() {
    const { kill, heal, silence } = GameState.nightActions;

    // بررسی سایلنت
    GameState.players.forEach(p => p.isSilenced = false);
    if (silence !== null) {
        GameState.players[silence].isSilenced = true;
    }

    // بررسی شات شب
    if (kill !== null && kill !== heal) {
        GameState.players[kill].isAlive = false;
        console.log(`${GameState.players[kill].name} از بازی خارج شد.`);
    } else {
        console.log("امشب کشته‌ای نداشتیم.");
    }

    GameState.nightCount++;
    startDay();
}

/**
 * فاز روز (صحبت و تایمر)
 */
function startDay() {
    GameState.phase = "day";
    GameState.currentSpeakerIndex = 0;
    console.log(`--- روز ${GameState.dayCount} ---`);
    // شروع نوبت صحبت اولین بازیکن (۳۰ ثانیه)
}

/**
 * فاز رأی‌گیری
 */
function startVoting() {
    GameState.phase = "voting";
    GameState.votes = {};
    console.log("وقت رأی‌گیری است.");
}

function castVote(voterId, targetId) {
    if (GameState.players[voterId].isAlive && !GameState.players[voterId].isSilenced) {
        GameState.votes[voterId] = targetId;
    }
}

/**
 * بررسی نتایج رأی‌گیری و رفتن به دفاعیه
 */
function processVoting() {
    const voteCounts = {};
    Object.values(GameState.votes).forEach(targetId => {
        voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    // پیدا کردن کسی که بیشترین رأی را آورده
    let targetId = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b, null);

    if (targetId !== null && voteCounts[targetId] >= 2) { // حداقل ۲ رأی برای دفاعیه
        startDefense(parseInt(targetId));
    } else {
        console.log("کسی به دفاعیه نرفت.");
        endDay();
    }
}

function startDefense(playerId) {
    GameState.phase = "defense";
    console.log(`${GameState.players[playerId].name} در حال دفاع از خود است...`);
}

function eliminatePlayer(playerId) {
    GameState.players[playerId].isAlive = false;
    console.log(`${GameState.players[playerId].name} با رأی شهر حذف شد.`);
    checkWinCondition();
    if (GameState.phase !== "ended") endDay();
}

function endDay() {
    GameState.dayCount++;
    startNight();
}

/**
 * بررسی شرط پیروزی
 */
function checkWinCondition() {
    const aliveMafia = GameState.players.filter(p => p.isAlive && p.role.side === 'mafia').length;
    const aliveCitizens = GameState.players.filter(p => p.isAlive && p.role.side === 'citizen').length;

    if (aliveMafia === 0) {
        GameState.phase = "ended";
        GameState.winner = "شهروندان";
        alert("شهروندان برنده شدند!");
    } else if (aliveMafia >= aliveCitizens) {
        GameState.phase = "ended";
        GameState.winner = "مافیا";
        alert("مافیا برنده شد!");
    }
}
