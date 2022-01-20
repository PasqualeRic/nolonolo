<template>
  <div id="app">
    <Nav />
    <h1>Storico ordini cliente</h1>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Codice Noleggio</th>
            <th scope="col">Cliente</th>
            <th scope="col">Prodotto</th>
            <th scope="col">Numero Codice Prodotto</th>
            <th scope="col">Funzionario</th>
            <th scope="col">Prezzo</th>
            <th scope="col">Categoria</th>
            <th scope="col">Data Inizio Noleggio</th>
            <th scope="col">Data Fine Noleggio</th>
            <th scope="col">Data Restituzione</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            aria-label="tabella noleggi cliente"
          >
            <th class="colore" scope="row">{{ item._id }}</th>
            <td>{{ item.usernamecliente }}</td>
            <td>{{ item.prodotto_nome }}</td>
            <td>{{ item.prodotto_codice }}</td>
            <td>{{ item.funzionario_noleggio }}</td>
            <td>{{ item.prezzo }}</td>
            <td>{{ item.categoria }}</td>
            <td>{{ item.inizio_noleggio }}</td>
            <td>{{ item.fine_noleggio }}</td>
            <td>{{ item.effettiva_restituzione }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Nav from "./Nav.vue";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      items: [],
      nome: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    var id_cliente = localStorage.getItem("id_cliente");
    const params = {
      user: id_cliente,
    };
    axios
      .get("/getOrdersByClient", { params })
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.auth-inner {
  margin: auto;
  width: 100%;
}
.my-grid-class {
  height: 400px;
}
</style>