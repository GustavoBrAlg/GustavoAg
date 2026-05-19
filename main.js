document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('magic-btn');
    const container = document.querySelector('.glass-panel');

    btn.addEventListener('click', () => {
        // Efeito sutil ao clicar
        btn.textContent = "Magia Ativada ✨";
        
        container.style.boxShadow = "0 0 40px rgba(56, 189, 248, 0.8)";
        container.style.borderColor = "rgba(56, 189, 248, 0.4)";
        
        setTimeout(() => {
            btn.textContent = "Descubra a Mágica";
            container.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";
            container.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }, 2000);
    });
});
