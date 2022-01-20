<template>
  <div>
    <Nav />
    <div class="contenitore">
      <div class="grafici">
        <h3>Saldo fatture per clienti</h3>
        <div
          aria-label="grafico a barre che mostra il ricavato totale per ogni cliente"
        >
          <Bar />
        </div>
      </div>
      <div class="grafici">
        <h3>Numero noleggi per clienti</h3>
        <div
          aria-label="grafico a barre che mostra il numero totale di noleggi per ogni cliente"
        >
          <Bar2 />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import axios from 'axios'
import Bar from "./Bar.vue";
import Bar2 from "./Bar2.vue";
import Nav from "./Nav.vue";

export default {
  name: "Grafici",
  components: {
    Bar,
    Bar2,
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

