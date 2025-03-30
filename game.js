// Données des améliorations de production avancées
const advancedUpgrades = [
    { 
        id: 'bananaRobot', 
        name: 'Robot Bananier', 
        desc: 'Un robot qui récolte automatiquement des bananes', 
        baseCost: 50000000, 
        bps: 100000,
        icon: 'fas fa-robot',
        unlockAt: 20000000,
        prestigeRequired: 1
    },
    { 
        id: 'bananaSatellite', 
        name: 'Satellite Bananier', 
        desc: 'Surveille et optimise la production depuis l\'espace', 
        baseCost: 250000000, 
        bps: 500000,
        icon: 'fas fa-satellite',
        unlockAt: 100000000,
        prestigeRequired: 2
    },
    { 
        id: 'bananaUniverse', 
        name: 'Univers Bananier', 
        desc: 'Votre propre univers dédié aux bananes', 
        baseCost: 1000000000, 
        bps: 2000000,
        icon: 'fas fa-universe',
        unlockAt: 500000000,
        prestigeRequired: 3
    }
];

// Nouveaux succès
const newAchievements = [
    { 
        id: 'ach-10M', 
        name: 'Empire Bananier', 
        desc: 'Atteignez 10,000,000 bananes', 
        threshold: 10000000, 
        reward: 50000,
        icon: 'fas fa-globe'
    },
    { 
        id: 'ach-100M', 
        name: 'Maître de l\'Univers Bananier', 
        desc: 'Atteignez 100,000,000 bananes', 
        threshold: 100000000, 
        reward: 500000,
        icon: 'fas fa-galaxy'
    },
    { 
        id: 'ach-prestige1', 
        name: 'Premier Prestige', 
        desc: 'Effectuez votre premier prestige', 
        threshold: 0, 
        reward: 0,
        icon: 'fas fa-medal',
        special: 'prestige',
        value: 1
    },
    { 
        id: 'ach-prestige5', 
        name: 'Roi du Prestige', 
        desc: 'Atteignez 5 prestiges', 
        threshold: 0, 
        reward: 0,
        icon: 'fas fa-crown',
        special: 'prestige',
        value: 5
    }
];

// Améliorations spéciales de prestige
const prestigeSpecialUpgrades = [
    {
        id: 'goldenTouch',
        name: 'Toucher d\'Or',
        desc: 'Chaque clic a 5% de chance de donner 1 Banane Dorée',
        baseCost: 100,
        maxLevel: 1,
        icon: 'fas fa-hand'
    },
    {
        id: 'autoclicker',
        name: 'Auto-Clicker',
        desc: 'Clique automatiquement 1 fois par seconde',
        baseCost: 200,
        maxLevel: 5,
        icon: 'fas fa-mouse-pointer',
        levelBonus: 1 // clics par seconde par niveau
    }
];

// Au chargement du document, initialiser les nouvelles fonctionnalités
document.addEventListener('DOMContentLoaded', function() {
    // Observer pour détecter quand le jeu est initialisé
    const observer = new MutationObserver(function(mutations) {
        // Vérifier si le jeu est initialisé
        if (window.gameState && window.gameState.bananas !== undefined) {
            enhanceGame();
            observer.disconnect();
        }
    });
    
    // Observer les changements dans le DOM
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Au cas où le jeu est déjà initialisé
    if (window.gameState && window.gameState.bananas !== undefined) {
        enhanceGame();
    }
});

// Améliorer le jeu avec de nouvelles fonctionnalités
function enhanceGame() {
    console.log("Améliorations du jeu chargées");
    
    // Fusionner les nouvelles améliorations avec les existantes
    window.productionUpgrades = [...window.productionUpgrades, ...advancedUpgrades];
    
    // Fusionner les nouveaux succès avec les existants
    window.achievementsData = [...window.achievementsData, ...newAchievements];
    
    // Ajouter les améliorations spéciales de prestige
    if (!window.gameState.prestigeSpecials) {
        window.gameState.prestigeSpecials = {};
        prestigeSpecialUpgrades.forEach(upgrade => {
            window.gameState.prestigeSpecials[upgrade.id] = { level: 0 };
        });
    }
    
    // Étendre la fonction handleClick
    const originalHandleClick = window.handleClick;
    window.handleClick = function() {
        originalHandleClick.apply(this, arguments);
        
        // Toucher d'or
        if (window.gameState.prestigeSpecials && 
            window.gameState.prestigeSpecials.goldenTouch && 
            window.gameState.prestigeSpecials.goldenTouch.level > 0) {
            
            if (Math.random() < 0.05) { // 5% de chance
                window.gameState.goldenBananas += 1;
                createGoldenClickEffect();
                window.playSound(window.specialSound);
            }
        }
    };
    
    // Étendre gameLoop pour l'autoclicker
    const originalGameLoop = window.gameLoop;
    window.gameLoop = function() {
        originalGameLoop.apply(this, arguments);
        
        // Auto-clicker
        if (window.gameState.prestigeSpecials && 
            window.gameState.prestigeSpecials.autoclicker && 
            window.gameState.prestigeSpecials.autoclicker.level > 0) {
            
            const now = Date.now();
            if (!window.lastAutoClick) {
                window.lastAutoClick = now;
            }
            
            const clickInterval = 1000 / window.gameState.prestigeSpecials.autoclicker.level; // Intervalle basé sur le niveau
            if (now - window.lastAutoClick >= clickInterval) {
                // Simuler un clic sans effet visuel
                let gain = 1 + (window.gameState.prestige * 0.1) + (window.gameState.prestigePowers.prestigeMultiplier.level * 0.001);
                window.gameState.bananas += gain;
                window.lastAutoClick = now;
            }
        }
    };
    
    // Ajouter une section pour les améliorations spéciales de prestige
    function renderPrestigeSpecialUpgrades() {
        const container = document.getElementById('prestige-upgrades-container');
        if (!container) return;
        
        // Ajouter une ligne pour les améliorations spéciales
        let prestigeSpecialsHtml = `
            <h4><i class="fas fa-star"></i> Améliorations Spéciales</h4>
            <div class="upgrades-grid">
        `;
        
        prestigeSpecialUpgrades.forEach(upgrade => {
            const level = window.gameState.prestigeSpecials[upgrade.id].level || 0;
            const cost = upgrade.baseCost * Math.pow(2, level);
            const isMax = level >= upgrade.maxLevel;
            
            prestigeSpecialsHtml += `
                <div class="upgrade">
                    <h3><i class="${upgrade.icon}"></i> ${upgrade.name}</h3>
                    <p>${upgrade.desc}</p>
                    <div class="upgrade-info">
                        <span class="upgrade-cost">Coût: <span>${window.formatNumber(cost)}</span> Bananes Dorées</span>
                        <span class="upgrade-owned">Niveau: <span>${level}</span>/${upgrade.maxLevel}</span>
                    </div>
                    <button class="btn btn-golden" onclick="buyPrestigeSpecial('${upgrade.id}')" 
                        ${isMax || window.gameState.goldenBananas < cost ? 'disabled' : ''}>
                        ${isMax ? '<i class="fas fa-check"></i> Maximum' : '<i class="fas fa-shopping-cart"></i> Améliorer'}
                    </button>
                </div>
            `;
        });
        
        prestigeSpecialsHtml += `</div>`;
        
        // Insérer avant la fin du conteneur
        container.insertAdjacentHTML('beforeend', prestigeSpecialsHtml);
    }
    
    // Fonction pour acheter des améliorations spéciales de prestige
    window.buyPrestigeSpecial = function(id) {
        const upgrade = prestigeSpecialUpgrades.find(u => u.id === id);
        if (!upgrade) return;
        
        const level = window.gameState.prestigeSpecials[id].level || 0;
        const cost = upgrade.baseCost * Math.pow(2, level);
        
        if (window.gameState.goldenBananas >= cost && level < upgrade.maxLevel) {
            window.gameState.goldenBananas -= cost;
            window.gameState.prestigeSpecials[id].level = level + 1;
            
            window.showNotification(`${upgrade.name} niveau ${level + 1} acheté!`);
            window.playSound(window.upgradeSound);
            window.updateDisplay();
            window.saveGame();
            
            // Rafraîchir l'interface
            const prestigeContainer = document.getElementById('prestige-upgrades-container');
            if (prestigeContainer) {
                // Supprimer les anciennes améliorations spéciales
                const specialHeader = prestigeContainer.querySelector('h4:nth-of-type(2)');
                if (specialHeader) {
                    const specialSection = specialHeader.nextElementSibling;
                    specialHeader.remove();
                    if (specialSection) specialSection.remove();
                }
                // Réafficher les améliorations
                renderPrestigeSpecialUpgrades();
            }
        }
    };
    
    // Effet visuel pour les bananes dorées
    function createGoldenClickEffect() {
        const effect = document.createElement('div');
        effect.className = 'click-effect special';
        effect.textContent = '+1 🌟';
        effect.style.left = `${Math.random() * 100 + 50}px`;
        effect.style.color = 'var(--golden)';
        effect.style.fontWeight = '900';
        document.getElementById('banana-container').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
    
    // Étendre la fonction renderProductionUpgrades pour inclure le niveau de prestige requis
    const originalRenderProductionUpgrades = window.renderProductionUpgrades;
    window.renderProductionUpgrades = function() {
        originalRenderProductionUpgrades.apply(this, arguments);
        
        // Ajouter des indications de niveau de prestige pour les améliorations avancées
        advancedUpgrades.forEach(upgrade => {
            const upgradeEl = document.querySelector(`[onclick="buyProductionUpgrade('${upgrade.id}')"]`);
            if (upgradeEl) {
                const container = upgradeEl.parentElement;
                
                if (window.gameState.prestige < upgrade.prestigeRequired) {
                    container.classList.add('locked-upgrade');
                    
                    // Ajouter l'explication pour le niveau de prestige requis
                    const lockedLabel = container.querySelector('.locked-label');
                    if (lockedLabel) {
                        lockedLabel.innerHTML = `Nécessite Prestige niveau ${upgrade.prestigeRequired}`;
                    } else {
                        const label = document.createElement('div');
                        label.className = 'locked-label';
                        label.innerHTML = `Nécessite Prestige niveau ${upgrade.prestigeRequired}`;
                        container.appendChild(label);
                    }
                    
                    upgradeEl.disabled = true;
                }
            }
        });
    };
    
    // Étendre la mise à jour des succès pour les succès spéciaux
    const originalUpdateAchievements = window.updateAchievements;
    window.updateAchievements = function() {
        originalUpdateAchievements.apply(this, arguments);
        
        // Vérifier les succès spéciaux
        newAchievements.forEach(ach => {
            if (ach.special === 'prestige') {
                const achieved = window.gameState.prestige >= ach.value;
                const achEl = document.getElementById(ach.id);
                
                if (achEl && achieved && !window.gameState.achievements[ach.id]) {
                    achEl.classList.add('unlocked');
                    window.gameState.achievements[ach.id] = true;
                    window.showNotification(`Succès débloqué: ${ach.name}`);
                    window.playSound(window.achievementSound);
                }
            }
        });
    };
    
    // Ajouter les améliorations spéciales de prestige à la fin de la mise à jour d'affichage
    const originalUpdateDisplay = window.updateDisplay;
    window.updateDisplay = function() {
        originalUpdateDisplay.apply(this, arguments);
        
        // Vérifier si les améliorations spéciales de prestige sont déjà affichées
        const prestigeContainer = document.getElementById('prestige-upgrades-container');
        if (prestigeContainer && !prestigeContainer.querySelector('h4:nth-of-type(2)')) {
            renderPrestigeSpecialUpgrades();
        }
    };
    
    // Rafraîchir l'interface une fois les améliorations chargées
    if (window.renderProductionUpgrades) {
        window.renderProductionUpgrades();
    }
    
    if (window.renderAchievements) {
        window.renderAchievements();
    }
    
    if (window.updateDisplay) {
        window.updateDisplay();
    }
    
    // Annoncer les nouvelles fonctionnalités
    setTimeout(() => {
        window.showNotification("🚀 Nouvelles améliorations disponibles! Débloquez des fonctionnalités avancées grâce au prestige.", false);
    }, 2000);
}
