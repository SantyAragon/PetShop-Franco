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
            carrouselTwo: [],

            // CARRITO
            idProductosEnCarrito: [],
            productosEnCarrito: [],
            productosEnStorage: [],

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
                this.carrouselActive = data.response.filter(producto => producto.tipo == "Juguete").slice(0, 3)
                this.carrouselOne = data.response.filter(producto => producto.tipo == "Juguete").slice(3, 6)
                this.carrouselTwo = data.response.filter(producto => producto.tipo == "Juguete").slice(6, 8)
                // console.log(this.carrouselActive)
                // console.log(this.carrouselOne)
                // console.log(this.carrouselTwo)
                this.filtrarProductos()
                this.filtrarPorPrecio()

                this.productosEnStorage = JSON.parse(localStorage.getItem("carrito"))

                if (this.productosEnStorage) {
                    this.productosEnCarrito = this.productosEnStorage
                }

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
            console.log(this.productosEnCarrito)
        },
        eliminarDelCarrito(producto) {
            this.productosEnCarrito = this.productosEnCarrito.filter(prod => prod._id != producto._id)
            this.productosEnStorage = this.productosEnCarrito
            localStorage.setItem("carrito",JSON.stringify(this.productosEnStorage))

        },
        comprarProductos() {
            this.productosEnCarrito.forEach(producto => {
                producto.stock -= 1
                this.comprasEnStorage.push(producto)
            })
            localStorage.setItem("compras", JSON.stringify(this.comprasEnStorage))
        },
    },
    computed: {
        actualizarCards() {
            this.filtrarPorPrecio()
        }
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