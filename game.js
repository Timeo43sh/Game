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
    version: "1.4.0",
    // Nouvelles propriétés pour l'authentification et le premium
    user: null,
    isPremium: false,
    premiumBenefits: {
        multiplier: 1,
        production: 1
    },
    // Ajout pour la plateforme multi-jeux
    platform: {
        currentGame: 'banana-clicker',
        games: {
            'banana-clicker': { lastPlayed: Date.now() },
            'snake': { highScore: 0, lastPlayed: null },
            'tetris': { highScore: 0, lastPlayed: null },
            'memory': { bestTime: null, lastPlayed: null },
            'flappy': { highScore: 0, lastPlayed: null }
        }
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
    adminCredentials: {
        username: 'admin',
        password: 'admin'
    },
    // Configuration de la plateforme
    platform: {
        saveInterval: 60000, // Sauvegarder toutes les minutes
        cloudSync: true
    }
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
    const save = localStorage.getItem('gameHubSave');
    if (save) {
        try {
            const parsed = JSON.parse(save);
            
            // Migration des versions si nécessaire
            if (!parsed.version || parsed.version !== gameState.version) {
                // Ajouter ici toute logique de migration si la structure change
                parsed.version = gameState.version;
                
                // Si c'est une ancienne sauvegarde sans la plateforme
                if (!parsed.platform) {
                    parsed.platform = gameState.platform;
                }
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
                },
                platform: {
                    ...gameState.platform,
                    ...(parsed.platform || {})
                }
            };
            
            showNotification('Partie chargée avec succès!');
            
            // Mettre à jour le jeu actuel
            gameState.platform.currentGame = 'banana-clicker';
            gameState.platform.games['banana-clicker'].lastPlayed = Date.now();
            
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
    // Vérifier si on est sur la page de jeu Banana Clicker
    if (document.getElementById('banana-clicker')) {
        initializeGameData();
        renderProductionUpgrades();
        renderAchievements();
        setupEventListeners();
        updateDisplay();
        
        // Démarrer la boucle de jeu
        if (!window.gameLoopRunning) {
            window.gameLoopRunning = true;
            gameLoop();
        }
        
        // Vérifier l'authentification
        checkAuthState();
    }
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

// Initialisation de l'authentification
function initAuth() {
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.createElement('div');
    loginForm.className = 'auth-form';
    loginForm.innerHTML = `
        <h2>Connexion</h2>
        <div class="input-group">
            <input type="text" id="username" placeholder="Nom d'utilisateur">
        </div>
        <div class="input-group">
            <input type="password" id="password" placeholder="Mot de passe">
        </div>
        <button class="btn" id="loginBtn">Se connecter</button>
    `;
    
    authContainer.appendChild(loginForm);
    
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
}

// Gestion de la connexion
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (username === config.adminCredentials.username && password === config.adminCredentials.password) {
        gameState.user = {
            id: 'admin',
            name: 'Administrateur',
            isAdmin: true
        };
        
        document.getElementById('userName').textContent = gameState.user.name;
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('authContainer').style.display = 'none';
        document.querySelector('.game-container').style.display = 'flex';
        
        // Afficher le bouton admin
        document.getElementById('adminBtn').style.display = 'block';
        
        loadPlayerData();
        showNotification('Connexion réussie!', 'success');
    } else {
        showNotification('Identifiants incorrects', 'error');
        // Effacer le mot de passe en cas d'erreur
        document.getElementById('password').value = '';
    }
}

// Gestion de la déconnexion
function handleSignOut() {
    gameState.user = null;
    document.getElementById('userName').textContent = 'Non connecté';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('authContainer').style.display = 'flex';
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('adminBtn').style.display = 'none';
    document.getElementById('adminSection').style.display = 'none';
    saveGame();
    showNotification('Déconnexion réussie', 'success');
}

// Synchronisation des données du joueur
function syncPlayerData() {
    if (!gameState.user) return;
    
    // Créer une copie des données à sauvegarder sans les informations sensibles
    const saveData = {
        bananas: gameState.bananas,
        bananasPerSecond: gameState.bananasPerSecond,
        totalClicks: gameState.totalClicks,
        upgrades: gameState.upgrades,
        achievements: gameState.achievements,
        temporaryBoosts: gameState.temporaryBoosts,
        specialUpgrades: gameState.specialUpgrades,
        prestigePowers: gameState.prestigePowers,
        prestige: gameState.prestige,
        goldenBananas: gameState.goldenBananas,
        lastUpdate: gameState.lastUpdate,
        version: gameState.version,
        isPremium: gameState.isPremium,
        premiumBenefits: gameState.premiumBenefits
    };
    
    localStorage.setItem('gameHubSave', JSON.stringify(saveData));
}

// Chargement des données du joueur
function loadPlayerData() {
    if (!gameState.user) return;
    
    const savedData = localStorage.getItem('gameHubSave');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            
            // Migration des versions si nécessaire
            if (!parsed.version || parsed.version !== gameState.version) {
                parsed.version = gameState.version;
            }
            
            // Mettre à jour uniquement les données du joueur
            Object.assign(gameState, parsed);
            
            updateDisplay();
            showNotification('Données chargées avec succès!', 'success');
        } catch (e) {
            console.error("Erreur lors du chargement des données:", e);
            showNotification("Erreur lors du chargement des données", 'error');
        }
    }
}

// Modification de la fonction initGame
const originalInitGame = initGame;
initGame = function() {
    initAuth();
    originalInitGame();
    initAdminPanel();
};

// Modification de la fonction saveGame pour inclure la synchronisation
const originalSaveGame = saveGame;
saveGame = function() {
    originalSaveGame();
    syncPlayerData();
};

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
    const adminBtn = document.getElementById('adminBtn');
    const adminSection = document.getElementById('adminSection');
    const adminAddBananasBtn = document.getElementById('adminAddBananas');
    const adminGenerateCodeBtn = document.getElementById('adminGenerateCode');
    const adminBananaAmount = document.getElementById('adminBananaAmount');
    const adminNewCode = document.getElementById('adminNewCode');
    
    // Nouvelles variables pour le panneau d'admin avancé
    const advancedAdminModal = document.getElementById('advancedAdminModal');
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    
    // Bouton pour ouvrir le panneau d'administration avancé
    const advancedAdminBtn = document.createElement('button');
    advancedAdminBtn.className = 'btn';
    advancedAdminBtn.innerHTML = '<i class="fas fa-tools"></i> Administration Avancée';
    advancedAdminBtn.style.marginTop = '1rem';
    
    // Ajouter le bouton à la section admin existante
    if (adminSection) {
        adminSection.appendChild(advancedAdminBtn);
    }
    
    // Cacher le bouton admin par défaut
    adminBtn.style.display = 'none';
    
    // Gérer le clic sur le bouton admin
    adminBtn.addEventListener('click', () => {
        // Vérifier si l'utilisateur est admin
        if (gameState.user && gameState.user.isAdmin) {
            // Basculer la visibilité de la section admin
            adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
            
            // Mettre à jour les statistiques
            updateAdminStats();
        } else {
            showNotification('Accès refusé: Droits administrateur requis', 'error');
        }
    });
    
    // Données de test
    const mockUsers = [
        { id: 'user1', name: 'Jean Dupont', email: 'jean@example.com', role: 'user', status: 'active', lastLogin: Date.now() - 86400000 },
        { id: 'user2', name: 'Marie Martin', email: 'marie@example.com', role: 'premium', status: 'active', lastLogin: Date.now() - 3600000 },
        { id: 'user3', name: 'Pierre Durand', email: 'pierre@example.com', role: 'user', status: 'suspended', lastLogin: Date.now() - 604800000 },
        { id: 'admin', name: 'Administrateur', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: Date.now() }
    ];
    
    const syncStats = {
        totalSyncs: 142,
        successfulSyncs: 135,
        failedSyncs: 7,
        dataConflicts: 2,
        lastSync: Date.now() - 1800000
    };
    
    // Gérer le clic sur le bouton d'administration avancée
    advancedAdminBtn.addEventListener('click', () => {
        if (!gameState.user || !gameState.user.isAdmin) {
            showNotification('Accès refusé: Droits administrateur requis', 'error');
            return;
        }
        
        advancedAdminModal.classList.add('show');
        initAdvancedAdmin();
    });
    
    // Fonction pour initialiser le panneau d'administration avancé
    function initAdvancedAdmin() {
        // Charger les utilisateurs
        loadUsers();
        
        // Charger les statistiques de synchronisation
        loadSyncStats();
        
        // Charger les logs système
        loadSystemLogs();
        
        // Configurer les écouteurs d'événements
        setupAdvancedAdminEvents();
    }
    
    // Fonction pour charger les utilisateurs dans le tableau
    function loadUsers() {
        const adminUserTableBody = document.getElementById('adminUserTableBody');
        adminUserTableBody.innerHTML = '';
        
        mockUsers.forEach(user => {
            const tr = document.createElement('tr');
            const lastLoginDate = new Date(user.lastLogin);
            
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>
                    <div class="user-info">
                        <strong>${user.name}</strong>
                        <div>${user.email}</div>
                    </div>
                </td>
                <td><span class="user-status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>${lastLoginDate.toLocaleDateString()} ${lastLoginDate.toLocaleTimeString()}</td>
                <td>
                    <div class="user-actions">
                        <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="sync-btn" data-id="${user.id}"><i class="fas fa-sync-alt"></i></button>
                        <button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            adminUserTableBody.appendChild(tr);
        });
    }
    
    // Fonction pour charger les statistiques de synchronisation
    function loadSyncStats() {
        const syncState = syncManager.getSyncState();
        document.getElementById('totalSyncs').textContent = syncState.stats.totalSyncs;
        document.getElementById('successfulSyncs').textContent = syncState.stats.successfulSyncs;
        document.getElementById('failedSyncs').textContent = syncState.stats.failedSyncs;
        document.getElementById('dataConflicts').textContent = syncState.stats.conflicts.filter(c => c.status === 'pending').length;
        
        const lastSyncDate = new Date(syncState.lastSync);
        document.getElementById('lastSyncTime').textContent = `${lastSyncDate.toLocaleDateString()} ${lastSyncDate.toLocaleTimeString()}`;
        
        // Charger les conflits
        loadConflicts();
    }
    
    // Fonction pour charger les conflits
    function loadConflicts() {
        const pendingConflicts = document.getElementById('pendingConflicts');
        const syncState = syncManager.getSyncState();
        const conflicts = syncState.stats.conflicts.filter(c => c.status === 'pending');
        
        if (conflicts.length === 0) {
            pendingConflicts.innerHTML = '<p class="no-data">Aucun conflit détecté</p>';
            return;
        }
        
        pendingConflicts.innerHTML = '';
        
        // Créer des conflits fictifs pour la démo si aucun n'existe
        if (conflicts.length === 0 && mockUsers.length > 0) {
            // Créer quelques conflits pour démonstration
            const user1 = mockUsers[0];
            const user2 = mockUsers.length > 1 ? mockUsers[1] : mockUsers[0];
            
            syncManager.registerConflict(
                user1.id,
                'data_mismatch',
                { bananas: 1500 },
                { bananas: 1200 },
                'Bananes: 1500 (local) vs 1200 (serveur)'
            );
            
            syncManager.registerConflict(
                user2.id,
                'upgrade_conflict',
                { upgrades: { monkey: { owned: 5 } } },
                { upgrades: { monkey: { owned: 3 } } },
                'Mise à niveau "Singe Assistant": 5 (local) vs 3 (serveur)'
            );
        }
        
        // Afficher les conflits
        syncState.stats.conflicts.filter(c => c.status === 'pending').forEach(conflict => {
            const user = mockUsers.find(u => u.id === conflict.userId) || { name: 'Utilisateur inconnu' };
            const conflictDate = new Date(conflict.timestamp);
            
            const conflictEl = document.createElement('div');
            conflictEl.className = 'conflict-item';
            conflictEl.innerHTML = `
                <div class="conflict-header">
                    <h5>Conflit: ${user.name}</h5>
                    <span class="conflict-type">${getConflictTypeName(conflict.type)}</span>
                </div>
                <div class="conflict-info">
                    <p>Date du conflit: ${conflictDate.toLocaleDateString()} à ${conflictDate.toLocaleTimeString()}</p>
                    <p>Détails: ${conflict.details}</p>
                </div>
                <div class="conflict-actions">
                    <button class="btn resolve-btn" data-id="${conflict.id}" data-resolution="local">Garder Local</button>
                    <button class="btn resolve-btn" data-id="${conflict.id}" data-resolution="server">Garder Serveur</button>
                    <button class="btn resolve-btn" data-id="${conflict.id}" data-resolution="merge">Fusionner</button>
                </div>
            `;
            
            pendingConflicts.appendChild(conflictEl);
        });
        
        // Ajouter les écouteurs pour les boutons de résolution
        document.querySelectorAll('.resolve-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const conflictId = btn.dataset.id;
                const resolution = btn.dataset.resolution;
                resolveConflict(conflictId, resolution);
            });
        });
    }
    
    // Fonction pour résoudre un conflit
    function resolveConflict(conflictId, resolution) {
        // Résoudre le conflit via le gestionnaire de synchronisation
        syncManager.resolveConflict(conflictId, resolution);
        
        // Mettre à jour l'affichage
        loadSyncStats();
        
        // Afficher une notification
        showNotification(`Conflit résolu avec la stratégie: ${resolution}`, false);
    }
    
    // Fonction pour obtenir le nom du type de conflit
    function getConflictTypeName(type) {
        const conflictTypes = {
            'data_mismatch': 'Données Divergentes',
            'upgrade_conflict': 'Conflit de Mise à Niveau',
            'missing_data': 'Données Manquantes',
            'sync_error': 'Erreur de Synchronisation'
        };
        
        return conflictTypes[type] || type;
    }
    
    // Fonction pour charger les logs système
    function loadSystemLogs() {
        const systemLogsContainer = document.getElementById('systemLogsContainer');
        systemLogsContainer.innerHTML = '';
        
        // Exemple de logs
        const mockLogs = [
            { timestamp: Date.now() - 100000, level: 'info', message: 'Utilisateur Jean Dupont connecté' },
            { timestamp: Date.now() - 200000, level: 'info', message: 'Synchronisation réussie pour Marie Martin' },
            { timestamp: Date.now() - 300000, level: 'warning', message: 'Tentative de synchronisation échouée pour Pierre Durand' },
            { timestamp: Date.now() - 400000, level: 'error', message: 'Erreur de connexion à la base de données' }
        ];
        
        mockLogs.forEach(log => {
            const logDate = new Date(log.timestamp);
            const formattedTime = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;
            
            const logEl = document.createElement('div');
            logEl.className = `log-entry ${log.level}`;
            logEl.innerHTML = `
                <span class="log-timestamp">[${formattedTime}]</span>
                <span class="log-level">[${log.level.toUpperCase()}]</span>
                <span class="log-message">${log.message}</span>
            `;
            
            systemLogsContainer.appendChild(logEl);
        });
    }
    
    // Configurer les écouteurs d'événements pour le panneau d'administration avancé
    function setupAdvancedAdminEvents() {
        // Gestion des onglets
        adminTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Désactiver tous les onglets
                document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
                
                // Activer l'onglet cliqué
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Recherche d'utilisateurs
        const userSearchBtn = document.getElementById('userSearchBtn');
        userSearchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
            const filteredUsers = mockUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
            );
            
            // Recharger la table avec les utilisateurs filtrés
            adminUserTableBody.innerHTML = '';
            filteredUsers.forEach(user => {
                // Afficher les utilisateurs filtrés (même code que dans loadUsers)
            });
        });
        
        // Forcer une synchronisation
        const forceSync = document.getElementById('forceSync');
        forceSync.addEventListener('click', () => {
            showNotification('Synchronisation globale en cours...', false);
            
            // Utiliser le gestionnaire de synchronisation
            syncManager.fullSync()
                .then(result => {
                    // Mettre à jour les statistiques du panneau
                    const syncState = syncManager.getSyncState();
                    document.getElementById('totalSyncs').textContent = syncState.stats.totalSyncs;
                    document.getElementById('successfulSyncs').textContent = syncState.stats.successfulSyncs;
                    document.getElementById('failedSyncs').textContent = syncState.stats.failedSyncs;
                    document.getElementById('dataConflicts').textContent = syncState.stats.conflicts.filter(c => c.status === 'pending').length;
                    
                    const lastSyncDate = new Date(syncState.lastSync);
                    document.getElementById('lastSyncTime').textContent = 
                        `${lastSyncDate.toLocaleDateString()} ${lastSyncDate.toLocaleTimeString()}`;
                    
                    showNotification('Synchronisation globale terminée avec succès', false);
                    
                    // Mettre à jour les logs
                    updateSystemLogs(syncState.logs);
                })
                .catch(error => {
                    showNotification('Erreur lors de la synchronisation: ' + error.message, true);
                });
        });
        
        // Réinitialiser la synchronisation
        const resetSync = document.getElementById('resetSync');
        resetSync.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser le système de synchronisation ? Cette action ne peut pas être annulée.')) {
                syncManager.resetSync();
                
                // Mettre à jour l'interface
                const syncState = syncManager.getSyncState();
                document.getElementById('totalSyncs').textContent = syncState.stats.totalSyncs;
                document.getElementById('successfulSyncs').textContent = syncState.stats.successfulSyncs;
                document.getElementById('failedSyncs').textContent = syncState.stats.failedSyncs;
                document.getElementById('dataConflicts').textContent = syncState.stats.conflicts.length;
                
                const lastSyncDate = new Date(syncState.lastSync);
                document.getElementById('lastSyncTime').textContent = 
                    `${lastSyncDate.toLocaleDateString()} ${lastSyncDate.toLocaleTimeString()}`;
                
                // Afficher le message de succès
                showNotification('Système de synchronisation réinitialisé avec succès', false);
                
                // Mettre à jour les logs
                updateSystemLogs(syncState.logs);
                
                // Vider la section des conflits
                document.getElementById('pendingConflicts').innerHTML = '<p class="no-data">Aucun conflit détecté</p>';
            }
        });

        // Fonction pour mettre à jour les logs système
        function updateSystemLogs(logs) {
            const systemLogsContainer = document.getElementById('systemLogsContainer');
            systemLogsContainer.innerHTML = '';
            
            if (logs.length === 0) {
                systemLogsContainer.innerHTML = '<p class="no-data">Aucun log disponible</p>';
                return;
            }
            
            logs.slice(0, 30).forEach(log => { // Afficher seulement les 30 derniers logs
                const logDate = new Date(log.timestamp);
                const formattedTime = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;
                
                const logEl = document.createElement('div');
                logEl.className = `log-entry ${log.type === 'error' ? 'error' : log.type === 'success' ? 'info' : 'warning'}`;
                logEl.innerHTML = `
                    <span class="log-timestamp">[${formattedTime}]</span>
                    <span class="log-level">[${log.type.toUpperCase()}]</span>
                    <span class="log-message">${log.userId ? `Utilisateur: ${log.userId} - ` : ''}${log.details}</span>
                `;
                
                systemLogsContainer.appendChild(logEl);
            });
        }
        
        // Synchroniser un utilisateur spécifique
        document.querySelectorAll('.sync-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.dataset.id;
                const user = mockUsers.find(u => u.id === userId);
                
                if (!user) return;
                
                showNotification(`Synchronisation de ${user.name} en cours...`, false);
                
                syncManager.syncUserData(userId, true)
                    .then(result => {
                        showNotification(`Synchronisation de ${user.name} terminée avec succès`, false);
                        
                        // Mettre à jour les statistiques
                        const syncState = syncManager.getSyncState();
                        document.getElementById('totalSyncs').textContent = syncState.stats.totalSyncs;
                        document.getElementById('successfulSyncs').textContent = syncState.stats.successfulSyncs;
                        
                        const lastSyncDate = new Date(syncState.lastSync);
                        document.getElementById('lastSyncTime').textContent = 
                            `${lastSyncDate.toLocaleDateString()} ${lastSyncDate.toLocaleTimeString()}`;
                        
                        // Mettre à jour les logs
                        updateSystemLogs(syncState.logs);
                    })
                    .catch(error => {
                        showNotification(`Erreur lors de la synchronisation de ${user.name}: ${error.message || error}`, true);
                        
                        // Mettre à jour les statistiques
                        const syncState = syncManager.getSyncState();
                        document.getElementById('totalSyncs').textContent = syncState.stats.totalSyncs;
                        document.getElementById('failedSyncs').textContent = syncState.stats.failedSyncs;
                        
                        // Mettre à jour les logs
                        updateSystemLogs(syncState.logs);
                    });
            });
        });
        
        // Filtrer les logs
        const logLevelFilter = document.getElementById('logLevelFilter');
        logLevelFilter.addEventListener('change', () => {
            const level = logLevelFilter.value;
            const syncState = syncManager.getSyncState();
            
            let filteredLogs;
            if (level === 'all') {
                filteredLogs = syncState.logs;
            } else if (level === 'error') {
                filteredLogs = syncState.logs.filter(log => log.type === 'error');
            } else if (level === 'warning') {
                filteredLogs = syncState.logs.filter(log => log.type !== 'success' && log.type !== 'error');
            } else {
                filteredLogs = syncState.logs.filter(log => log.type === 'success');
            }
            
            updateSystemLogs(filteredLogs);
        });
        
        // Effacer les logs
        const clearLogs = document.getElementById('clearLogs');
        clearLogs.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tous les logs ?')) {
                const syncState = syncManager.getSyncState();
                syncState.logs = [];
                
                // Mettre à jour l'affichage
                const systemLogsContainer = document.getElementById('systemLogsContainer');
                systemLogsContainer.innerHTML = '<p class="no-data">Aucun log disponible</p>';
                
                showNotification('Logs système effacés', false);
            }
        });
        
        // Fermer le modal
        document.getElementById('closeAdminModal').addEventListener('click', () => {
            advancedAdminModal.classList.remove('show');
        });
        
        // Gestion des utilisateurs
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.dataset.id;
                const user = mockUsers.find(u => u.id === userId);
                
                if (user) {
                    openUserEditModal(user);
                }
            });
        });
        
        // Ajouter un nouvel utilisateur
        const addUserBtn = document.getElementById('addUserBtn');
        addUserBtn.addEventListener('click', () => {
            const newUser = {
                id: 'user' + (mockUsers.length + 1),
                name: 'Nouvel Utilisateur',
                email: 'nouveau@example.com',
                role: 'user',
                status: 'active',
                lastLogin: Date.now()
            };
            
            openUserEditModal(newUser, true);
        });
        
        // Exporter les données utilisateurs
        const exportUsersBtn = document.getElementById('exportUsersBtn');
        exportUsersBtn.addEventListener('click', () => {
            // Préparer les données à exporter
            const exportData = JSON.stringify(mockUsers, null, 2);
            
            // Créer un objet Blob contenant les données
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Créer un lien de téléchargement et le simuler
            const a = document.createElement('a');
            a.href = url;
            a.download = `utilisateurs_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Nettoyer
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            showNotification('Données utilisateurs exportées avec succès', false);
        });
        
        // Fonction pour ouvrir le modal d'édition d'utilisateur
        function openUserEditModal(user, isNew = false) {
            const userEditModal = document.getElementById('userEditModal');
            const editUserId = document.getElementById('editUserId');
            const editUserName = document.getElementById('editUserName');
            const editUserEmail = document.getElementById('editUserEmail');
            const editUserRole = document.getElementById('editUserRole');
            const editUserStatus = document.getElementById('editUserStatus');
            const allowSync = document.getElementById('allowSync');
            const forceResync = document.getElementById('forceResync');
            
            // Remplir le formulaire avec les données de l'utilisateur
            editUserId.value = user.id;
            editUserName.value = user.name;
            editUserEmail.value = user.email || '';
            editUserRole.value = user.role || 'user';
            editUserStatus.value = user.status || 'active';
            allowSync.checked = true;
            forceResync.checked = false;
            
            // Afficher le modal
            userEditModal.classList.add('show');
            
            // Configurer les événements pour le formulaire
            setupUserFormEvents(isNew);
        }
        
        // Configurer les écouteurs d'événements pour le formulaire d'édition utilisateur
        function setupUserFormEvents(isNew) {
            const userEditModal = document.getElementById('userEditModal');
            const saveUserEdit = document.getElementById('saveUserEdit');
            const cancelUserEdit = document.getElementById('cancelUserEdit');
            const deleteUserBtn = document.getElementById('deleteUserBtn');
            
            // Supprimer les anciens écouteurs s'ils existent
            const newSaveBtn = saveUserEdit.cloneNode(true);
            saveUserEdit.parentNode.replaceChild(newSaveBtn, saveUserEdit);
            
            const newCancelBtn = cancelUserEdit.cloneNode(true);
            cancelUserEdit.parentNode.replaceChild(newCancelBtn, cancelUserEdit);
            
            const newDeleteBtn = deleteUserBtn.cloneNode(true);
            deleteUserBtn.parentNode.replaceChild(newDeleteBtn, deleteUserBtn);
            
            // Masquer le bouton supprimer pour les nouveaux utilisateurs
            if (isNew) {
                newDeleteBtn.style.display = 'none';
            } else {
                newDeleteBtn.style.display = 'block';
            }
            
            // Configurer l'événement pour sauvegarder
            newSaveBtn.addEventListener('click', () => {
                saveUserChanges();
            });
            
            // Configurer l'événement pour annuler
            newCancelBtn.addEventListener('click', () => {
                userEditModal.classList.remove('show');
            });
            
            // Configurer l'événement pour supprimer
            newDeleteBtn.addEventListener('click', () => {
                const userId = document.getElementById('editUserId').value;
                const user = mockUsers.find(u => u.id === userId);
                
                if (user && confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ?`)) {
                    deleteUser(userId);
                    userEditModal.classList.remove('show');
                }
            });
        }
        
        // Configurer les écouteurs d'événements pour les modales
        function setupModalEvents() {
            // Fermer les modales en cliquant sur les boutons de fermeture
            document.querySelectorAll('.btn-close, #closeAdminModal, #cancelUserEdit').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.closest('.modal').classList.remove('show');
                });
            });
            
            // Fermer les modales en cliquant en dehors
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
            });
        }
        
        // Initialiser les événements des modales
        setupModalEvents();
        
        // Sauvegarder les modifications d'un utilisateur
        function saveUserChanges() {
            const editUserId = document.getElementById('editUserId');
            const editUserName = document.getElementById('editUserName');
            const editUserEmail = document.getElementById('editUserEmail');
            const editUserRole = document.getElementById('editUserRole');
            const editUserStatus = document.getElementById('editUserStatus');
            const allowSync = document.getElementById('allowSync');
            const forceResync = document.getElementById('forceResync');
            const userEditModal = document.getElementById('userEditModal');
            
            // Valider les données
            if (!editUserName.value || !editUserEmail.value) {
                showNotification('Veuillez remplir tous les champs obligatoires', true);
                return;
            }
            
            // Trouver l'utilisateur existant ou en créer un nouveau
            const userIndex = mockUsers.findIndex(u => u.id === editUserId.value);
            
            const userData = {
                id: editUserId.value,
                name: editUserName.value,
                email: editUserEmail.value,
                role: editUserRole.value,
                status: editUserStatus.value,
                lastLogin: userIndex !== -1 ? mockUsers[userIndex].lastLogin : Date.now()
            };
            
            if (userIndex !== -1) {
                // Mettre à jour un utilisateur existant
                mockUsers[userIndex] = userData;
                showNotification(`Utilisateur ${userData.name} mis à jour avec succès`, false);
                
                // Forcer une synchronisation si demandé
                if (forceResync.checked) {
                    syncManager.syncUserData(userData.id, true)
                        .then(() => {
                            showNotification(`Données de ${userData.name} synchronisées`, false);
                        })
                        .catch(error => {
                            showNotification(`Erreur de synchronisation: ${error.message || error}`, true);
                        });
                }
            } else {
                // Créer un nouvel utilisateur
                mockUsers.push(userData);
                showNotification(`Nouvel utilisateur ${userData.name} créé avec succès`, false);
            }
            
            // Mettre à jour la liste des utilisateurs
            loadUsers();
            
            // Fermer le modal
            userEditModal.classList.remove('show');
        }
        
        // Supprimer un utilisateur
        function deleteUser(userId) {
            const userIndex = mockUsers.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                const userName = mockUsers[userIndex].name;
                mockUsers.splice(userIndex, 1);
                
                // Mettre à jour la liste des utilisateurs
                loadUsers();
                
                showNotification(`Utilisateur ${userName} supprimé avec succès`, false);
            }
        }
    }
    
    // Gérer l'ajout de bananes
    adminAddBananasBtn.addEventListener('click', () => {
        if (!gameState.user || !gameState.user.isAdmin) {
            showNotification('Accès refusé', 'error');
            return;
        }
        
        const amount = parseInt(adminBananaAmount.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Veuillez entrer un nombre valide', 'error');
            return;
        }
        
        gameState.bananas += amount;
        updateDisplay();
        showNotification(`${formatNumber(amount)} bananes ajoutées`, 'success');
        adminBananaAmount.value = '';
    });
    
    // Gérer la génération de codes premium
    adminGenerateCodeBtn.addEventListener('click', () => {
        if (!gameState.user || !gameState.user.isAdmin) {
            showNotification('Accès refusé', 'error');
            return;
        }
        
        const code = adminNewCode.value.toUpperCase();
        if (!code || code.length < 4) {
            showNotification('Le code doit contenir au moins 4 caractères', 'error');
            return;
        }
        
        config.premiumCodes[code] = {
            multiplier: 2,
            production: 1.5,
            duration: 'permanent'
        };
        showNotification(`Code premium ${code} généré`, 'success');
        adminNewCode.value = '';
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

// Fonction pour gérer la synchronisation des données et les conflits
function manageSynchronization() {
    // État de la synchronisation
    const syncState = {
        isActive: true,
        lastSync: Date.now(),
        stats: {
            totalSyncs: 0,
            successfulSyncs: 0,
            failedSyncs: 0,
            conflicts: []
        },
        logs: []
    };
    
    // Fonctions de gestion de la synchronisation
    return {
        // Récupérer l'état actuel de la synchronisation
        getSyncState: () => {
            return { ...syncState };
        },
        
        // Enregistrer un événement de synchronisation
        recordSync: (success = true, userId = null, details = '') => {
            syncState.lastSync = Date.now();
            syncState.stats.totalSyncs++;
            
            if (success) {
                syncState.stats.successfulSyncs++;
            } else {
                syncState.stats.failedSyncs++;
            }
            
            // Ajouter au journal
            syncState.logs.unshift({
                timestamp: Date.now(),
                type: success ? 'success' : 'error',
                userId: userId,
                details: details
            });
            
            // Limiter la taille du journal
            if (syncState.logs.length > 100) {
                syncState.logs.pop();
            }
            
            return true;
        },
        
        // Enregistrer un conflit de données
        registerConflict: (userId, conflictType, localData, serverData, details = '') => {
            const conflict = {
                id: 'conflict_' + Date.now(),
                userId: userId,
                type: conflictType,
                timestamp: Date.now(),
                localData: localData,
                serverData: serverData,
                details: details,
                status: 'pending' // pending, resolved, ignored
            };
            
            syncState.stats.conflicts.push(conflict);
            
            return conflict.id;
        },
        
        // Résoudre un conflit
        resolveConflict: (conflictId, resolution = 'local') => {
            const conflictIndex = syncState.stats.conflicts.findIndex(c => c.id === conflictId);
            
            if (conflictIndex === -1) {
                return false;
            }
            
            syncState.stats.conflicts[conflictIndex].status = 'resolved';
            syncState.stats.conflicts[conflictIndex].resolution = resolution;
            syncState.stats.conflicts[conflictIndex].resolvedAt = Date.now();
            
            return true;
        },
        
        // Synchroniser les données d'un utilisateur
        syncUserData: (userId, forceSync = false) => {
            // Simuler le processus de synchronisation
            return new Promise((resolve, reject) => {
                // Vérifier si la synchronisation est active
                if (!syncState.isActive && !forceSync) {
                    return reject('Synchronisation désactivée pour cet utilisateur');
                }
                
                // Simuler un délai de réseau
                setTimeout(() => {
                    // 80% de chances de succès
                    const isSuccess = Math.random() > 0.2;
                    
                    if (isSuccess) {
                        syncState.recordSync(true, userId, 'Synchronisation réussie');
                        resolve({
                            success: true,
                            message: 'Données synchronisées avec succès',
                            timestamp: Date.now()
                        });
                    } else {
                        // Simuler un échec de synchronisation
                        syncState.recordSync(false, userId, 'Échec de la synchronisation');
                        reject({
                            success: false,
                            message: 'Échec de la synchronisation',
                            error: 'network_error',
                            timestamp: Date.now()
                        });
                    }
                }, 1000 + Math.random() * 1000); // Entre 1 et 2 secondes
            });
        },
        
        // Détecter les conflits potentiels
        detectConflicts: (userData, serverData) => {
            const conflicts = [];
            
            // Comparer les bananes
            if (Math.abs(userData.bananas - serverData.bananas) > 100) {
                conflicts.push({
                    type: 'data_mismatch',
                    field: 'bananas',
                    localValue: userData.bananas,
                    serverValue: serverData.bananas
                });
            }
            
            // Comparer les améliorations
            for (const upgradeId in userData.upgrades) {
                if (!serverData.upgrades[upgradeId] || 
                    userData.upgrades[upgradeId].owned !== serverData.upgrades[upgradeId].owned) {
                    conflicts.push({
                        type: 'upgrade_conflict',
                        field: 'upgrades.' + upgradeId,
                        localValue: userData.upgrades[upgradeId].owned,
                        serverValue: serverData.upgrades[upgradeId]?.owned || 0
                    });
                }
            }
            
            return conflicts;
        },
        
        // Effectuer une synchronisation complète
        fullSync: () => {
            return new Promise((resolve) => {
                // Simuler une synchronisation globale
                setTimeout(() => {
                    syncState.lastSync = Date.now();
                    syncState.stats.totalSyncs++;
                    syncState.stats.successfulSyncs++;
                    
                    // Ajouter au journal
                    syncState.logs.unshift({
                        timestamp: Date.now(),
                        type: 'success',
                        userId: 'all',
                        details: 'Synchronisation globale terminée'
                    });
                    
                    resolve({
                        success: true,
                        message: 'Synchronisation globale terminée avec succès',
                        timestamp: Date.now()
                    });
                }, 2000 + Math.random() * 1000);
            });
        },
        
        // Réinitialiser le système de synchronisation
        resetSync: () => {
            syncState.lastSync = Date.now();
            syncState.stats.totalSyncs = 0;
            syncState.stats.successfulSyncs = 0;
            syncState.stats.failedSyncs = 0;
            syncState.stats.conflicts = [];
            syncState.logs = [{
                timestamp: Date.now(),
                type: 'info',
                userId: 'system',
                details: 'Système de synchronisation réinitialisé'
            }];
            
            return true;
        },
        
        // Activer/désactiver la synchronisation
        toggleSync: (active = true) => {
            syncState.isActive = active;
            return syncState.isActive;
        }
    };
}

// Instancier le gestionnaire de synchronisation
const syncManager = manageSynchronization();

// Fonction pour sauvegarder dans le cloud (simulée)
function saveToCloud() {
    // Si l'utilisateur n'est pas connecté, ne rien faire
    if (!gameState.user) return;
    
    // Utiliser notre gestionnaire de synchronisation si disponible
    if (typeof syncManager !== 'undefined') {
        syncManager.syncUserData(gameState.user.id)
            .then(result => {
                console.log('Sauvegarde cloud réussie:', result);
            })
            .catch(error => {
                console.error('Erreur de sauvegarde cloud:', error);
            });
    } else {
        // Ancienne méthode de sauvegarde (simulée)
        console.log('Sauvegarde cloud simulée pour', gameState.user.name);
    }
}

// Démarrer le jeu
initGame();

// Gestion des événements pour la plateforme
function setupPlatformEvents() {
    // Gérer la navigation entre les jeux
    const navLinks = document.querySelectorAll('.platform-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const gameId = this.getAttribute('data-game');
            if (gameId) {
                loadGame(gameId);
            } else {
                showHub();
            }
        });
    });
    
    // Sauvegarder périodiquement
    setInterval(saveGame, config.platform.saveInterval);
}

// Démarrer automatiquement le jeu si on est sur la page de jeu
if (document.getElementById('banana-clicker')) {
    // Initialiser seulement si on est directement sur la page de jeu
    if (!window.location.hash.includes('hub')) {
        initGame();
    }
}

// Exposer les fonctions nécessaires pour la plateforme
window.loadBananaClicker = initGame;
window.saveBananaClicker = saveGame;