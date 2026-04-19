/**
 * PROGRAMA DE CONSCIENTIZAÇÃO E RESILIÊNCIA CIBERNÉTICA
 * Sistema de Navegação, Narração Automática e Trilha Sonora
 */

const slides = document.querySelectorAll('.slide');
const narration = document.getElementById('audioPlayer'); // Áudio da voz
const bgMusic = document.getElementById('bgMusic');       // Música de fundo
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
let isPausedManually = false;

/**
 * INICIALIZAÇÃO: Libera áudios e mostra a interface
 */
btnStart.addEventListener('click', () => {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        mainContent.style.display = 'flex';
        controls.style.display = 'flex';
        
        // Configuração da Música de Fundo
        if (bgMusic) {
            bgMusic.volume = 0.04; // Volume baixo (15%) para não abafar a voz
            bgMusic.play().catch(e => console.log("Erro ao tocar música de fundo"));
        }

        // Recupera progresso ou começa do zero
        const savedProgress = localStorage.getItem('usaflex_progress');
        currentIndex = savedProgress ? parseInt(savedProgress) : 0;
        
        updatePresentation(currentIndex);
    }, 500);
});

/**
 * FUNÇÃO PRINCIPAL: Gerencia Slides e Sincroniza Narração
 */
function updatePresentation(index) {
    // 1. Reseta a narração atual
    narration.pause();
    narration.currentTime = 0;

    // 2. Troca o slide visível
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // 3. Atualiza Progresso e Contador
    const progressPercent = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideInfo.innerText = `SLIDE ${index + 1} / ${slides.length}`;

    // 4. Carrega o novo arquivo de voz
    narration.src = `audio/audio${index + 1}.mp3`;

    // 5. Toca automaticamente se o usuário não tiver pausado manualmente
    if (!isPausedManually) {
        narration.play().then(() => {
            btnPlay.innerText = "PAUSAR";
        }).catch(error => {
            console.log("Aguardando interação para áudio");
            btnPlay.innerText = "RETOMAR";
        });
        
        // Garante que a música de fundo esteja tocando se a voz estiver tocando
        if (bgMusic && bgMusic.paused) bgMusic.play();
    } else {
        btnPlay.innerText = "RETOMAR";
    }

    localStorage.setItem('usaflex_progress', index);
}

/**
 * AUTO-AVANÇO: Passa para o próximo slide quando a voz termina
 */
narration.addEventListener('ended', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    } else {
        btnPlay.innerText = "REINICIAR";
        if (bgMusic) bgMusic.pause(); // Para a música ao final
        alert("Treinamento concluído com sucesso!");
    }
});

/**
 * CONTROLES DE ÁUDIO E NAVEGAÇÃO
 */

btnPlay.addEventListener('click', () => {
    if (btnPlay.innerText === "REINICIAR") {
        currentIndex = 0;
        isPausedManually = false;
        if (bgMusic) bgMusic.play();
        updatePresentation(currentIndex);
        return;
    }

    if (narration.paused) {
        narration.play();
        if (bgMusic) bgMusic.play();
        isPausedManually = false;
        btnPlay.innerText = "PAUSAR";
    } else {
        narration.pause();
        if (bgMusic) bgMusic.pause(); // Pausa a música junto com a voz
        isPausedManually = true;
        btnPlay.innerText = "RETOMAR";
    }
});

btnNext.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    }
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updatePresentation(currentIndex);
    }
});

/**
 * SUPORTE A TECLADO E SWIPE (CELULAR)
 */

document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        btnPlay.click();
    }
    if (e.code === "ArrowRight") btnNext.click();
    if (e.code === "ArrowLeft") btnPrev.click();
});

let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 60) btnNext.click();
    if (touchEndX - touchStartX > 60) btnPrev.click();
});