<template>
  <div id="app">
    <Nav />
    <div
      class="tabella1"
      style="
        width: 40%;
        margin: auto;
        box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
        border-radius: 10px;
        padding: 10px;
      "
    >
    <button
        style="
          float: left;
          border: none;
          cursor: pointer;
          background-color: transparent;
        "
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
      <div class="principale">
        <p style="font-weight: bold">Codice prodotto: {{ this.id }}</p>
      </div>
      <div class="secondario1">
          <div class="form-group">
            <label for="categoria">Nome Prodotto:</label>
            <input
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              :value="this.titolo"
              @input="titolo = $event.target.value"
            />
          </div>
        <div class="form-group">
            <label for="categoria">Categoria</label>
            <input
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              :value="this.categoria"
              @input="categoria = $event.target.value"
            />
          </div>
      </div>
      <div class="principale">
        <p style="font-weight: bold">Codice magazzino:{{ this.codice }}</p>
        <div class="secondario1">
          <div class="form-group">
            <label for="prezzo">Prezzo</label>
            <input
              aria-label="inserisci il prezzo"
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              :value="this.prezzo"
              @input="prezzo = $event.target.value"
            />
          </div>
          <div class="dati_noleggio" aria-label="select prodotti">
            <label for="prodotto">Condizioni:</label><br />
            <select
              name="prodotto"
              :value="this.condizione"
              @input="condizione = $event.target.value"
              aria-label="scegli il prodotto con cui creare il noleggio"
            >
              <option>Ottime condizioni</option>
              <option>Buone condizioni</option>
              <option>Pessime condizioni</option>
            </select>
          </div>
          <p class="dati1">
            Rendi indisponibile da: <br /><input
              class="input_mod"
              type="date"
              v-model="indate"
            />
          </p>
        </div>
      </div>
      <button
        data-toggle="modal"
        data-target="#exampleModal"
        @click="add(codice, id)"
        class="logreg1"
        id="btnreg"
      >
        Invia
      </button>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="Utente eliminato con successo"
        aria-hidden="true"
        onClick="window.location.reload();"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header"></div>
            <div class="modal-body">{{ messaggio1 }}{{ messaggio2 }}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick="window.location.reload();"
                style="background-color: #00a0e0"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
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
      k: "",
      titolo: "",
      id: "",
      categoria: "",
      prezzo: "",
      condizione: "",
      item: "",
      indate: "",
      fndate: "",
      vecchio_titolo: "",
      vecchia_categoria: "",
      vecchio_prezzo: "",
      vecchia_condizione: "",
      codice: "",
      messaggio1: "",
      messaggio2: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    this.prod = localStorage.getItem("prodotto_id");
    this.prodotto_codice = localStorage.getItem("prodotto_codice");
    const params = {
      codiceprodotto: this.prod,
    };
    axios
      .get("/getProdbyId", { params })
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
        this.id = this.items._id;
        this.titolo = this.items.nome;
        this.categoria = this.items.categoria;
        this.condizione = this.items.condizione;
        this.vecchio_titolo = this.items.nome;
        this.item = JSON.parse(JSON.stringify(response.data.magazzino));
        for (var el in this.item) {
          if (this.prodotto_codice == this.item[el].codice) {
            this.prezzo = this.item[el].prezzo;
            this.condizione = this.item[el].condizione;
            this.codice = this.item[el].codice;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    add(c_prodotto, s_prodotto) {
    function checkDate(initnondisp, finnondisp, initdate, findate) {
        function getDates(startDate, endDate) {
          const dates = [];
          let currentDate = startDate;
          const addDays = function (days) {
            const date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };
          while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
          }
          return dates;
        }
        var data_in = initdate.split("-");
        var data_fin;
        if (findate.length > 0) {
          data_fin = findate.split("-");
        } else {
          data_fin = "2100-12-31".split("-");
        }
        var data_richiesta = getDates(
          new Date(data_in[0], data_in[1] - 1, data_in[2]),
          new Date(data_fin[0], data_fin[1] - 1, data_fin[2])
        );
        var data_occ_in = initnondisp.split("-");
        var data_occ_fin = finnondisp.split("-");
        var data_occupata = getDates(
          new Date(data_occ_in[0], data_occ_in[1] - 1, data_occ_in[2]),
          new Date(data_occ_fin[0], data_occ_fin[1] - 1, data_occ_fin[2])
        );
        for (var r in data_richiesta) {
          for (var o in data_occupata) {
            if (data_richiesta[r].toString() == data_occupata[o].toString()) {
              return true;
            }
          }
        }
      }
      let prodotti = {
        ident: this.vecchio_titolo,
        nome: this.titolo,
        categoria: this.categoria,
        codice: this.codice,
        prezzo: this.prezzo,
        condizione: this.condizione,
        indate: this.indate,
        fndate: this.fndate,
      };

    axios.post("/editProduct", prodotti).then((res) => {
        if (res.status == 200) {
          console.log("Ok");
        }
      });
      const params = {
        product_series: s_prodotto,
        product_code: c_prodotto,
      };
      axios
        .get("/getReservationsByProd", { params })
        .then((response) => {
          let reservations = [];
          let prices = [];
          const responseData = response.data;
          for (var i in responseData) {
            if (
              checkDate(
                responseData[i].inizio_noleggio,
                responseData[i].fine_noleggio,
                this.indate,
                this.fndate
              )
            ) {
              reservations.push(responseData[i]._id);
              prices.push(responseData[i].prezzo);
              localStorage.setItem("prezzo_modifica", prices);
              this.messaggio1 = this.messaggio1 + "," + responseData[i]._id;
              this.messaggio2 =
                " questi noleggi prevedevano il prodotto reso indisponibile, ricordati di aggiungere il nuovo prodotto e modificare i noleggi elencati.";
            }
          }
          if (reservations.length > 0) {
            let prova = {
              res: reservations,
              prices: prices,
            };
            axios.post("/addAnnotation_manager", prova)
              .then((response) => {
                if (response.status == 200) {
                  console.log("update");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.messaggio2 = "Modifica avvenuta con successo ";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    go_back() {
      window.location.href = "/manager/prodotti";
    },
  },
};
</script>
<style>
.input_mod {
  height: 300%;
  text-align: center;
}
</style>