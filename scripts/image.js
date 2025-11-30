document.addEventListener('DOMContentLoaded', function() {
    
    const imageContainer = document.querySelector('.image-wrapper'); 
    const imgElement = document.getElementById('image'); 
    const zoomWindow = document.getElementById('zoom-window');
    
    if (!imageContainer || !zoomWindow || !imgElement) {
        console.error("Errore: Elementi necessari non trovati.");
        return;
    }

    const zoomFactor = 2; 
    const imageUrl = imgElement.src;
    
    // Dimensione effettiva della finestra zoom nel CSS è 402px
    const zoomWindowSize = 402; 
    // Dimensione totale dell'immagine zoommata
    const zoomedImageSize = 400 * zoomFactor; // Usiamo 400 come dimensione base dell'immagine
    
    zoomWindow.style.backgroundImage = `url('${imageUrl}')`;
    zoomWindow.style.backgroundSize = `${zoomedImageSize}px ${zoomedImageSize}px`;

    // --- VARIABILE FLAG per visibilità ---
    let isMouseOverImageOrZoom = false;

    // =======================================================
    // 1. GESTIONE EVENTI VISIBILITÀ e Nascondimento
    // =======================================================

    imageContainer.addEventListener('mouseenter', () => {
        zoomWindow.style.display = 'block'; 
        isMouseOverImageOrZoom = true;
    });

    imageContainer.addEventListener('mouseleave', () => {
        isMouseOverImageOrZoom = false;
        setTimeout(checkIfShouldHide, 50); 
    });

    zoomWindow.addEventListener('mouseenter', () => {
        isMouseOverImageOrZoom = true;
    });

    zoomWindow.addEventListener('mouseleave', () => {
        isMouseOverImageOrZoom = false;
        setTimeout(checkIfShouldHide, 50);
    });

    function checkIfShouldHide() {
        if (!isMouseOverImageOrZoom) {
            zoomWindow.style.display = 'none';
        }
    }


    // =======================================================
    // 2. FUNZIONE DI TRACCIAMENTO (Applicata a entrambi gli elementi)
    // =======================================================
    function handleMouseMove(e) {
    
    const rect = imageContainer.getBoundingClientRect();
    
    // Calcola la posizione del mouse all'interno del contenitore (0 a 400)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Variabili per la dimensione dell'immagine (400) e della lente (400)
    const imageSize = 400; 
    const elementWidth = rect.width;
    const elementHeight = rect.height;
    
    // Calcola la posizione percentuale (0 a 1)
    const mouseX = x / elementWidth;
    const mouseY = y / elementHeight;
    
    // Calcola la posizione dello sfondo a piena dimensione zoommata
    let backgroundX = mouseX * zoomedImageSize;
    let backgroundY = mouseY * zoomedImageSize;

    // Dimensione a cui la lente si ritaglia dall'immagine zoommata
    // Utilizziamo l'offset di 1/2 della dimensione della LENTE (400px)
    const offsetCorrection = zoomWindowSize / 2; // Dovrebbe essere 400/2 = 200

    // CORREZIONE CRUCIALE: Centriamo lo sfondo zoommato in modo che il cursore sia al centro della lente
    let finalX = backgroundX - offsetCorrection;
    let finalY = backgroundY - offsetCorrection;

    // Limiti (Clamping) per impedire di vedere il vuoto
    const maxScroll = zoomedImageSize - imageSize; // 800 - 400 = 400
    const minVal = 0;
    const maxVal = maxScroll;

    finalX = Math.max(minVal, Math.min(maxVal, finalX));
    finalY = Math.max(minVal, Math.min(maxVal, finalY));

    // Imposta la posizione dello sfondo
    zoomWindow.style.backgroundPosition = 
        `-${finalX}px -${finalY}px`;
}

    // =======================================================
    // 3. APPLICAZIONE EVENTI MOVE
    // =======================================================
    
    imageContainer.addEventListener('mousemove', handleMouseMove);
    zoomWindow.addEventListener('mousemove', handleMouseMove);

});