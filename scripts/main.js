Vue.createApp({
    data() {
        return {
            hideNav: true,
            allProducts: [],
            productosFarmacia: [],
            productosJuguetes: [],

            // MENOR A MAYOR EN PRECIO Y VICEVERSA
            productosOrdenadosFarmacia: [],
            productosOrdenadosJuguetes: [],
            filtroPrecio: "all",

            //Carrousel
            carrouselActive: [],
            carrouselOne: [],
            carrouselPharmacyActive: [],
            carrouselPharmacyOne: [],

            // CARRITO
            idProductosEnCarrito: [],
            productosEnCarrito: [],
            productosEnStorage: [],
            precio: [],
            precioTotal: 0,

            comprasEnStorage: [],
            cantidad: 0,
        };
    },
    created() {
        fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(response => response.json())
            .then(data => {
                // console.log(data.response)

                this.allProducts = data.response
                this.carrouselActive = data.response.filter(producto => producto.tipo == "Juguete").slice(0, 4)
                this.carrouselOne = data.response.filter(producto => producto.tipo == "Juguete").slice(4, 8)
                this.carrouselPharmacyActive = data.response.filter(producto => producto.tipo == "Medicamento").slice(0, 4)
                this.carrouselPharmacyOne = data.response.filter(producto => producto.tipo == "Medicamento").slice(4, 8)
                this.filtrarProductos()
                this.filtrarPorPrecio()

                this.productosEnStorage = JSON.parse(localStorage.getItem("carrito"))

                if (this.productosEnStorage) {
                    this.productosEnCarrito = this.productosEnStorage
                }
                this.PrecioCarrito();
                this.productosComprados = JSON.parse(localStorage.getItem("compras"))

            })

    },

    methods: {
        toggleNavOpen() {
            this.hideNav = false

        },
        toggleNavClose() {
            this.hideNav = true
        },
        filtrarProductos() {
            this.productosFarmacia = this.allProducts.filter(producto => producto.tipo == "Medicamento")
            this.productosJuguetes = this.allProducts.filter(producto => producto.tipo == "Juguete")
        },

        filtrarPorPrecio() {
            if (this.filtroPrecio == "all") {
                this.productosOrdenadosFarmacia = this.allProducts.filter(producto => producto.tipo == "Medicamento")
                this.productosOrdenadosJuguetes = this.allProducts.filter(producto => producto.tipo == "Juguete")
            } else if (this.filtroPrecio == "Mayor a Menor") {
                this.productosOrdenadosFarmacia = this.productosFarmacia.sort((a, b) => a.precio - b.precio)
                this.productosOrdenadosJuguetes = this.productosJuguetes.sort((a, b) => a.precio - b.precio)
            } else if (this.filtroPrecio == "Menor a Mayor") {
                this.productosOrdenadosFarmacia = this.productosFarmacia.sort((a, b) => b.precio - a.precio)
                this.productosOrdenadosJuguetes = this.productosJuguetes.sort((a, b) => b.precio - a.precio)
            } else if (this.filtroPrecio == "desde500") {
                this.productosOrdenadosFarmacia = this.productosFarmacia.filter(producto => producto.precio >= 500).sort((a, b) => a.precio - b.precio)
                this.productosOrdenadosJuguetes = this.productosJuguetes.filter(producto => producto.precio >= 500).sort((a, b) => a.precio - b.precio)
            } else if (this.filtroPrecio == "hasta500") {
                this.productosOrdenadosFarmacia = this.productosFarmacia.filter(producto => producto.precio < 500).sort((a, b) => a.precio - b.precio)
                this.productosOrdenadosJuguetes = this.productosJuguetes.filter(producto => producto.precio < 500).sort((a, b) => a.precio - b.precio)
            }
        },

        añadirAlCarrito(producto) {
            this.idProductosEnCarrito = this.productosEnCarrito.map(producto => producto._id)

            if (producto.stock > 0) {
                this.productosEnCarrito.push(producto)

                localStorage.setItem("carrito", JSON.stringify(this.productosEnCarrito))

            }

            Swal.fire('Añadido al carrito')
            console.log(this.productosEnCarrito)
        },
        eliminarDelCarrito(producto) {
            this.productosEnCarrito = this.productosEnCarrito.filter(prod => prod._id != producto._id)
            this.productosEnStorage = this.productosEnCarrito
            localStorage.setItem("carrito", JSON.stringify(this.productosEnStorage))
            Swal.fire('Eliminado del Carrito')

        },
        comprarProductos() {
            this.productosEnCarrito.forEach(producto => {
                producto.stock -= 1
                this.comprasEnStorage.push(producto)
            })
            localStorage.setItem("compras", JSON.stringify(this.comprasEnStorage))

            Swal.fire({
                title: 'Muchas gracias por su compra!',
                width: 600,
                imageUrl: '../assets/gatito.png',
                imageHeight: 250,
                color: '#7a3d8b',
                background: '#fc5b5b',
                backdrop: `
              rgba(0,0,123,0.4)
              url("../assets/coffeti.png")
              top
              no-repeat
            `,

            })

        },
        PrecioCarrito() {
            if (this.productosEnCarrito.length > 0) {
                this.precio = this.productosEnCarrito.map(producto=> producto.precio)
                this.precioTotal = this.precio.reduce((a, b) => a + b, 0)

            } else {
                this.precioTotal = 0
            }
        },
    },
    computed: {
        actualizarCards() {
            this.filtrarPorPrecio()
            this.PrecioCarrito()
        },


    }
}).mount("#app");

if (document.URL.includes("contactenos")) {

    const BTN1 = document.querySelector("#BTN1")

    BTN1.addEventListener("click", function (event) {
        event.preventDefault()

        Swal.fire({
            title: 'Gracias por enviarnos un mensaje! responderemos a la brevedad.',
            width: 600,
            icon: 'success',
            imageUrl: '../assets/perrito.png',
            imageHeight: 250,
            color: '#7a3d8b',
            background: '#fc5b5b',
            backdrop: `
          rgba(0,0,123,0.4)
          url("../assets/pngegg.png")
          left bottom
          no-repeat
        `,

        })


    });
}