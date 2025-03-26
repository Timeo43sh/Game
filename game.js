// Mettre à jour les améliorations de production
function updateProductionUpgrades() {
    let shouldRerender = false;
    
    // Vérifier chaque amélioration
    productionUpgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id]?.owned || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
        const shouldBeUnlocked = gameState.bananas >= upgrade.unlockAt;
        const isCurrentlyLocked = !document.getElementById(`${upgrade.id}-btn`);
        
        // Si l'amélioration devrait être débloquée mais ne l'est pas encore
        if (shouldBeUnlocked && isCurrentlyLocked) {
            shouldRerender = true;
        }
    });
    
    // Si des améliorations doivent être débloquées
    if (shouldRerender) {
        renderProductionUpgrades();
    } else {
        // Sinon, simplement mettre à jour les coûts et boutons existants
        productionUpgrades.forEach(upgrade => {
            const owned = gameState.upgrades[upgrade.id]?.owned || 0;
            const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
            const isLocked = gameState.bananas < upgrade.unlockAt;
            
            if (!isLocked) {
                const btn = document.getElementById(`${upgrade.id}-btn`);
                if (btn) {
                    btn.disabled = gameState.bananas < cost;
                }
                
                const costEl = document.getElementById(`${upgrade.id}-cost`);
                if (costEl) costEl.textContent = formatNumber(cost);
                
                const ownedEl = document.getElementById(`${upgrade.id}-owned`);
                if (ownedEl) ownedEl.textContent = owned;
            }
        });
    }
}