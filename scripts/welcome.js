document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const userName = localStorage.getItem('userName');
    const userRol = localStorage.getItem('userRol');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const nombreMostrar = userName || email || 'Usuario';
    const rolMostrar = userRol || 'TRABAJADOR';
    const inicial = nombreMostrar.charAt(0).toUpperCase();

    const nombreEl = document.getElementById('nombreUsuario');
    const rolEl = document.getElementById('rolUsuario');
    const inicialEl = document.getElementById('inicial');

    if (nombreEl) {
        nombreEl.textContent = nombreMostrar;
    }

    if (inicialEl) {
        inicialEl.textContent = inicial;
    }

    if (rolEl) {
        if (rolMostrar === 'ADMIN') {
            rolEl.textContent = 'Administrador';
            rolEl.className = 'rol rol-admin';
        } else {
            rolEl.textContent = 'Trabajador';
            rolEl.className = 'rol rol-usuario';
        }
    }

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
});