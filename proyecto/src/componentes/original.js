import { db, auth } from '../firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function mostrarCartas() {
    const app = document.getElementById("app");
    document.body.style.scrollBehavior = "smooth";
    
    app.innerHTML = "<h2>Cartas de Yu-Gi-Oh</h2><p>Cargando cartas...</p>";

    try {
        // Llamar API
        const respuesta = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        const datos = await respuesta.json();
        const cartas = datos.data;

        let indice = 0;
        const bloque = 50;
        let cartasMostradas = [];

        // Contenedor + buscador
        app.innerHTML = `
            <h2>Cartas de Yu-Gi-Oh</h2>

            <input id="buscador" placeholder="Buscar carta..." 
                style="padding:10px;margin-bottom:20px;width:60%;border-radius:8px;border:1px solid #ccc;">

            <div id="cartas" style="display:flex;flex-wrap:wrap;gap:20px;"></div>
        `;

        const contenedor = document.getElementById("cartas");

        function renderCartas(lista) {
            contenedor.innerHTML = "";

            lista.forEach(carta => {
                const div = document.createElement("div");
                div.style.width = "200px";
                div.style.padding = "10px";
                div.style.border = "1px solid #ccc";
                div.style.borderRadius = "10px";
                div.style.textAlign = "center";

                div.innerHTML = `
                    <img src="${carta.card_images[0].image_url}" width="180"><br>
                    <h4>${carta.name}</h4>
                    <button class="guardar"
                    data-id="${carta.id}"
                    data-name="${carta.name}"
                    data-img="${carta.card_images[0].image_url}"
                    style="
                        margin-top:12px;
                        padding:10px 15px;
                        border-radius:10px;
                        border:none;
                        background:#3b82f6;
                        color:white;
                        font-weight:bold;
                        cursor:pointer;
                        box-shadow:0 4px 10px rgba(59,130,246,0.4);
                        transition:0.25s;
                    "
                    onmouseover="this.style.background='#1d4ed8'; this.style.boxShadow='0 6px 14px rgba(29,78,216,0.5)'"
                    onmouseout="this.style.background='#3b82f6'; this.style.boxShadow='0 4px 10px rgba(59,130,246,0.4)'"
                    >
                        Guardar en mi colección
                    </button>
                `;
                contenedor.appendChild(div);
            });

            document.querySelectorAll(".guardar").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const user = auth.currentUser;
                    if (!user) {
                        alert("Debes iniciar sesión para guardar cartas.");
                        return;
                    }

                    try {
                        await addDoc(collection(db, "coleccion"), {
                            uid: user.uid,
                            cardId: btn.dataset.id,
                            nombre: btn.dataset.name,
                            imagen: btn.dataset.img,
                            fechaGuardado: serverTimestamp()
                        });
                        alert("Carta guardada en tu colección");
                    } catch (error) {
                        alert("Error al guardar: " + error.message);
                    }
                });
            });
        }

        function cargarMas() {
            const siguienteBloque = cartas.slice(indice, indice + bloque);
            cartasMostradas = cartasMostradas.concat(siguienteBloque);
            indice += bloque;
            renderCartas(cartasMostradas);
        }

        cargarMas();

        window.addEventListener("scroll", () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                if (indice < cartas.length) cargarMas();
            }
        });

        document.getElementById("buscador").addEventListener("input", (e) => {
            const texto = e.target.value.toLowerCase();
            if (texto === "") {
                renderCartas(cartasMostradas);
                return;
            }
            const filtradas = cartas.filter(c => c.name.toLowerCase().includes(texto));
            renderCartas(filtradas);
        });

    } catch (error) {
        app.innerHTML = "<p>Error cargando cartas</p>";
    }
}
