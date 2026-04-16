// Background Music Logic
let bgmPlayed = false;

function playAudio() {
    if (!bgmPlayed) {
        let audio = document.getElementById('bgm');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Autoplay prevented'));
        bgmPlayed = true;
    }
}

// Background Floating Hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = ['❤️', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's'; // 6s to 10s
    document.getElementById('hearts-container').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

setInterval(createHeart, 500);

// Page Navigation
const welcomeMessages = [
    "Try again 😊",
    "Oops! Try more 😜",
    "Almost there 😏",
    "Last try 😍",
    "Okay you win ❤️"
];
const welcomeEmojis = ["😊", "😜", "😏", "😍", "❤️"];
let welcomeClickPhase = 0;

function handleWelcomeBtnClick(btn) {
    playAudio();

    if (welcomeClickPhase < 5) {
        btn.innerText = welcomeMessages[welcomeClickPhase];
        
        let emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.innerText = welcomeEmojis[welcomeClickPhase];
        
        let rect = btn.getBoundingClientRect();
        emoji.style.left = (rect.left + rect.width / 2 - 15) + 'px';
        emoji.style.top = (rect.top - 20) + 'px';
        document.body.appendChild(emoji);
        setTimeout(() => { if(emoji.parentNode) emoji.remove(); }, 1000);

        if (welcomeClickPhase === 4) {
            btn.style.boxShadow = "0 0 20px 10px rgba(255, 77, 109, 0.6)";
            btn.style.transform = "scale(1.1)";
        } else {
            let maxW = window.innerWidth - btn.offsetWidth - 40;
            let maxH = window.innerHeight - btn.offsetHeight - 40;
            
            let newX = Math.floor(Math.random() * maxW) + 20;
            let newY = Math.floor(Math.random() * maxH) + 20;

            btn.style.position = "fixed";
            btn.style.left = newX + "px";
            btn.style.top = newY + "px";
            
            btn.style.transform = "scale(0.9)";
            setTimeout(() => btn.style.transform = "scale(1)", 200);
        }
        welcomeClickPhase++;
    } else {
        goToPage('page-memories');
    }
}

function goToPage(pageId) {
    playAudio(); // Try playing audio on any interaction
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const target = document.getElementById(pageId);
    target.classList.add('active');

}

// Memories Modal
function openMemoryModal(text) {
    document.getElementById('modal-text').innerText = text;
    document.getElementById('memory-modal').classList.add('show');
}

function closeMemoryModal() {
    document.getElementById('memory-modal').classList.remove('show');
}



// Fun Page - Balloon Pop
let balloonScore = 0;
document.getElementById('page-fun').addEventListener('click', function(e) {
    // Only pop balloon if clicking on the background, not buttons
    if (e.target.tagName.toLowerCase() === 'button') return;
    
    playAudio();
    balloonScore++;
    let scoreEl = document.getElementById('balloon-score');
    if(scoreEl) scoreEl.innerText = `Score: ${balloonScore}`;
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.innerHTML = ['🎈', '🎉', '🎊', '🎀'][Math.floor(Math.random() * 4)];
    balloon.style.left = (e.clientX - 25) + 'px';
    balloon.style.top = (e.clientY - 25) + 'px';
    
    document.body.appendChild(balloon);
    
    setTimeout(() => {
        balloon.remove();
    }, 1000);
});

// Fun Page - Surprise Messages
const surprises = [
    "You are cutest 💕", 
    "Stay happy always 😘", 
    "Your smile is magic ✨", 
    "You're the best! 💖",
    "Keep shining! 🌟"
];

function showRandomSurprise() {
    playAudio();
    const textEl = document.getElementById('surprise-text');
    textEl.innerText = surprises[Math.floor(Math.random() * surprises.length)];
    textEl.classList.remove('hidden');
    
    // Confetti burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffc0cb', '#ff1e56', '#ffffff']
    });
}

// Final Birthday Page Interactive Candles
let totalCandles = 5;
let blownCandlesCount = 0;

function blowThisCandle(candleEl) {
    if (candleEl.classList.contains('blown')) return;
    
    playAudio();
    let blowAudio = document.getElementById('blow-sound');
    if(blowAudio) {
        blowAudio.currentTime = 0;
        blowAudio.play().catch(e => console.log('Audio play error', e));
    }
    
    candleEl.classList.add('blown');
    blownCandlesCount++;
    
    // Create smoke element
    let smoke = document.createElement('div');
    smoke.className = 'smoke';
    candleEl.appendChild(smoke);
    
    setTimeout(() => {
        if(smoke.parentNode) smoke.remove();
    }, 2000);

    // Add glow to cake if 1 candle left
    if (blownCandlesCount === totalCandles - 1) {
        document.querySelector('.cake-img').classList.add('glow-last-candle');
    }
    
    // Check if all blown
    if (blownCandlesCount >= totalCandles) {
        document.querySelector('.cake-img').classList.remove('glow-last-candle');
        
        // Flash Screen Effect
        const flash = document.getElementById('flash-screen');
        if(flash) {
            flash.classList.remove('hidden');
            flash.classList.add('flash');
            setTimeout(() => {
                flash.classList.remove('flash');
                setTimeout(() => flash.classList.add('hidden'), 200);
            }, 200);
        }

        setTimeout(triggerCelebrationMode, 800); // Small delay for the last smoke
    }
}

function triggerCelebrationMode() {
    let audio = document.getElementById('bgm');
    if (audio) audio.volume = 0.8; // Increase volume slightly

    // 1. Show celebration popup with glassmorphism + blur
    const popup = document.getElementById('celebration-popup');
    popup.classList.remove('hidden');
    popup.classList.add('show-popup');
    
    // 2. Blur background
    document.querySelector('.final-content').style.filter = "blur(8px)";
    
    // 3. Start massive confetti
    startMassiveConfetti();
    
    // 4. Start spawning balloons and raining hearts
    setInterval(createCelebrationBalloon, 800);
    setInterval(createHeartRain, 400);
}

function createCelebrationBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon-anim');
    balloon.innerHTML = ['🎈', '🎀'][Math.floor(Math.random() * 2)];
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.fontSize = (Math.random() * 2 + 2) + 'rem';
    balloon.style.animationDuration = (Math.random() * 4 + 4) + 's';
    document.body.appendChild(balloon);
    
    setTimeout(() => { if(balloon.parentNode) balloon.remove(); }, 8000);
}

function createHeartRain() {
    const heart = document.createElement('div');
    heart.classList.add('heart-rain');
    heart.innerHTML = ['💖', '💕', '💗', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => { if(heart.parentNode) heart.remove(); }, 6000);
}

function startMassiveConfetti() {
    let duration = 6000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }; // High z-index to appear over popup
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    let interval = setInterval(function() {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      let particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff4d6d', '#ffc0cb', '#ff1e56', '#ffffff']
      }));
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff4d6d', '#ffc0cb', '#ff1e56', '#ffffff']
      }));
    }, 250);
}
