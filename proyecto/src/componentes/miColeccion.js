// miColeccion.js
import { db, auth } from '../firebaseConfig.js';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import mostrarCartas from "./original.js"; // volver al catálogo

export default async function mostrarMiColeccion() {
    const app = document.getElementById("app");
    document.body.style.scrollBehavior = "smooth";


    app.innerHTML = `
        <h2>Mi Colección</h2>
        <div id="coleccion" style="display:flex;flex-wrap:wrap;gap:20px;"></div>
    `;

    const user = auth.currentUser;
    const contenedor = document.getElementById("coleccion");

    if (!user) {
        contenedor.innerHTML = "<p>Debes iniciar sesión para ver tu colección.</p>";
        return;
    }

    try {
        // Obtener cartas del usuario
        const q = query(collection(db, "coleccion"), where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (snap.empty) {
            contenedor.innerHTML = "<p>No tienes cartas guardadas.</p>";
            return;
        }

        snap.forEach(docSnap => {
            const carta = docSnap.data();
            const idDoc = docSnap.id;

            const div = document.createElement("div");
            div.style.width = "200px";
            div.style.padding = "10px";
            div.style.border = "1px solid #ccc";
            div.style.borderRadius = "10px";
            div.style.textAlign = "center";

            div.innerHTML = `
                <img src="${carta.imagen}" width="180">
                <h4>${carta.nombre}</h4>

                <button class="eliminar" 
        data-id="${idDoc}"
        style="
            margin-top:12px;
            padding:10px 15px;
            border-radius:10px;
            border:none;
            background:#ff4d4d;
            color:white;
            font-weight:bold;
            cursor:pointer;
            box-shadow:0 4px 10px rgba(255, 77, 77, 0.4);
            transition:0.25s;
        "
        onmouseover="this.style.background='#ff1a1a'; this.style.boxShadow='0 6px 14px rgba(255,0,0,0.5)'"
        onmouseout="this.style.background='#ff4d4d'; this.style.boxShadow='0 4px 10px rgba(255,77,77,0.4)'">
    Eliminar
</button>
            `;

            contenedor.appendChild(div);
        });

        // --- BOTONES ELIMINAR ---
        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", async () => {
                const idDoc = btn.dataset.id;

                try {
                    await deleteDoc(doc(db, "coleccion", idDoc));

                    // quitar la carta DEL DOM sin recargar todo
                    btn.parentElement.remove();
                    alert("Carta eliminada de tu colección");

                } catch (error) {
                    alert("Error al eliminar: " + error.message);
                }
            });
        });

    } catch (error) {
        contenedor.innerHTML = "<p>Error cargando tu colección.</p>";
    }
}
