const locales = [
    {
        id: "dlp",
        nombre: "DLP Burgers",
        logo: "img/logos-dlp.png",
        whatsapp: "5492241555555",
        menu: [
            { nombre: "Cheeseburger", precio: 11500, desc: "Cuádruple cheddar Milkaut, pan de papa y parmesano.", cat: "Hamburguesas" },
            { nombre: "Papas con Cheddar", precio: 5200, desc: "Bañadas en cheddar y lluvia de bacon.", cat: "Papas" }
        ]
    },
    {
        id: "brangus",
        nombre: "Brangus Burger",
        logo: "img/logos-brangus.png",
        whatsapp: "5492241666666",
        menu: [
            { nombre: "Brangus Clásica", precio: 9500, desc: "Medallón 180g, cheddar, lechuga y tomate.", cat: "Hamburguesas" }
        ]
    },
    {
        id: "bagas",
        nombre: "Bagas Burger",
        logo: "img/logos-bagas.png",
        whatsapp: "5492241777777",
        menu: [
            { nombre: "Bagas Cheese", precio: 8800, desc: "Smash burger con mucho cheddar.", cat: "Hamburguesas" }
        ]
    },
    {
        id: "hats",
        nombre: "Hats Burger",
        logo: "img/logos-hats.png",
        whatsapp: "5492241888888",
        menu: [
            { nombre: "Hats Deluxe", precio: 9800, desc: "Alioli, cheddar y bacon.", cat: "Hamburguesas" }
        ]
    },
    {
        id: "bajon",
        nombre: "Bajón Burga",
        logo: "img/logos-bajon.png",
        whatsapp: "5492241999999",
        menu: [
            { nombre: "La Bajonera", precio: 10500, desc: "Triple medallón y baño de queso.", cat: "Hamburguesas" }
        ]
    }
];

let carrito = [];
let localActivo = null;
let productoEnEdicion = null;
let opcionesElegidas = [];
let metodoPago = "Efectivo";

function renderLocales() {
    const container = document.getElementById('main-content');
    document.getElementById('subtitulo').innerText = "Catálogo de Chascomús";
    localActivo = null;
    let html = `<div class="grid-locales">`;
    locales.forEach(l => {
        html += `<div class="card-local" onclick="verMenu('${l.id}')">
                    <div class="local-info-wrapper">
                        <img src="${l.logo}" class="logo-circle" onerror="this.src='img/logo-app.png'">
                        <h3>${l.nombre}</h3>
                    </div>
                    <span>→</span>
                 </div>`;
        setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if(splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
    }
}, 1000);
    });
    container.innerHTML = html + `</div>`;
}

function verMenu(id) {
    localActivo = locales.find(l => l.id === id);
    const container = document.getElementById('main-content');
    document.getElementById('subtitulo').innerText = localActivo.nombre;
    let html = `<button onclick="renderLocales()" class="btn-cancel-top">✖ Volver al listado</button>`;
    localActivo.menu.forEach(i => {
        html += `<div class="product-card">
                    <h2>${i.nombre}</h2><p>${i.desc}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="price">$${i.precio.toLocaleString('es-AR')}</span>
                        <button class="btn-add" style="width:auto; padding:10px 20px;" onclick="abrirModal('${i.nombre}', ${i.precio})">➕ Sumar</button>
                    </div>
                 </div>`;
    });
    html += `<div id="footer-carrito" class="footer-carrito" style="display:${carrito.length > 0 ? 'flex' : 'none'}">
                <button onclick="mostrarResumen()" class="btn-ver-carrito">🛒 Ver Pedido (${carrito.length})</button>
             </div>`;
    container.innerHTML = html;
}

function abrirModal(nombre, precio) {
    productoEnEdicion = { nombre, precio };
    opcionesElegidas = [];
    document.getElementById('modal-titulo').innerText = nombre;
    document.getElementById('notas-adicionales').value = "";
    document.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
    document.getElementById('modal-personalizar').style.display = 'flex';
}

function toggleOpt(txt, event) {
    if (opcionesElegidas.includes(txt)) {
        opcionesElegidas = opcionesElegidas.filter(i => i !== txt);
        event.target.classList.remove('selected');
    } else {
        opcionesElegidas.push(txt);
        event.target.classList.add('selected');
    }
}

function cerrarModal() { document.getElementById('modal-personalizar').style.display = 'none'; }

function guardarEnCarrito() {
    const notasTexto = document.getElementById('notas-adicionales').value;
    let precioBase = productoEnEdicion.precio; //
    let adicionalesCosto = 0;

    // Definimos los precios de los adicionales
    const preciosExtras = {
        'Extra queso': 800,
        'Doble carne': 2500,
        'Bacon extra': 1200
    };

    // Sumamos el costo de cada opción seleccionada si existe en nuestra lista
    opcionesElegidas.forEach(opt => {
        if (preciosExtras[opt]) {
            adicionalesCosto += preciosExtras[opt];
        }
    });

    const finalNotas = [...opcionesElegidas, notasTexto].filter(x => x).join(", ");
    
    carrito.push({ 
        nombre: productoEnEdicion.nombre,
        precio: precioBase + adicionalesCosto, //
        notas: finalNotas || "Sin cambios" 
    });
    
    cerrarModal();
    actualizarFooter(); //
}

function calcularTotal() { return carrito.reduce((t, i) => t + i.precio, 0).toLocaleString('es-AR'); }

function mostrarResumen() {
    const container = document.getElementById('main-content');
    let html = `<button onclick="verMenu('${localActivo.id}')" class="btn-cancel-top">← Seguir sumando</button>
                <div class="resumen-container">`;
    carrito.forEach((item, index) => {
        html += `<div class="item-resumen">
                    <div><strong>${item.nombre}</strong><p style="font-size:0.8rem; color:gray; margin:0;">${item.notas}</p></div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>$${item.precio.toLocaleString('es-AR')}</span>
                        <button class="btn-del" onclick="eliminarItem(${index})">🗑️</button>
                    </div>
                 </div>`;
    });
    html += `<div style="margin-top:20px;">
                <label>Método de Pago:</label>
                <select onchange="metodoPago = this.value" style="width:100%; padding:10px; border-radius:10px; margin-top:5px; border: 1px solid #ccc;">
                    <option>Efectivo</option><option>Cuenta DNI</option><option>Transferencia</option>
                </select>
             </div>
             <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:1.3rem; font-weight:800;">
                <span>Total:</span><span>$${calcularTotal()}</span>
             </div>
             <button onclick="enviarWhatsApp()" class="btn-ver-carrito" style="width:100%; margin-top:20px;">🚀 Enviar WhatsApp</button></div>`;
    container.innerHTML = html;
}

function eliminarItem(idx) {
    carrito.splice(idx, 1);
    carrito.length === 0 ? renderLocales() : mostrarResumen();
}

// Variable global nueva
let direccionEnvio = "";

function mostrarResumen() {
    const container = document.getElementById('main-content');
    let html = `<button onclick="verMenu('${localActivo.id}')" class="btn-cancel-top">← Seguir sumando</button>
                <div class="resumen-container">`;
    
    carrito.forEach((item, index) => {
        html += `<div class="item-resumen">
                    <div><strong>${item.nombre}</strong><p style="font-size:0.8rem; color:gray; margin:0;">${item.notas}</p></div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>$${item.precio.toLocaleString('es-AR')}</span>
                        <button class="btn-del" onclick="eliminarItem(${index})">🗑️</button>
                    </div>
                 </div>`;
    });

    html += `<div style="margin-top:20px;">
                <label>📍 Dirección de entrega:</label>
                <input type="text" id="input-direccion" placeholder="Ej: Libres del Sur 123" 
                       style="width:100%; padding:12px; border-radius:10px; margin-top:5px; border: 1px solid var(--border); box-sizing: border-box;"
                       onchange="direccionEnvio = this.value">
             </div>

             <div style="margin-top:15px;">
                <label>💳 Método de Pago:</label>
                <select onchange="metodoPago = this.value" style="width:100%; padding:12px; border-radius:10px; margin-top:5px; border: 1px solid var(--border); background: var(--card-bg); color: var(--text-main);">
                    <option>Efectivo</option><option>Cuenta DNI</option><option>Transferencia</option>
                </select>
             </div>

             <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:1.3rem; font-weight:800;">
                <span>Total:</span><span>$${calcularTotal()}</span>
             </div>
             <p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">* El costo de envío se coordina con el local.</p>
             <button onclick="enviarWhatsApp()" class="btn-ver-carrito" style="width:100%; margin-top:10px;">🚀 Enviar WhatsApp</button></div>`;
    
    container.innerHTML = html;
}

function enviarWhatsApp() {
    if (!direccionEnvio.trim() === "") {
        alert("Por favor, ingresá una dirección para el envío.");
        document.getElementById('input-direccion').focus();
        return;
    }

    let msg = `*Pedido Chascomús Burger*\n`;
    msg += `*Local:* ${localActivo.nombre}\n`;
    msg += `*Cliente:* (Nombre)\n`;
    msg += `*Dirección:* ${direccionEnvio}\n`;
    msg += `---\n`;
    
    carrito.forEach(i => {
        msg += `• *${i.nombre}* ($${i.precio.toLocaleString('es-AR')})\n  [${i.notas}]\n\n`;
    });
    
    msg += `---\n*Total: $${calcularTotal()}*\n*Pago:* ${metodoPago}`;
    
    window.open(`https://wa.me/${localActivo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}

window.onload = renderLocales;
