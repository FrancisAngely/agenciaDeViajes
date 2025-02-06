function obtenerNombreUsuario() {
    let nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (!nombreUsuario) {
        nombreUsuario = prompt('Por favor, ingresa tu nombre:');
        if (nombreUsuario) {
            sessionStorage.setItem('nombreUsuario', nombreUsuario);
        }
    }
    return nombreUsuario;
}

function mostrarInfoSistema() {
    const infoSistema = document.getElementById('infoSistema');
    infoSistema.innerHTML = `
        <div class="elemento-info">
            <i class="fas fa-expand"></i>
            <span>Resolución: ${window.screen.width}x${window.screen.height}</span>
        </div>
        <div class="elemento-info">
            <i class="fas fa-browser"></i>
            <span>Navegador: ${navigator.userAgent.split(')')[0]})</span>
        </div>
        <div class="elemento-info">
            <i class="fas fa-language"></i>
            <span>Idioma: ${navigator.language}</span>
        </div>
        <div class="elemento-info">
            <i class="fas fa-link"></i>
            <span style="font-size:13px;">URL: ${window.location.href}</span>
        </div>
    `;
}

function manejarColorFondo() {
    const selectorColor = document.getElementById('colorFondo');
    const colorGuardado = localStorage.getItem('colorFondo');

    if (colorGuardado) {
        document.body.style.backgroundColor = colorGuardado;
        selectorColor.value = colorGuardado;
    }

    selectorColor.addEventListener('change', (e) => {
        const nuevoColor = e.target.value;
        document.body.style.backgroundColor = nuevoColor;
        localStorage.setItem('colorFondo', nuevoColor);
    });
}

function manejarUltimaVisita() {
    const ahora = new Date().toLocaleString();
    establecerCookie('ultimaVisita', ahora, 30);
    const ultimaVisita = obtenerCookie('ultimaVisita');

    if (ultimaVisita) {
        document.getElementById('ultimaVisita').innerHTML = `
            <div class="elemento-info">
                <i class="fas fa-history"></i>
                <span>Última visita: ${ultimaVisita}</span>
            </div>
        `;
    }
}

function establecerCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expira = `expires=${fecha.toUTCString()}`;
    document.cookie = `${nombre}=${valor};${expira};path=/`;
}

function obtenerCookie(nombre) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [nombreCookie, valorCookie] = cookie.split('=');
        if (nombreCookie.trim() === nombre) {
            return valorCookie;
        }
    }
    return null;
}

function restablecerConfiguracion() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    location.reload();
}

function obtenerUbicacion() {
    const detallesUbicacion = document.getElementById('detallesUbicacion');

    if (!navigator.geolocation) {
        detallesUbicacion.innerHTML = `
            <div class="elemento-info">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Tu navegador no soporta geolocalización</span>
            </div>`;
        return;
    }

    detallesUbicacion.innerHTML = `
        <div class="elemento-info">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Obteniendo ubicación...</span>
        </div>`;

    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            const latitud = posicion.coords.latitude;
            const longitud = posicion.coords.longitude;
            const precision = posicion.coords.accuracy;

            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`)
                .then(response => response.json())
                .then(datos => {
                    detallesUbicacion.innerHTML = `
                        <div class="elemento-info">
                            <i class="fas fa-map-pin"></i>
                            <span>Ubicación: ${datos.display_name}</span>
                        </div>
                        <div class="elemento-info">
                            <i class="fas fa-compass"></i>
                            <span>Latitud: ${latitud.toFixed(4)}</span>
                        </div>
                        <div class="elemento-info">
                            <i class="fas fa-compass"></i>
                            <span>Longitud: ${longitud.toFixed(4)}</span>
                        </div>
                        <div class="elemento-info">
                            <i class="fas fa-bullseye"></i>
                            <span>Precisión: ${Math.round(precision)} metros</span>
                        </div>`;
                })
                .catch(error => {
                    detallesUbicacion.innerHTML += `
                        <div class="elemento-info">
                            <i class="fas fa-map-pin"></i>
                            <span>Lat: ${latitud.toFixed(4)}, Lon: ${longitud.toFixed(4)}</span>
                        </div>`;
                });
        },
        (error) => {
            let mensajeError;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    mensajeError = "Usuario denegó la petición de geolocalización.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensajeError = "Información de ubicación no disponible.";
                    break;
                case error.TIMEOUT:
                    mensajeError = "Tiempo de espera agotado para obtener la ubicación.";
                    break;
                default:
                    mensajeError = "Error desconocido al obtener la ubicación.";
            }
            detallesUbicacion.innerHTML = `
                <div class="elemento-info">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${mensajeError}</span>
                </div>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

window.onload = function() {
    const nombreUsuario = obtenerNombreUsuario();
    if (nombreUsuario) {
        document.getElementById('textoSaludo').textContent = `¡Hola, ${nombreUsuario}!`;
    }
    mostrarInfoSistema();
    manejarColorFondo();
    manejarUltimaVisita();
};