// Eliminamos el ítem "compra-pendiente" del localStorage
localStorage.removeItem("compra-pendiente");

let productos = [];

// Cargamos los productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

// Definimos las variables que vamos a usar
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

const ordenarPrecio = document.querySelector("#ordenar-precio");
const precioMin = document.querySelector("#precio-min");
const precioMax = document.querySelector("#precio-max");
const talle = document.querySelector("#talle");
const color = document.querySelector("#color");
const botonFiltrar = document.querySelector("#aplicar-filtros");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Cargamos los productos a la página
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">Bs ${producto.precio}</p>
                <p class="producto-color">ML: ${producto.ML}</p>
            
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

// Filtramos los productos por categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria ? productoCategoria.categoria.nombre : "Categoría desconocida";
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// Actualizamos los botones de "Agregar al carrito" después de cargar los productos
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito = [];
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
}

// Agregamos productos al carrito
function agregarAlCarrito(e) {
    Toastify({
        text: '<i class="bi bi-check-circle"></i>&nbsp; Producto agregado',
        duration: 2000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        escapeMarkup: false,
        style: {
            background: "linear-gradient(to right, #5a3e36, #af662e)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem",
            color: "#f5f5dc",
            display: "flex",
            alignItems: "center"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Actualizamos el contador de productos en el carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

/* Funcionalidad de filtros */

// Definimos variables para el apartado de filtros
const toggleFiltros = document.querySelector("#toggle-filtros");
const toggleFiltrosText = document.querySelector("#toggle-filtros-text");
const filtros = document.querySelector("#filtros");

// Animación para mostrar/ocultar filtros
toggleFiltros.addEventListener("click", () => {
    filtros.classList.toggle("oculto");
    if (filtros.classList.contains("oculto")) {
        toggleFiltrosText.textContent = "Mostrar Filtros";
        toggleFiltros.innerHTML = '<i class="bi bi-funnel"></i> Mostrar Filtros';
    } else {
        toggleFiltrosText.textContent = "Ocultar Filtros";
        toggleFiltros.innerHTML = '<i class="bi bi-funnel"></i> Ocultar Filtros';
    }
});

document.querySelector("#aplicar-filtros").addEventListener("click", aplicarFiltros);

// Función para aplicar filtros
function aplicarFiltros() {
    const min = parseFloat(precioMin.value) || 0;
    const max = parseFloat(precioMax.value) || Infinity;
    const talleSeleccionado = talle.value;
    const colorSeleccionado = color.value;
    const ordenSeleccionado = ordenarPrecio.value;

    let productosFiltrados = productos.filter(producto => {
        const cumplePrecio = producto.precio >= min && producto.precio <= max;
        const cumpleTalle = talleSeleccionado === "" || producto.talles.includes(talleSeleccionado);
        const cumpleColor = colorSeleccionado === "" || producto.color === colorSeleccionado;
        return cumplePrecio && cumpleTalle && cumpleColor;
    });

    if (ordenSeleccionado === "menor") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenSeleccionado === "mayor") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }
    cargarProductos(productosFiltrados);
}

/* Funcionalidad de búsqueda */
const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

// Función para buscar productos
function buscarProductos() {
    const searchTerm = searchBar.value.toLowerCase();

    // Filtrar productos según el término de búsqueda
    const productosFiltrados = productos.filter(producto => {
        return producto.titulo.toLowerCase().includes(searchTerm);
    });

    if (productosFiltrados.length > 0) {
        cargarProductos(productosFiltrados);
    } else {
        contenedorProductos.innerHTML = "<p class='mensaje-error'>Producto no encontrado</p>";
    }
}

// Evento del botón de búsqueda
searchButton.addEventListener('click', buscarProductos);

// Buscar también al presionar "Enter" en la barra de búsqueda
searchBar.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        buscarProductos();
    }
});
