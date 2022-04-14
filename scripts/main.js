Vue.createApp({
    data() {
      return {
          hideNav : true
  
      };
    },
    created() {
  
    },
  
    methods: {
      toggleNavOpen(){
         this.hideNav = false
  
      },
      toggleNavClose(){
        this.hideNav = true
  
     }
    },
  }).mount("#app");