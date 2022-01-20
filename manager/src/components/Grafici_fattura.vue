<template>
  <div>
    <Nav />
    <div class="contenitore">
      <div class="grafici">
        <h3>Andamento fatture</h3>
        <div
          aria-label="grafico a linea che mostra l'andatmento delle fatture nelle varie date"
        >
          <LineChart1 />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import axios from 'axios'
import LineChart1 from "./Line1.vue";
import Nav from "./Nav.vue";

export default {
  name: "Grafici",
  components: {
    LineChart1,
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

