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
    version: "1.3.1",
    // Nouvelles propriétés pour l'authentification et le premium
    user: null,
    isPremium: false,
    premiumBenefits: {
        multiplier: 1,
        production: 1
    }
};

// Configuration du jeu
const config = {
    recyclingInterval: 60,
    interestInterval: 3600,
    prestigeThreshold: 1000000,
    premiumCodes: {
        'PREMIUM2024': { multiplier: 2, production: 1.5, duration: 'permanent' },
        'VIP2024': { multiplier: 3, production: 2, duration: 'permanent' }
    },
    adminEmails: ['timeogayte@gmail.com']
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
    { 
        id: 'grandma', 
        name: 'Grand-mère Bananière', 
        desc: 'Elle a des recettes secrètes pour faire pousser les bananes', 
        baseCost: 100, 
        bps: 1,
        icon: 'fas fa-grandma',
        unlockAt: 50
    },
    { 
        id: 'farm', 
        name: 'Ferme Tropicale', 
        desc: 'Une plantation dédiée à vos bananes', 
        baseCost: 500, 
        bps: 4,
        icon: 'fas fa-tractor',
        unlockAt: 200
    },
    { 
        id: 'factory', 
        name: 'Usine de Transformation', 
        desc: 'Transformez vos bananes en produits dérivés', 
        baseCost: 3000, 
        bps: 10,
        icon: 'fas fa-industry',
        unlockAt: 1000
    },
    { 
        id: 'plantation', 
        name: 'Plantation Géante', 
        desc: 'Dominez le marché mondial de la banane', 
        baseCost: 10000, 
        bps: 25,
        icon: 'fas fa-globe-americas',
        unlockAt: 5000
    },
    { 
        id: 'research', 
        name: 'Laboratoire de Recherche', 
        desc: 'Bananes génétiquement modifiées pour plus de rendement', 
        baseCost: 50000, 
        bps: 100,
        icon: 'fas fa-flask',
        unlockAt: 20000
    },
    { 
        id: 'portal', 
        name: 'Portail Bananier', 
        desc: 'Importez des bananes d\'autres dimensions', 
        baseCost: 250000, 
        bps: 500,
        icon: 'fas fa-portal-enter',
        unlockAt: 100000
    },
    { 
        id: 'timeMachine', 
        name: 'Machine Temporelle', 
        desc: 'Récupérez des bananes du futur', 
        baseCost: 1000000, 
        bps: 2000,
        icon: 'fas fa-clock',
        unlockAt: 500000
    },
    { 
        id: 'bananaGod', 
        name: 'Temple du Dieu Banane', 
        desc: 'Vénérez le dieu suprême de la banane', 
        baseCost: 5000000, 
        bps: 10000,
        icon: 'fas fa-place-of-worship',
        unlockAt: 2000000
    },
    { 
        id: 'quantumFarm', 
        name: 'Ferme Quantique', 
        desc: 'Cultivez des bananes dans des univers parallèles', 
        baseCost: 25000000, 
        bps: 50000,
        icon: 'fas fa-atom',
        unlockAt: 10000000
    }
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
    { 
        id: 'ach-100', 
        name: 'Banane Affamé', 
        desc: 'Atteignez 100 bananes', 
        threshold: 100, 
        reward: 20,
        icon: 'fas fa-utensils'
    },
    { 
        id: 'ach-1000', 
        name: 'Roi des Bananes', 
        desc: 'Atteignez 1,000 bananes', 
        threshold: 1000, 
        reward: 100,
        icon: 'fas fa-crown'
    },
    { 
        id: 'ach-10000', 
        name: 'Empereur Banane', 
        desc: 'Atteignez 10,000 bananes', 
        threshold: 10000, 
        reward: 500,
        icon: 'fas fa-chess-king'
    },
    { 
        id: 'ach-100000', 
        name: 'Dieu de la Banane', 
        desc: 'Atteignez 100,000 bananes', 
        threshold: 100000, 
        reward: 5000,
        icon: 'fas fa-god'
    },
    { 
        id: 'ach-1M', 
        name: 'Légende Bananière', 
        desc: 'Atteignez 1,000,000 bananes', 
        threshold: 1000000, 
        reward: 0,
        icon: 'fas fa-monument'
    }
];

// Éléments du DOM
const banana = document.getElementById('banana');
const bananaContainer = document.getElementById('banana-container');
const counter = document.getElementById('counter');
const bpsCounter = document.getElementById('bananas-per-second');
const clickCounter = document.getElementById('total-clicks');
const multiplierDisplay = document.getElementById('multiplier');
const prestigeCounter = document.getElementById('prestige-counter');
const goldenBananasCounter = document.getElementById('golden-bananas-counter');
const productionUpgradesContainer = document.getElementById('production-upgrades');
const achievementsContainer = document.getElementById('achievements-container');
const prestigeBtn = document.getElementById('prestige-btn');
const themeToggleBtn = document.getElementById('themeToggle');

// Sons
const clickSound = document.getElementById('clickSound');
const upgradeSound = document.getElementById('upgradeSound');
const achievementSound = document.getElementById('achievementSound');
const prestigeSound = document.getElementById('prestigeSound');
const specialSound = document.getElementById('specialSound');

// Éléments DOM supplémentaires
const elements = {
    ...elements,
    authContainer: document.getElementById('authContainer'),
    gameContainer: document.querySelector('.game-container'),
    premiumOverlay: document.querySelector('.premium-overlay'),
    premiumModal: document.getElementById('premiumModal'),
    adminModal: document.getElementById('adminModal'),
    adminBtn: document.getElementById('adminBtn'),
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    premiumBtn: document.getElementById('premiumBtn'),
    redeemCodeBtn: document.getElementById('redeemCode'),
    premiumCodeInput: document.getElementById('premiumCode'),
    leaderboardList: document.getElementById('leaderboardList')
};

// Initialiser les structures de données du jeu
function initializeGameData() {
    // Initialiser les améliorations de production
    productionUpgrades.forEach(upgrade => {
        if (!gameState.upgrades[upgrade.id]) {
            gameState.upgrades[upgrade.id] = { owned: 0 };
        }
    });
    
    // Initialiser les succès
    achievementsData.forEach(ach => {
        if (gameState.achievements[ach.id] === undefined) {
            gameState.achievements[ach.id] = false;
        }
    });
    
    // Charger depuis le localStorage si disponible
    const save = localStorage.getItem('bananaEmpireSave');
    if (save) {
        try {
            const parsed = JSON.parse(save);
            
            // Migration des versions si nécessaire
            if (!parsed.version || parsed.version !== gameState.version) {
                // Ajouter ici toute logique de migration si la structure change
                parsed.version = gameState.version;
            }
            
            // Fusionner avec l'état actuel
            gameState = {
                ...gameState,
                ...parsed,
                temporaryBoosts: {
                    ...gameState.temporaryBoosts,
                    ...(parsed.temporaryBoosts || {})
                },
                specialUpgrades: {
                    ...gameState.specialUpgrades,
                    ...(parsed.specialUpgrades || {})
                },
                prestigePowers: {
                    ...gameState.prestigePowers,
                    ...(parsed.prestigePowers || {})
                }
            };
            
            showNotification('Partie chargée avec succès!');
            
            // Calculer les gains hors ligne
            if (gameState.lastUpdate) {
                const offlineTime = Date.now() - gameState.lastUpdate;
                const offlineSeconds = offlineTime / 1000;
                
                if (gameState.bananasPerSecond > 0) {
                    const offlineBananas = gameState.bananasPerSecond * offlineSeconds;
                    gameState.bananas += offlineBananas;
                    
                    if (offlineSeconds > 5) {
                        showNotification(`Bienvenue de retour! Vous avez gagné ${formatNumber(offlineBananas)} bananes pendant votre absence.`);
                    }
                }
                
                // Recyclage bananier
                if (gameState.specialUpgrades.recycling.level > 0) {
                    const recyclingInterval = 60;
                    const recyclingTimes = Math.floor(offlineSeconds / recyclingInterval);
                    
                    if (recyclingTimes > 0) {
                        const recycled = gameState.bananasPerSecond * 0.01 * gameState.specialUpgrades.recycling.level * recyclingTimes;
                        gameState.bananas += recycled;
                        showNotification(`Recyclage: +${formatNumber(recycled)} bananes recyclées`);
                    }
                }
                
                // Intérêts bananiers
                if (gameState.prestigePowers.interest.level > 0) {
                    const interestInterval = 3600;
                    const interestTimes = Math.floor(offlineSeconds / interestInterval);
                    
                    if (interestTimes > 0) {
                        const interest = gameState.bananas * 0.01 * gameState.prestigePowers.interest.level * interestTimes;
                        gameState.bananas += interest;
                        showNotification(`Intérêts: +${formatNumber(interest)} bananes accumulées`);
                    }
                }
            }
        } catch (e) {
            console.error("Erreur lors du chargement de la sauvegarde:", e);
            showNotification("Erreur lors du chargement de la sauvegarde", true);
        }
    }
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    banana.addEventListener('click', handleClick);
    
    // Thème sombre/clair
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Boutons d'amélioration
    document.getElementById('golden-minute-btn').addEventListener('click', activateGoldenMinute);
    document.getElementById('banana-blast-btn').addEventListener('click', activateBananaBlast);
    document.getElementById('random-multiplier-btn').addEventListener('click', buyRandomMultiplier);
    document.getElementById('recycling-btn').addEventListener('click', buyRecycling);
    document.getElementById('interest-btn').addEventListener('click', buyInterest);
    document.getElementById('prestige-mult-btn').addEventListener('click', buyPrestigeMultiplier);
    document.getElementById('prestige-btn').addEventListener('click', prestige);
    
    // Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            openTab(this.dataset.tab);
        });
    });
    
    // Sauvegarde quand l'onglet est fermé
    window.addEventListener('beforeunload', saveGame);
}

// Rendre les améliorations de production
function renderProductionUpgrades() {
    productionUpgradesContainer.innerHTML = '';
    
    productionUpgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id]?.owned || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
        const isLocked = gameState.bananas < upgrade.unlockAt;
        
        const upgradeEl = document.createElement('div');
        upgradeEl.className = `upgrade ${isLocked ? 'locked-upgrade' : ''}`;
        upgradeEl.innerHTML = `
            <h3><i class="${upgrade.icon}"></i> ${upgrade.name}</h3>
            <p>${upgrade.desc}</p>
            <div class="upgrade-info">
                <span class="upgrade-cost">Coût: <span id="${upgrade.id}-cost">${formatNumber(cost)}</span> bananes</span>
                <span class="upgrade-owned">Possédés: <span id="${upgrade.id}-owned">${owned}</span></span>
            </div>
            <p class="upgrade-bps">Production: +${formatNumber(upgrade.bps)} bananes/sec</p>
            ${isLocked ? `
                <div class="locked-label">Débloqué à ${formatNumber(upgrade.unlockAt)} bananes</div>
                <button class="btn" disabled>
                    <i class="fas fa-lock"></i> Verrouillé
                </button>
            ` : `
                <button class="btn" id="${upgrade.id}-btn">
                    <i class="fas fa-shopping-cart"></i> Acheter
                </button>
            `}
        `;
        
        productionUpgradesContainer.appendChild(upgradeEl);
        
        // Ajouter l'écouteur d'événement si débloqué
        if (!isLocked) {
            document.getElementById(`${upgrade.id}-btn`).addEventListener('click', () => buyProductionUpgrade(upgrade.id));
        }
    });
}

// Rendre les succès
function renderAchievements() {
    achievementsContainer.innerHTML = '';
    
    achievementsData.forEach(ach => {
        const achieved = gameState.bananas >= ach.threshold;
        const progress = Math.min(100, (gameState.bananas / ach.threshold) * 100);
        
        const achEl = document.createElement('div');
        achEl.className = `achievement ${achieved ? 'unlocked' : ''}`;
        achEl.id = ach.id;
        achEl.innerHTML = `
            <div class="achievement-icon">
                <i class="${ach.icon}"></i>
            </div>
            <div class="achievement-text">
                <h4>${ach.name}</h4>
                <p>${ach.desc}</p>
                ${ach.reward > 0 ? `<p class="achievement-reward">Récompense: +${formatNumber(ach.reward)} bananes</p>` : ''}
                ${!achieved ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
        
        achievementsContainer.appendChild(achEl);
    });
}

// Mise à jour de l'affichage
function updateDisplay() {
    // Bananes
    counter.textContent = formatNumber(Math.floor(gameState.bananas));
    
    // Bananes par seconde
    updateBPS();
    bpsCounter.textContent = formatNumber(gameState.bananasPerSecond);
    
    // Clics
    clickCounter.textContent = formatNumber(gameState.totalClicks);
    
    // Multiplicateur
    const multiplier = 1 + (gameState.prestige * 0.1) + (gameState.prestigePowers.prestigeMultiplier.level * 0.001);
    multiplierDisplay.textContent = multiplier.toFixed(3) + 'x';
    
    // Prestige
    prestigeCounter.textContent = gameState.prestige;
    goldenBananasCounter.textContent = formatNumber(gameState.goldenBananas);
    
    // Mettre à jour les améliorations de production
    updateProductionUpgrades();
    
    // Mettre à jour les succès
    updateAchievements();
    
    // Mettre à jour les boosters temporaires
    updateTemporaryBoosts();
    
    // Mettre à jour les améliorations spéciales
    updateSpecialUpgrades();
    
    // Mettre à jour les pouvoirs de prestige
    updatePrestigePowers();
    
    // Mettre à jour la section prestige
    updatePrestigeSection();
}

// Initialiser le jeu
function initGame() {
    initializeGameData();
    renderProductionUpgrades();
    renderAchievements();
    setupEventListeners();
    updateDisplay();
    gameLoop();
}

// Basculer entre thème clair/sombre
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Gestion des onglets
function openTab(tabId) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    document.getElementById(tabId).classList.add('active');
    
    // Activer le bouton correspondant
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

// Initialisation de l'authentification Google
function initGoogleAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '501175363576-8lcgi4qd45qh4n317csi3lkm5j3tsuf8.apps.googleusercontent.com'
        }).then(function(auth2) {
            if (auth2.isSignedIn.get()) {
                handleSignIn(auth2.currentUser.get());
            }
        });
    });
}

// Gestion de la connexion Google
function handleSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    gameState.user = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl()
    };
    
    document.getElementById('userAvatar').src = gameState.user.imageUrl;
    document.getElementById('userName').textContent = gameState.user.name;
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('authContainer').style.display = 'none';
    document.querySelector('.game-container').style.display = 'flex';
    
    if (config.adminEmails.includes(gameState.user.email)) {
        document.getElementById('adminBtn').style.display = 'block';
    }
    
    loadPlayerData();
}

// Gestion de la déconnexion
function handleSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        gameState.user = null;
        document.getElementById('userAvatar').src = 'default-avatar.png';
        document.getElementById('userName').textContent = 'Non connecté';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('authContainer').style.display = 'flex';
        document.querySelector('.game-container').style.display = 'none';
        document.getElementById('adminBtn').style.display = 'none';
    });
}

// Gestion des codes premium
function redeemPremiumCode(code) {
    const premiumCode = config.premiumCodes[code.toUpperCase()];
    if (premiumCode) {
        gameState.isPremium = true;
        gameState.premiumBenefits = {
            multiplier: premiumCode.multiplier,
            production: premiumCode.production
        };
        showNotification('Code premium activé avec succès!', 'success');
        document.getElementById('premiumModal').classList.remove('show');
        document.getElementById('premiumBtn').innerHTML = '<i class="fas fa-crown"></i> Premium Actif';
        document.getElementById('premiumBtn').classList.add('active');
        return true;
    }
    showNotification('Code premium invalide', 'error');
    return false;
}

// Gestion du classement
function updateLeaderboard() {
    if (!gameState.user) return;
    
    const leaderboardData = [
        { name: gameState.user.name, bananas: gameState.bananas, rank: 1 },
        { name: 'Joueur 2', bananas: 900000, rank: 2 },
        { name: 'Joueur 3', bananas: 800000, rank: 3 }
    ];
    
    document.getElementById('leaderboardList').innerHTML = leaderboardData.map(player => `
        <div class="leaderboard-entry">
            <span class="rank rank-${player.rank}">#${player.rank}</span>
            <span class="player-name">${player.name}</span>
            <span class="player-score">${formatNumber(player.bananas)} bananes</span>
        </div>
    `).join('');
}

// Gestion du panel administrateur
function initAdminPanel() {
    if (!gameState.user || !config.adminEmails.includes(gameState.user.email)) return;
    
    const adminBtn = document.getElementById('adminBtn');
    const adminSection = document.getElementById('adminSection');
    const adminAddBananasBtn = document.getElementById('adminAddBananas');
    const adminGenerateCodeBtn = document.getElementById('adminGenerateCode');
    const adminBananaAmount = document.getElementById('adminBananaAmount');
    const adminNewCode = document.getElementById('adminNewCode');
    
    // Afficher le bouton admin
    adminBtn.style.display = 'block';
    
    // Gérer le clic sur le bouton admin
    adminBtn.addEventListener('click', () => {
        // Basculer la visibilité de la section admin
        adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
        
        // Mettre à jour les statistiques
        updateAdminStats();
    });
    
    // Gérer l'ajout de bananes
    adminAddBananasBtn.addEventListener('click', () => {
        const amount = parseInt(adminBananaAmount.value);
        if (amount > 0) {
            gameState.bananas += amount;
            updateDisplay();
            showNotification(`${formatNumber(amount)} bananes ajoutées`, 'success');
            adminBananaAmount.value = '';
        }
    });
    
    // Gérer la génération de codes premium
    adminGenerateCodeBtn.addEventListener('click', () => {
        const code = adminNewCode.value.toUpperCase();
        if (code) {
            config.premiumCodes[code] = {
                multiplier: 2,
                production: 1.5,
                duration: 'permanent'
            };
            showNotification(`Code premium ${code} généré`, 'success');
            adminNewCode.value = '';
        }
    });
}

// Mise à jour des statistiques admin
function updateAdminStats() {
    const adminStats = document.getElementById('adminStats');
    if (!adminStats) return;
    
    adminStats.innerHTML = `
        <div class="admin-stat-card">
            <h4>Joueurs actifs</h4>
            <p>${gameState.user ? 1 : 0}</p>
        </div>
        <div class="admin-stat-card">
            <h4>Codes premium actifs</h4>
            <p>${Object.keys(config.premiumCodes).length}</p>
        </div>
        <div class="admin-stat-card">
            <h4>Bananes totales</h4>
            <p>${formatNumber(gameState.bananas)}</p>
        </div>
        <div class="admin-stat-card">
            <h4>Production/s</h4>
            <p>${formatNumber(gameState.bananasPerSecond)}</p>
        </div>
    `;
}

// Gestion de la touche espace
function handleSpacebar(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        handleClick();
    }
}

// Modification de la fonction setupEventListeners
const originalSetupEventListeners = setupEventListeners;
setupEventListeners = function() {
    originalSetupEventListeners();
    
    // Événements de connexion
    document.getElementById('playOffline').addEventListener('click', () => {
        document.getElementById('authContainer').style.display = 'none';
        document.querySelector('.game-container').style.display = 'flex';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', handleSignOut);
    document.getElementById('premiumBtn').addEventListener('click', () => {
        document.getElementById('premiumModal').classList.add('show');
    });
    
    document.getElementById('redeemCode').addEventListener('click', () => {
        const code = document.getElementById('premiumCode').value;
        if (redeemPremiumCode(code)) {
            document.getElementById('premiumCode').value = '';
        }
    });
    
    // Fermeture des modales
    document.querySelectorAll('.modal .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });
    
    // Ajout de l'écouteur pour la touche espace
    document.addEventListener('keydown', handleSpacebar);
};

// Modification de la fonction initGame
const originalInitGame = initGame;
initGame = function() {
    initGoogleAuth();
    originalInitGame();
    initAdminPanel();
};

// Modification de la fonction handleClick pour prendre en compte le premium
const originalHandleClick = handleClick;
handleClick = function() {
    const baseGain = 1 * gameState.multiplier;
    let gain = baseGain;
    
    // Bonus premium
    if (gameState.isPremium) {
        gain *= gameState.premiumBenefits.multiplier;
    }
    
    // Effets spéciaux existants
    if (gameState.temporaryBoosts.goldenMinute.active) {
        gain *= 2;
    }
    if (gameState.temporaryBoosts.bananaBlast.cooldown > 0) {
        gain *= 1.5;
    }
    
    gameState.bananas += gain;
    gameState.totalClicks++;
    
    createClickEffect(gain);
    
    if (clickSound) clickSound.play();
    
    updateDisplay();
    checkAchievements();
    saveGame();
};

// Modification de la fonction updateBPS pour prendre en compte le premium
const originalUpdateBPS = updateBPS;
updateBPS = function() {
    let bps = 0;
    
    productionUpgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id]?.owned || 0;
        bps += upgrade.bps * owned;
    });
    
    const prestigeBonus = 1 + (gameState.prestige * 0.1);
    bps *= prestigeBonus;
    
    // Bonus premium
    if (gameState.isPremium) {
        bps *= gameState.premiumBenefits.production;
    }
    
    gameState.bananasPerSecond = bps;
};

// Démarrer le jeu
initGame();