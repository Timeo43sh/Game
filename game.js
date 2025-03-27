// Variables du jeu
const gameState = {
    bananas: 0,
    bananasPerSecond: 0,
    totalClicks: 0,
    upgrades: {},
    achievements: {},
    temporaryBoosts: {
        goldenMinute: { active: false, endTime: 0, cooldown: 0 },
        bananaBlast: { cooldown: 0 }
    },
    specialUpgrades: {
        randomMultiplier: { level: 0 },
        recycling: { level: 0, lastCollection: 0 }
    },
    prestigePowers: {
        interest: { level: 0 },
        prestigeMultiplier: { level: 0 },
        lastInterest: 0
    },
    prestige: 0,
    goldenBananas: 0,
    lastUpdate: Date.now(),
    version: "1.3.0"
};

// Données des améliorations de production
const productionUpgrades = [
    { 
        id: 'monkey', 
        name: 'Singe Assistant', 
        desc: 'Un petit singe qui travaille pour vous', 
        baseCost: 15, 
        bps: 0.2,
        icon: 'fas fa-monkey',
        unlockAt: 0
    },
    // ... (autres améliorations)
];

// Données des succès
const achievementsData = [
    { 
        id: 'ach-10', 
        name: 'Premières Bananes', 
        desc: 'Atteignez 10 bananes', 
        threshold: 10, 
        reward: 5,
        icon: 'fas fa-seedling'
    },
    // ... (autres succès)
];

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    initializeGameData();
    renderProductionUpgrades();
    renderAchievements();
    setupEventListeners();
    gameLoop();
});

// ... (toutes les autres fonctions)

// Boucle de jeu
function gameLoop() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;

    updateCooldowns(delta * 1000);

    if (gameState.bananasPerSecond > 0) {
        gameState.bananas += gameState.bananasPerSecond * delta;
    }

    updateDisplay();

    if (now % 30000 < 100) {
        saveGame();
    }

    requestAnimationFrame(gameLoop);
}