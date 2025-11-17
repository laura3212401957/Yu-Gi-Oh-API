import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js'; 

export default function mostrarLogin() {
const app = document.getElementById("app");
document.body.style.scrollBehavior = "smooth";

app.innerHTML = `
<div>
<h2>Iniciar Sesión</h2>
<input type="email" id="correo" placeholder="Correo electrónico"
/>
<input type="password" id="contrasena" placeholder="Contraseña" />
<button id="btnLogin">Ingresar</button>
</div>
`;
document.getElementById("btnLogin").addEventListener("click", async ()=> {
const correo = document.getElementById("correo").value;
const contrasena = document.getElementById("contrasena").value;

try {
await signInWithEmailAndPassword(auth, correo, contrasena);
window.location.reload();
} catch (error) {
alert("Error al iniciar sesión: " + error.message);
}
});
}