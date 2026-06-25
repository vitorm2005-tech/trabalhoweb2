// Captura o clique no botão de Logout e simula o método DELETE requisitado
document.getElementById('btnLogout').addEventListener('click', async () => {
    const response = await fetch('/logout', {
        method: 'DELETE', // Implementação de método diferente de GET e POST
        headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
});