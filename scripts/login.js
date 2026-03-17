const BASE_URL = 'http://localhost:8080';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    await login();
});

async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const error = document.getElementById('error');

    error.style.display = 'none';
    error.textContent = '';

    if (!email || !password) {
        error.textContent = 'Por favor completa todos los campos.';
        error.style.display = 'block';
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        if (!data.token) {
            throw new Error('No se recibió el token del servidor');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('userName', email);
        localStorage.setItem('userRol', 'ADMIN');

        window.location.href = 'welcome.html';

    } catch (err) {
        console.error('Error en login:', err);
        error.textContent = err.message || 'Error al iniciar sesión.';
        error.style.display = 'block';
    }
}