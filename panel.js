// Función para mostrar información del entorno del usuario
function mostrarInfoUsuario() {
    const infoDiv = document.getElementById('info');
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width} x ${window.screen.height}`;
    const language = navigator.language || navigator.userLanguage;
    const currentURL = window.location.href;

    infoDiv.innerHTML = `
        <h2>Información del Usuario</h2>
        <p><strong>Navegador:</strong> ${userAgent}</p>
        <p><strong>Resolución de Pantalla:</strong> ${screenResolution}</p>
        <p><strong>Idioma:</strong> ${language}</p>
        <p><strong>URL Actual:</strong> ${currentURL}</p>
    `;
}

// Función para solicitar el nombre del usuario
function solicitarNombreUsuario() {
    const nombre = sessionStorage.getItem('nombreUsuario');
    if (!nombre) {
        const nombreUsuario = prompt("Por favor, ingresa tu nombre:");
        if (nombreUsuario) {
            sessionStorage.setItem('nombreUsuario', nombreUsuario);
            mostrarSaludo(nombreUsuario);
        }
    } else {
        mostrarSaludo(nombre);
    }
}

// Función para mostrar saludo personalizado
function mostrarSaludo(nombre) {
    const saludoDiv = document.getElementById('saludoUsuario');
    saludoDiv.innerHTML = `<h2>¡Bienvenido, ${nombre}!</h2>`;
}

// Función para elegir color de fondo
function elegirColorFondo() {
    const color = prompt("Elige un color de fondo (nombre o código hexadecimal):");
    if (color) {
        document.body.style.backgroundColor = color;
        localStorage.setItem('colorFondo', color);
    }
}

// Función para aplicar el color de fondo guardado
function aplicarColorFondoGuardado() {
    const colorGuardado = localStorage.getItem('colorFondo');
    if (colorGuardado) {
        document.body.style.backgroundColor = colorGuardado;
    }
}

// Función para registrar la última visita
function registrarUltimaVisita() {
    const ultimaVisita = document.cookie.split('; ').find(row => row.startsWith('ultimaVisita='));
    const fechaActual = new Date().toLocaleString();
    
    if (!ultimaVisita) {
        document.cookie = `ultimaVisita=${fechaActual}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 días
    } else {
        const ultimaVisitaFecha = ultimaVisita.split('=')[1];
        alert(`Tu última visita fue el: ${ultimaVisitaFecha}`);
        document.cookie = `ultimaVisita=${fechaActual}; path=/; max-age=${60 * 60 * 24 * 30}`; // Actualiza la fecha
    }
}

// Función para restablecer la configuración
function restablecerConfiguracion() {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie = "ultimaVisita=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Configuración restablecida.");
    location.reload(); // Recargar la página para aplicar cambios
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    mostrarInfoUsuario();
    solicitarNombreUsuario();
    aplicarColorFondoGuardado();
    registrarUltimaVisita();

    // Asignar evento al botón de restablecer
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', restablecerConfiguracion);
});