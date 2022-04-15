Vue.createApp({
    data() {
        return {
            hideNav: true,
            allProducts: [],
            productosFarmacia: [],
            productosJuguetes: [],

        };
    },
    created() {
        fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(response => response.json())
            .then(data => {
                console.log(data.response)

                this.allProducts = data.response
                this.filtrarProductos()
                console.log(this.productosFarmacia)
                console.log(this.productosJuguetes)
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

    },
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