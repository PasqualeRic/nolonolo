<template>
  <div>
    <Nav />
    <div class="contenitore">
      <div class="grafici">
        <h3>Fatturato per oggetto</h3>
        <div
          aria-label="grafico a barre che mostra il ricavato totale per ogni singolo oggetto "
        >
          <Bar4 />
        </div>
      </div>
      <div class="grafici">
        <h3>Numero noleggi per oggetto</h3>
        <div
          aria-label="grafico a barre che mostra il numero totale di noleggi per ogni singolo oggetto "
        >
          <Bar3 />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import axios from 'axios'
import Bar4 from "./Bar4.vue";
import Bar3 from "./Bar3.vue";
import Nav from "./Nav.vue";

export default {
  name: "Grafici",
  components: {
    Bar4,
    Bar3,
    Nav,
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
};
</script>
<style >
.contenitore {
  margin: auto;
  text-align: center;
  width: 80%;
}
.grafici {
  margin: auto;
  width: 45%;
}
</style>

