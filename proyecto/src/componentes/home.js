export default async function mostrarHome() {
    const appContainer = document.getElementById("app");
    document.body.style.scrollBehavior = "smooth";

    appContainer.innerHTML = `
        <h2>Listado de Cartas</h2>
        <div id="listaCartas" style="display:flex;flex-wrap:wrap;gap:20px;"></div>
    `;

    const lista = document.getElementById("listaCartas");

    try {
        // Llamar API
        const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        const datos = await response.json();
        const cartas = datos.data;

        // Variables para scroll infinito
        let cargadas = 0;
        const cantidadPorCarga = 20;

        // Función para renderizar un bloque de 20 cartas
        function cargarMas() {
            const limite = cargadas + cantidadPorCarga;

            for (let i = cargadas; i < limite && i < cartas.length; i++) {
                const carta = cartas[i];

                const card = document.createElement("div");
                card.classList.add("app-card");

                card.innerHTML = `
        
            <div class="app-image">
                <img src="${carta.card_images[0].image_url}" width="200" height="300"
                    alt="Carta ${carta.name}">
        
            <div class="app-info">
                <h2>${carta.name}</h2>
                <p><strong>Tipo:</strong> ${carta.type}</p>
                <p><strong>Atributo:</strong> ${carta.attribute ? carta.attribute : "No aplica"}</p>
                <p><strong>Rareza:</strong> ${carta.card_sets ? carta.card_sets[0]?.set_rarity : "—"}</p>
                <p><strong>Descripción:</strong> ${carta.desc}</p>
            </div>
        </div>
                `;

                lista.appendChild(card);
            }

            cargadas = limite;
        }

        // Carga inicial
        cargarMas();

        // Scroll infinito
        window.onscroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

            if (bottom && cargadas < cartas.length) {
                cargarMas();
            }
        };

    } catch (error) {
        console.error("Error al cargar cartas:", error);
        appContainer.innerHTML = "<p>Error al cargar las cartas</p>";
    }
}
