// Mettre à jour les améliorations de production
function updateProductionUpgrades() {
    let shouldRerender = false;
    
    productionUpgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id]?.owned || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
        const isLocked = gameState.bananas < upgrade.unlockAt;
        const wasLocked = !document.getElementById(`${upgrade.id}-btn`);
        
        if (!isLocked && wasLocked) {
            shouldRerender = true;
        }
    });
    
    if (shouldRerender) {
        renderProductionUpgrades();
    } else {
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