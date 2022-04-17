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
            productoCarrito: {},
            precio: [],
            precioTotal: 0,
            totalEnCarrito: 0,

            comprasEnStorage: [],
            cantidad: 0,
        };
    },
    created() {
        fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(response => response.json())
            .then(data => {
                // console.log(data.response)
                //guardo lo que me devuelve la api en una propiedad.
                this.allProducts = data.response

                this.carrouselActive = data.response.filter(producto => producto.tipo == "Juguete").slice(0, 4)
                this.carrouselOne = data.response.filter(producto => producto.tipo == "Juguete").slice(4, 8)
                this.carrouselPharmacyActive = data.response.filter(producto => producto.tipo == "Medicamento").slice(0, 4)
                this.carrouselPharmacyOne = data.response.filter(producto => producto.tipo == "Medicamento").slice(4, 8)
               
                //filtro lo recibido para separar por tipo.
                this.filtrarProductos()
                this.filtrarPorPrecio()

                //capturo el carrito guardado en storage
                this.productosEnStorage = JSON.parse(localStorage.getItem("carrito"))

                // si capturó algo, lo asigno en la propiedad productos en carrito y sumo su valor y cantidad
                if (this.productosEnStorage) {
                    this.productosEnCarrito = this.productosEnStorage
                }
                this.PrecioCarrito();
                this.totalEnCarrito = this.productosEnCarrito.map(prod => prod.cantidad).reduce((a, b) => a + b, 0)
                // capturo las compras realizadas en local storage (en proceso)
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
            //
            this.idProductosEnCarrito = this.productosEnCarrito.map(producto => producto._id)
            //PRODUCTO CARRITO ES UN NUEVO PRODUCTO DE TIPO OBJETO DENTRO DEL CARRITO
            this.productoCarrito = this.productosEnCarrito.filter(prod => producto._id == prod._id)[0]

            // SI YA EXISTE EL PRODUCTO, LE INCREMENTO A CANTIDAD (DENTRO DEL CARRITO)
            if (this.productoCarrito != undefined) {
                this.productoCarrito.cantidad++;
            }
            // SI NO EXISTE EL PRODUCTO, INICIALIZO EL OBJETO CON LOS VALORES DEL PRODUCTO QUE VIENE DE PARAMETRO
            else {
                this.productoCarrito = {
                    _id: producto._id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    cantidad: 1
                };
                // AGREGO EL OBJETO AL ARRAY DE PRODUCTOS
                this.productosEnCarrito.push(this.productoCarrito);
            }
            // CALCULA EL TOTAL DE PRODUCTOS CON LA PROP CANTIDAD DENTRO DEL ARRAY DE PRODUCTOS 
            this.totalEnCarrito = this.productosEnCarrito.map(prod => prod.cantidad).reduce((a, b) => a + b, 0)

            // AGREGA EL NUEVO ARRAY PRODUCTOS EN CARRITO AL LOCAL STORAGE
            localStorage.setItem("carrito", JSON.stringify(this.productosEnCarrito))
            //NOTIFICACION DE AÑADIDO AL CARRITO
            Swal.fire('Añadido al carrito')
        },
        //FUNCION QUE ELIMINA PRODUCTO DEL CARRITO
        eliminarDelCarrito(producto) {
            // SI EL OBJETO PRODUCTO TIENE CANTIDAD MAYOR A 1, SE DECREMENTA UNO.
            if (producto.cantidad > 1) {
                producto.cantidad--
            }
            // SINO, SE ELIMINA ESE OBJETO DEL ARRAY DE PRODUCTOS FILTRANDO LOS DISTINTOS AL SELECCIONADO
            else {
                this.productosEnCarrito = this.productosEnCarrito.filter(prod => prod._id != producto._id)
            }
            // ACA SE VUELVE A CALCULAR EL TOTAL DE PRODUCTOS QUE QUEDARON EN EL CARRITO
            this.totalEnCarrito = this.productosEnCarrito.map(prod => prod.cantidad).reduce((a, b) => a + b, 0)


            // SE ACTUALIZA EL LOCAL STORAGE CON EL ARRAY MODIFICADO SI FUESE EL CASO
            this.productosEnStorage = this.productosEnCarrito
            localStorage.setItem("carrito", JSON.stringify(this.productosEnStorage))

            //NOTIFICACION DE ELIMINADO DEL CARRITO
            Swal.fire('Eliminado del Carrito')
        },
        comprarProductos() {
            //RECORRE EL ARRAY DE PRODUCTOS EN EL CARRITO Y AGREGA AL ARRAY COMPRAS EN LOC STORAGE
            this.productosEnCarrito.forEach(producto => {
                // producto.stock -= 1
                this.comprasEnStorage.push(producto)
            })
            // SE VACIA EL ARRAY DE PRODUCTOS EN CARRITO Y SE ACTUALIZA LA CANTIDAD DE ITEMS DENTRO DEL CARRITO

            this.productosEnCarrito = []
            this.totalEnCarrito = this.productosEnCarrito.map(prod => prod.cantidad).reduce((a, b) => a + b, 0)
            // SE SOBRESCRIBE EL ARRAY DE LOS PRODUCTOS EN CARRITO EN LOCAL STORAGE

            localStorage.setItem("carrito", JSON.stringify(this.productosEnCarrito))
            // localStorage.setItem("compras", JSON.stringify(this.comprasEnStorage))

            // NOTIFICACION POR REALIZAR COMPRA
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
                this.precio = this.productosEnCarrito.map(producto => producto.precio * producto.cantidad)
                this.precioTotal = this.precio.reduce((a, b) => a + b, 0)

            } else {
                this.precioTotal = 0
            }
        },
        vaciarCarrito() {
            //VACIO EL ARRAY DE PRODUCTOS, CALCULO EL TOTAL EN CARRITO Y ACTUALIZO EL LOCAL STORAGE
            this.productosEnCarrito = []
            this.totalEnCarrito = this.productosEnCarrito.map(prod => prod.cantidad).reduce((a, b) => a + b, 0)
            localStorage.setItem("carrito", JSON.stringify(this.productosEnCarrito))
            Swal.fire('Se ha vaciado el carrito con exito')
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