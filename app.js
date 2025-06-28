// Pink Romantic Pixel Adventure Game JavaScript

class PixelAdventureGame {
    constructor() {
        this.gameState = {
            musicEnabled: true,
            collected: new Set(),
            totalCollectibles: 5,
            dialogueIndex: 0,
            gameStarted: false,
            finaleUnlocked: false
        };
        
        this.dialogues = [
            "UNLOCK ALL ITEMS FOR GRAND GIFT, MR SUS!",
            "Collect all the tokens to unlock your grand finale.",
            "Look for sparkles, hearts, and tiny surprises along the way!",
            "Did you know? Great minds think alike, Mr. Sus! 💡",
            "You found the secret spot VK ke peechhe! 🕵️‍♂️",
            "Sher! Roarrr! 🦁",
            "Time for chhotu sa break! 🚬",
            "Your travel bag is ready for adventures! 🧳",
            "Mmm, delicious Dhokla! Your favorite snack! 🥙"
        ];
        
        this.specialDialogues = {
            'vk': "You found the secret spot VK ke peechhe! 🕵️‍♂️",
            'lion': "20 is crazy, sher has grown old yeheee! 🦁",
            'cigarette': "Time for chhotu sa break! 🚬",
            'suitcase': "Your travel bag is ready for more of our adventures! 🧳",
            'dhokla': "Mmm, delicious dhoklu, Your favorite snack perhaps? 🥙"
        };
        
        this.elements = {
            startScreen: document.getElementById('startScreen'),
            gameArea: document.getElementById('gameArea'),
            finaleArea: document.getElementById('finaleArea'),
            birthdayPopup: document.getElementById('birthdayPopup'),
            startGameBtn: document.getElementById('startGameBtn'),
            musicToggle: document.getElementById('musicToggle'),
            musicStatus: document.getElementById('musicStatus'),
            progressText: document.getElementById('progressText'),
            dialogueText: document.getElementById('dialogueText'),
            birthdayGift: document.getElementById('birthdayGift'),
            confettiContainer: document.getElementById('confettiContainer'),
            gameMusic: document.getElementById('gameMusic')
        };
        
        this.init();
    }
    
    init() {
        this.createBackgroundSparkles();
        this.bindEvents();
        this.updateMusicButton();
        this.setRandomCollectiblePositions();
    }
    
    createBackgroundSparkles() {
        const sparkles = document.getElementById('bgSparkles');
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '12px';
            sparkle.style.color = 'var(--sparkle)';
            sparkle.style.left = Math.random() * 90 + '%';
            sparkle.style.top = Math.random() * 90 + '%';
            sparkle.style.animation = `twinkle ${2 + Math.random() * 3}s infinite`;
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparkles.appendChild(sparkle);
        }
    }
    
    setRandomCollectiblePositions() {
        const collectibles = document.querySelectorAll('.collectible');
        const positions = [
  { top: '15%', left: '15%' },   // Dhokla
  { top: '15%', left: '70%' },   // Travel Bag
  { top: '45%', left: '30%' },   // Sher
  { top: '55%', left: '75%' },   // Chhotu sa break (higher and more right)
  { top: '75%', left: '10%' }   // VK ke peechhe (move further left and down)
];
        collectibles.forEach((collectible, index) => {
            if (positions[index]) {
                collectible.style.top = positions[index].top;
                collectible.style.left = positions[index].left;
            }
            collectible.style.animationDelay = Math.random() * 2 + 's';
        });
    }
    
    bindEvents() {
        // Start game button
        this.elements.startGameBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        // Music toggle
        this.elements.musicToggle.addEventListener('click', () => {
            this.toggleMusic();
        });
        
        // Collectible clicks
        document.querySelectorAll('.collectible').forEach(collectible => {
            collectible.addEventListener('click', (e) => {
                this.collectItem(e.currentTarget);
            });
        });
        
        // Birthday gift click
        this.elements.birthdayGift.addEventListener('click', () => {
            this.showBirthdayMessage();
        });
        
        // Close birthday popup on click
        this.elements.birthdayPopup.addEventListener('click', () => {
            this.elements.birthdayPopup.classList.add('hidden');
        });
    }
    
    startGame() {
        this.gameState.gameStarted = true;
        this.elements.startScreen.classList.add('hidden');
        this.elements.gameArea.classList.remove('hidden');
        
        if (this.gameState.musicEnabled) {
            this.elements.gameMusic.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
            });
        }
        
        this.updateDialogue(this.dialogues[0]);
    }
    
    toggleMusic() {
        this.gameState.musicEnabled = !this.gameState.musicEnabled;
        this.updateMusicButton();
        
        if (this.gameState.musicEnabled && this.gameState.gameStarted) {
            this.elements.gameMusic.play().catch(e => {
                console.log('Audio play prevented:', e);
            });
        } else {
            this.elements.gameMusic.pause();
        }
    }
    
    updateMusicButton() {
        this.elements.musicStatus.textContent = this.gameState.musicEnabled ? 'ON' : 'OFF';
    }
    
    collectItem(collectibleElement) {
        const itemId = collectibleElement.dataset.id;
        const itemName = collectibleElement.dataset.name;
        
        if (this.gameState.collected.has(itemId)) {
            return; // Already collected
        }
        
        // Add to collected items
        this.gameState.collected.add(itemId);
        
        // Update visual state
        collectibleElement.classList.remove('grayscale');
        collectibleElement.classList.add('collected');
        
        // Create collection sparkle effect
        this.createSparkleEffect(collectibleElement);
        
        // Update progress
        this.updateProgress();
        
        // Update dialogue
        this.handleItemCollection(itemId, itemName);
        
        // Check if all items collected
        if (this.gameState.collected.size === this.gameState.totalCollectibles) {
            setTimeout(() => {
                this.unlockFinale();
            }, 1500);
        }
    }
    
    createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const gameWorld = document.querySelector('.game-world');
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '16px';
            sparkle.style.color = 'var(--sparkle)';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10';
            
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            
            sparkle.style.left = element.style.left;
            sparkle.style.top = element.style.top;
            sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            sparkle.style.animation = 'sparkleEffect 1s ease-out forwards';
            
            gameWorld.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
        
        // Add sparkle animation CSS if not exists
        if (!document.querySelector('#sparkleAnimation')) {
            const style = document.createElement('style');
            style.id = 'sparkleAnimation';
            style.textContent = `
                @keyframes sparkleEffect {
                    0% { opacity: 1; transform: translate(0, 0) scale(1); }
                    100% { opacity: 0; transform: translate(var(--x, 0), var(--y, -30px)) scale(0.5); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    handleItemCollection(itemId, itemName) {
        let dialogue = '';
        
        // Special dialogues for specific items
        if (this.specialDialogues[itemId]) {
            dialogue = this.specialDialogues[itemId];
        }
        // Special dialogue when first 2 items collected
        else if (this.gameState.collected.size === 2) {
            dialogue = "Did you know? Great minds think alike, Mr. Sus! 💡";
        }
        // General collection message
        else {
            dialogue = `You collected ${itemName}! ${this.getRandomCollectionMessage()}`;
        }
        
        this.updateDialogue(dialogue);
    }
    
    getRandomCollectionMessage() {
        const messages = [
            "Great find! ✨",
            "Perfect! 💖",
            "Amazing! 🌟",
            "Wonderful! 💕",
            "Excellent! 🎉"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    updateProgress() {
        const collected = this.gameState.collected.size;
        const total = this.gameState.totalCollectibles;
        this.elements.progressText.textContent = `${collected}/${total} collected`;
    }
    
    updateDialogue(text) {
        this.elements.dialogueText.textContent = text;
        
        // Add typing effect
        this.elements.dialogueText.style.opacity = '0';
        setTimeout(() => {
            this.elements.dialogueText.style.opacity = '1';
        }, 100);
    }
    
    unlockFinale() {
        this.gameState.finaleUnlocked = true;
        this.elements.gameArea.classList.add('hidden');
        this.elements.finaleArea.classList.remove('hidden');
        
        // Create additional floating hearts for finale
        this.createFinaleHearts();
    }
    
    createFinaleHearts() {
        const finaleArea = this.elements.finaleArea;
        const hearts = ['💖', '💕', '💝', '💗', '💘'];
        
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            heart.style.fontSize = '20px';
            heart.style.left = Math.random() * 90 + '%';
            heart.style.top = Math.random() * 90 + '%';
            heart.style.animation = `finaleHeartFloat ${2 + Math.random() * 3}s infinite ease-in-out`;
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1';
            
            finaleArea.appendChild(heart);
        }
    }
    
    showBirthdayMessage() {
        this.elements.birthdayPopup.classList.remove('hidden');
        this.createConfetti();
        
        // Create massive confetti explosion
        setTimeout(() => {
            this.createMassiveConfetti();
        }, 300);
    }
    
    createConfetti() {
        const colors = ['var(--main-pink)', 'var(--soft-purple)', 'var(--sparkle)', 'var(--accent)'];
        
        for (let i = 0; i < 42; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
                
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                }
                
                this.elements.confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 20);
        }
    }
    
    createMassiveConfetti() {
        const colors = ['var(--main-pink)', 'var(--soft-purple)', 'var(--sparkle)', 'var(--accent)'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.3 + 's';
                confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
                confetti.style.width = (6 + Math.random() * 8) + 'px';
                confetti.style.height = (6 + Math.random() * 8) + 'px';
                
                if (Math.random() > 0.6) {
                    confetti.style.borderRadius = '50%';
                }
                
                if (Math.random() > 0.7) {
                    confetti.style.transform = 'rotate(45deg)';
                }
                
                this.elements.confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 6000);
            }, i * 15);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PixelAdventureGame();
    
    // Add some extra interactive elements
    addInteractiveElements();
});

function addInteractiveElements() {
    // Add click sparkles throughout the game
    document.addEventListener('click', (e) => {
        // Don't add sparkles to specific elements
        if (e.target.closest('.collectible') || 
            e.target.closest('.birthday-gift') || 
            e.target.closest('.btn')) {
            return;
        }
        
        createClickSparkle(e.clientX, e.clientY);
    });
    
    // Add hover effects to hearts
    document.querySelectorAll('.floating-heart').forEach(heart => {
        heart.addEventListener('mouseenter', () => {
            heart.style.transform = 'scale(1.3)';
            heart.style.transition = 'transform 0.2s ease';
        });
        
        heart.addEventListener('mouseleave', () => {
            heart.style.transform = 'scale(1)';
        });
    });
}

function createClickSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '14px';
    sparkle.style.color = 'var(--sparkle)';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'clickSparkle 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
    
    // Add click sparkle animation if not exists
    if (!document.querySelector('#clickSparkleAnimation')) {
        const style = document.createElement('style');
        style.id = 'clickSparkleAnimation';
        style.textContent = `
            @keyframes clickSparkle {
                0% { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1) rotate(0deg); 
                }
                100% { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(2) rotate(180deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add some ambient animations
function addAmbientAnimations() {
    setInterval(() => {
        const gameWorld = document.querySelector('.game-world');
        if (gameWorld && !gameWorld.classList.contains('hidden')) {
            const heart = document.createElement('div');
            heart.textContent = '💕';
            heart.style.position = 'absolute';
            heart.style.fontSize = '12px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'ambientHeartRise 4s linear forwards';
            
            gameWorld.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }
    }, 3000);
    
    // Add ambient heart animation
    if (!document.querySelector('#ambientHeartAnimation')) {
        const style = document.createElement('style');
        style.id = 'ambientHeartAnimation';
        style.textContent = `
            @keyframes ambientHeartRise {
                0% { 
                    opacity: 0.8; 
                    transform: translateY(0px) rotate(0deg); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateY(-150px) rotate(20deg); 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Start ambient animations
setTimeout(addAmbientAnimations, 2000);
document.getElementById('replay-btn').onclick = function() {
this.addReplayButtonListener();
};
