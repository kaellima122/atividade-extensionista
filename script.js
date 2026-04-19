/**
 * PROGRAMA DE CONSCIENTIZAÇÃO E RESILIÊNCIA CIBERNÉTICA
 * Sistema de Navegação e Narração Automática
 */

const slides = document.querySelectorAll('.slide');
const audio = document.getElementById('audioPlayer');
const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const progressBar = document.getElementById('progress-bar');
const slideInfo = document.getElementById('slide-info');
const btnStart = document.getElementById('btnStart');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('slider');
const controls = document.querySelector('.controls');

let currentIndex = 0;
let isPausedManually = false; // Define se o usuário pausou o áudio por conta própria

/**
 * INICIALIZAÇÃO: Destrava o áudio e mostra a interface
 * Exigido por navegadores modernos para permitir som automático
 */
btnStart.addEventListener('click', () => {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        mainContent.style.display = 'flex';
        controls.style.display = 'flex';
        
        // Verifica se há progresso salvo, senão começa do zero
        const savedProgress = localStorage.getItem('usaflex_progress');
        currentIndex = savedProgress ? parseInt(savedProgress) : 0;
        
        updatePresentation(currentIndex);
    }, 500);
});

/**
 * FUNÇÃO PRINCIPAL: Atualiza Slide, Áudio e Barra de Progresso
 */
function updatePresentation(index) {
    // 1. Limpa o estado do áudio anterior
    audio.pause();
    audio.currentTime = 0;

    // 2. Alterna a visibilidade dos slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // 3. Atualiza Elementos Visuais (Progresso e Contador)
    const progressPercent = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideInfo.innerText = `SLIDE ${index + 1} / ${slides.length}`;

    // 4. Carrega a nova narração (Caminho: audio/audio1.mp3 ...)
    audio.src = `audio/audio${index + 1}.mp3`;

    // 5. Tenta tocar automaticamente (se não estiver em modo de pausa manual)
    if (!isPausedManually) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                btnPlay.innerText = "PAUSAR";
            }).catch(error => {
                console.log("Autoplay bloqueado. Aguardando interação.");
                btnPlay.innerText = "RETOMAR";
            });
        }
    } else {
        btnPlay.innerText = "RETOMAR";
    }

    // 6. Salva o progresso atual
    localStorage.setItem('usaflex_progress', index);
}

/**
 * SISTEMA INTELIGENTE: Passar de slide sozinho ao fim do áudio
 */
audio.addEventListener('ended', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    } else {
        // Fim de todos os slides
        btnPlay.innerText = "REINICIAR";
        alert("Você concluiu o Programa de Resiliência Cibernética!");
    }
});

/**
 * CONTROLES MANUAIS
 */

// Play / Pause
btnPlay.addEventListener('click', () => {
    if (btnPlay.innerText === "REINICIAR") {
        currentIndex = 0;
        isPausedManually = false;
        updatePresentation(currentIndex);
        return;
    }

    if (audio.paused) {
        audio.play();
        isPausedManually = false;
        btnPlay.innerText = "PAUSAR";
    } else {
        audio.pause();
        isPausedManually = true;
        btnPlay.innerText = "RETOMAR";
    }
});

// Botão Próximo
btnNext.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    }
});

// Botão Anterior
btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updatePresentation(currentIndex);
    }
});

/**
 * SUPORTE A TECLADO E GESTOS
 */

// Atalhos do Teclado
document.addEventListener('keydown', (e) => {
    // Espaço pausa/despausa
    if (e.code === "Space") {
        e.preventDefault();
        btnPlay.click();
    }
    // Setas navegam
    if (e.code === "ArrowRight") btnNext.click();
    if (e.code === "ArrowLeft") btnPrev.click();
});

// Swipe no Celular (Deslizar o dedo)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Sensibilidade do deslize
    if (touchStartX - touchEndX > swipeThreshold) {
        btnNext.click(); // Deslizou para esquerda -> Próximo
    } else if (touchEndX - touchStartX > swipeThreshold) {
        btnPrev.click(); // Deslizou para direita -> Anterior
    }
}