import mostrarRegistro from './componentes/registro.js';
import mostrarLogin from './componentes/login.js';
import mostrarCartas from './componentes/original.js';
import mostrarMiColeccion from './componentes/miColeccion.js';
import mostrarHome from './componentes/home.js';
import mostrarLogout from './componentes/logout.js';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

// Estilos de botones y hover
const estiloBoton = `
    margin-bottom:15px;
    padding:10px 18px;
    border-radius:10px;
    border:none;
    background:#10b981;
    color:white;
    font-weight:bold;
    cursor:pointer;
    box-shadow:0 4px 10px rgba(16,185,129,0.4);
    transition:0.25s;
`;

const hoverBoton = `
    this.style.background='#059669'; 
    this.style.boxShadow='0 6px 14px rgba(5,150,105,0.5)'
`;

const outHoverBoton = `
    this.style.background='#10b981'; 
    this.style.boxShadow='0 4px 10px rgba(16,185,129,0.4)'
`;

// Navegación según estado de autenticación
onAuthStateChanged(auth, (user) => {
    const menu = document.getElementById("menu");
    if (!menu) return;

    if (user) {
        // Usuario logueado
        menu.innerHTML = `
            <nav>
                <button id="menuHome" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Home</button>
                <button id="menuOriginal" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Original</button>
                <button id="menuColeccion" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Mi Colección</button>
                <button id="menuLogout" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Logout</button>
            </nav>
        `;
        document.getElementById("menuHome").addEventListener("click", mostrarHome);
        document.getElementById("menuOriginal").addEventListener("click", mostrarCartas);
        document.getElementById("menuColeccion").addEventListener("click", mostrarMiColeccion);
        document.getElementById("menuLogout").addEventListener("click", mostrarLogout);
        mostrarHome();
    } else {
        // Usuario NO logueado
        menu.innerHTML = `
            <nav>
                <button id="menuLogin" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Login</button>
                <button id="menuRegistro" style="${estiloBoton}" onmouseover="${hoverBoton}" onmouseout="${outHoverBoton}">Registro</button>
            </nav>
        `;
        document.getElementById("menuLogin").addEventListener("click", mostrarLogin);
        document.getElementById("menuRegistro").addEventListener("click", mostrarRegistro);
        mostrarLogin();
    }
});
