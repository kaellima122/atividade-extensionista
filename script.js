const slides = document.querySelectorAll('.slide');
const audio = document.getElementById('audioPlayer');
const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const progressBar = document.getElementById('progress-bar');
const slideInfo = document.getElementById('slide-info');

let currentIndex = 0;
let isPausedManually = false; // Controla se o usuário pausou o áudio voluntariamente

// Inicializa o sistema
function init() {
    // Recupera progresso salvo (opcional)
    if (localStorage.getItem('savedSlide')) {
        currentIndex = parseInt(localStorage.getItem('savedSlide'));
    }
    updatePresentation(currentIndex);
}

// Função Principal de Atualização
function updatePresentation(index) {
    // Interrompe o áudio atual imediatamente
    audio.pause();
    audio.currentTime = 0;

    // Atualiza classes dos slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // Atualiza a Barra de Progresso Superior
    const progress = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Atualiza o contador de texto
    slideInfo.innerText = `Slide ${index + 1} / ${slides.length}`;

    // Define o novo arquivo de áudio (audio1.mp3, audio2.mp3, etc)
    audio.src = `audio/audio${index + 1}.mp3`;

    // Tenta tocar o áudio do novo slide (se não estiver pausado manualmente)
    if (!isPausedManually) {
        audio.play().catch(error => {
            console.log("Autoplay bloqueado ou áudio não encontrado. Clique em Play.");
            btnPlay.innerText = "RETOMAR NARRAÇÃO";
        });
        btnPlay.innerText = "PAUSAR NARRAÇÃO";
    } else {
        btnPlay.innerText = "RETOMAR NARRAÇÃO";
    }

    // Salva o progresso no navegador
    localStorage.setItem('savedSlide', index);
}

// EVENTO: Quando o áudio termina, pula automaticamente para o próximo
audio.addEventListener('ended', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        updatePresentation(currentIndex);
    } else {
        btnPlay.innerText = "REPLAY FINAL";
        alert("Treinamento concluído com sucesso!");
    }
});

// Botão Play/Pause
btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        isPausedManually = false;
        btnPlay.innerText = "PAUSAR NARRAÇÃO";
    } else {
        audio.pause();
        isPausedManually = true;
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

// Suporte a Teclado (Setas e Espaço)
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") btnNext.click();
    if (e.key === "ArrowLeft") btnPrev.click();
    if (e.key === " ") {
        e.preventDefault();
        btnPlay.click();
    }
});

// Suporte a Swipe (Deslizar o dedo no Celular)
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 60) btnNext.click(); // Deslizou para esquerda
    if (touchEndX - touchStartX > 60) btnPrev.click(); // Deslizou para direita
});

// Inicia o projeto
init();