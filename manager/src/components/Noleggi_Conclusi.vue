<template>
  <div id="app">
    <Nav />
    <h1>Tabella Noleggi conclusi</h1>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col">Prodotto</th>
            <th scope="col">Numero Codice Prodotto</th>
            <th scope="col">Funzionario</th>
            <th scope="col">Categoria</th>
            <th scope="col">Prezzo</th>
            <th scope="col">Data Inizio Noleggio</th>
            <th scope="col">Data Fine Noleggio</th>
            <th scope="col">Data Restituzione</th>
            <th scope="col">Fattura</th>
          </tr>
        </thead>
        <tbody
          v-for="(item, index) in items"
          :key="index"
          class="principale"
          aria-label="tabella noleggi conclusi"
        >
          <tr
            v-if="item.effettiva_restituzione <= data && item.fattura === true"
          >
            <th class="colore" scope="row">{{ item.usernamecliente }}</th>
            <td>{{ item.prodotto_nome }}</td>
            <td>{{ item.prodotto_codice }}</td>
            <td>{{ item.funzionario_noleggio }}</td>
            <td>{{ item.categoria }}</td>
            <td>{{ item.prezzo }}</td>
            <td>{{ item.inizio_noleggio }}</td>
            <td>{{ item.fine_noleggio }}</td>
            <td>{{ item.effettiva_restituzione }}</td>
            <td>
              <button class="logreg1" id="btnreg" @click="fattura(item._id)">
                Fattura
              </button>
            </td>
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
      data: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    var data_att = new Date();
    this.data = data_att.toISOString().substring(0, 10);
    axios
      .get("/getReservations")
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
        console.log(this.items);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    fattura(id) {
      localStorage.setItem("id_ordine", id);
      this.$router.push("/manager/fattura");
    },
  },
};
</script>