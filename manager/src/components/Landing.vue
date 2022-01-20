<template>
  <div id="app">
    <Nav />
    <h3>Prodotti in vendita</h3>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Codice Prodotto</th>
            <th scope="col">Nome Prodotto</th>
            <th scope="col">Descrizione</th>
            <th scope="col">Categoria</th>
            <th scope="col">Magazzino</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            aria-label="tabella prodotti"
          >
            <th class="colore" scope="row">{{ item._id }}</th>
            <td>{{ item.nome }}</td>
            <td>{{ item.descrizione }}</td>
            <td>{{ item.categoria }}</td>
            <td>
              <table class="table table-hover">
                <tr>
                  <th class="colore" scope="col">Codice Magazzino</th>
                  <th class="colore" scope="col">Prezzo</th>
                  <th class="colore" scope="col">Condizione</th>
                </tr>
                <tr v-for="(mag, e) in item.magazzino" :key="e">
                  <th class="colore" scope="row">{{ mag.codice }}</th>
                  <td>{{ mag.prezzo }}</td>
                  <td>{{ mag.condizione }}</td>
                </tr>
              </table>
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
  name: "Landing",
  components: {
    Nav,
  },
  data() {
    return {
      mag: "",
      items: [],
    };
  },
  //user not authorizated
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    axios
      .get("/getProducts")
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
        this.mag = responseData.map((item) => item.magazzino);
        for (var k in this.mag) {
          for (var j in this.mag[k]) {
            for (var n in this.mag[k][j].nondisp) {
              if (this.mag[k][j].nondisp[n].substring(11, 21) == "2100-12-31") {
                this.riconoscimento.push(this.mag[k][j].codice);
                this.nondispo.push(this.mag[k][j].nondisp[n]);
              }
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/manager/login");
    },
  },
};
</script>

<style>
a {
  cursor: pointer;
}
.my-custom-scrollbar {
  width: 90%;
  margin: auto;
  text-align: center;
  position: relative;
  height: 500px;
  overflow: auto;
}
.table-wrapper-scroll-y {
  display: block;
}
.colore {
  background-color: #fafafa;
  font-weight: bold;
  color: black;
}
thead th {
  position: sticky;
  top: 0;
}
</style>