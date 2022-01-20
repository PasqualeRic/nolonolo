<template>
  <div>
    <Nav />
    <div class="contenitore">
      <div class="grafici">
        <h3>Saldo fatture per categoria</h3>
        <div
          aria-label="grafico a barre che mostra il ricavato totale per ogni categoria di prodotti"
        >
          <Bar5 />
        </div>
      </div>
      <div class="grafici">
        <h3>Numero noleggi effettuati per categoria</h3>
        <div
          aria-label="grafico a torta che mostra il numero di noleggi effettuati per ogni categoria di prodotti"
        >
          <Doughnut />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import axios from 'axios'
import Bar5 from "./Bar5.vue";
import Doughnut from "./Doughnut.vue";
import Nav from "./Nav.vue";

export default {
  name: "Grafici",
  components: {
    Bar5,
    Doughnut,
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

