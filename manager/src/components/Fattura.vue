<template>
  <div id="app">
    <Nav />
    <div class="bill">
      <div class="bill_row">
        <button
          style="border: none; cursor: pointer; background-color: transparent"
          @click="go_back()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </button>
        <h3>NoloNolo+</h3>
        <h2>FATTURA</h2>
      </div>
      <div class="bill_row_tables">
        <div class="nolo_info">
          <p>nolonolosrl</p>
          <p>Bologna</p>
          <p>Via Zamboni</p>
        </div>
        <div class="info_bill">
          <table>
            <tr>
              <th>FATTURA N.</th>
              <th>DATA</th>
            </tr>
            <tr>
              <td>{{ items._id }}</td>
              <td>{{ items.data_creazione }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>ID CLIENTE</th>
              <th>USERNAME</th>
            </tr>
            <tr>
              <td>{{ items.id_cliente }}</td>
              <td>{{ items.us_cliente }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>ID FUNZIONARIO</th>
            </tr>
            <tr>
              <td>{{ items.funzionario }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="bill_body">
        <table>
          <tr>
            <th>DESCRIZIONE</th>
            <th>PERIODO</th>
            <th>IMPORTO</th>
          </tr>
          <tr>
            <td>(COD:{{ items.prodotto }}){{ items.nome_prodotto }}</td>
            <td>{{ items.periodo_noleggio }}</td>
            <td>{{ items.subtotale }}</td>
          </tr>
        </table>
      </div>
      <div class="price_handle">
        <table>
          <tr>
            <th>SUBTOTALE</th>
            <td>{{ items.subtotale }}</td>
          </tr>
          <tr>
            <th>SCONTI</th>
            <td>{{ k }}</td>
          </tr>
          <tr>
            <th>PENALE</th>
            <td>{{ items.penale }}</td>
          </tr>
          <tr>
            <th>TOTALE</th>
            <td>{{ items.totale }}</td>
          </tr>
        </table>
      </div>
      <p id="thx">Grazie per averci scelto!</p>
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
      items: "",
      sconti: [],
      k: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    this.id_ = localStorage.getItem("id_ordine");
    const params = {
      id: this.id_,
    };
    axios
      .get("/getBillbyId", { params })
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
        this.sconti = this.items.sconti;
        for (var i in this.items.sconti) {
          this.k = this.k + this.items.sconti[i];
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    go_back() {
      window.location.href = "/manager/noleggi_conclusi";
    },
  },
};
</script>
<style>
.bill {
  width: 650px;
  margin: auto;
  height: 600px;
  box-shadow: 0px 2px 4px rgb(0 0 0 / 10%), 0px 8px 16px rgb(0 0 0 / 10%),
    0px 2px 4px rgb(0 0 0 / 10%), 0px 2px 4px rgb(0 0 0 / 10%);
  margin-top: 50px;
}

.bill_row {
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}

.bill_row_tables {
  display: grid;
  grid-template-areas: "left right";
  grid-template-columns: 30% 70%;
  padding: 10px;
}

.nolo_info {
  line-height: 0.4;
  padding: 10px;
}

.info_bill table {
  width: 100%;
  margin-bottom: 10px;
}

th {
  background-color: #00a0e0;
  color: white;
}

.bill_body {
  padding: 10px;
}

.bill_body table {
  width: 100%;
}

.price_handle {
  padding: 10px;
  float: right;
}

td {
  background-color: #fafafa;
}

#thx {
  margin-left: 10px;
  font-style: italic;
  color: #00a0e0;
}
</style>