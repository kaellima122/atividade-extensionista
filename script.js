const slides = document.querySelectorAll('.slide');
const audio = document.getElementById('audioPlayer');
const bgMusic = document.getElementById('bgMusic'); 
const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const progressBar = document.getElementById('progress-bar');
const slideInfo = document.getElementById('slide-info');

let currentIndex = 0;
let isPausedManually = false; 

// CONFIGURAÇÃO DE VOLUME (0.0 a 1.0)
if (bgMusic) {
    bgMusic.volume = 0.04; // Volume bem baixo (5%) como solicitado
}
if (audio) {
    audio.volume = 1.0; // Narração em volume máximo
}

// Inicializa o sistema
function init() {
    if (localStorage.getItem('savedSlide')) {
        currentIndex = parseInt(localStorage.getItem('savedSlide'));
    }
    updatePresentation(currentIndex);
}

// Função para gerenciar o estado da música de fundo baseado na narração
function syncBackgroundMusic() {
    if (bgMusic) {
        if (!isPausedManually) {
            bgMusic.play().catch(e => console.log("Aguardando interação..."));
        } else {
            bgMusic.pause();
        }
    }
}

// Função Principal de Atualização
function updatePresentation(index) {
    // Para a narração atual para trocar de arquivo
    audio.pause();
    audio.currentTime = 0;

    // Atualiza classes dos slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // Atualiza a Barra de Progresso
    const progress = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Atualiza o contador
    slideInfo.innerText = `Slide ${index + 1} / ${slides.length}`;

    // Define o novo arquivo de narração
    audio.src = `audio/audio${index + 1}.mp3`;

    // Se o usuário não pausou manualmente, toca a narração E a música de fundo
    if (!isPausedManually) {
        audio.play().catch(error => {
            console.log("Autoplay bloqueado. Clique em Play.");
            btnPlay.innerText = "RETOMAR";
        });
        syncBackgroundMusic(); 
        btnPlay.innerText = "PAUSAR NARRAÇÃO";
    } else {
        bgMusic.pause();
        btnPlay.innerText = "RETOMAR NARRAÇÃO";
    }

    localStorage.setItem('savedSlide', index);
}

// EVENTO: Quando a narração termina, pula automaticamente
audio.addEventListener('ended', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    } else {
        bgMusic.pause(); // Para a música no final de tudo
        btnPlay.innerText = "REPLAY FINAL";
        alert("Treinamento concluído com sucesso!");
    }
});

// Botão Play/Pause (Sincronizado)
btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        isPausedManually = false;
        audio.play();
        syncBackgroundMusic(); // Toca a música junto
        btnPlay.innerText = "PAUSAR NARRAÇÃO";
    } else {
        isPausedManually = true;
        audio.pause();
        bgMusic.pause(); // Para a música junto
        btnPlay.innerText = "RETOMAR NARRAÇÃO";
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

// Suporte a Teclado
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") btnNext.click();
    if (e.key === "ArrowLeft") btnPrev.click();
    if (e.key === " ") {
        e.preventDefault();
        btnPlay.click();
    }
});

// Suporte a Swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 60) btnNext.click();
    if (touchEndX - touchStartX > 60) btnPrev.click();
});

// Inicia o projeto
init();