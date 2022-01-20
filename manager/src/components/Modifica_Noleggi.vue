<template>
  <div id="app" style="height: 1000px">
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
        <p class="username">Cliente: {{ this.usernamecliente }}</p>
        <div class="center" style="text-align: center">
          <div class="form-group">
            <label for="prodotto">Prodotto</label>
            <input
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              readonly
              :value="this.prodotto_nome"
              @input="prodotto_nome = $event.target.value"
            />
          </div>
          <div class="form-group">
            <label for="prodottoCodice">Prodotto Codice</label>
            <input
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              :value="this.prodotto_codice"
              @input="prodotto_codice = $event.target.value"
            />
          </div>
          <div class="form-group">
            <label for="categoria">Categoria</label>
            <input
              type="text"
              class="form-control"
              style="width: 40%; margin: auto"
              readonly
              :value="this.categoria"
              @input="categoria = $event.target.value"
            />
          </div>
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
          <p class="dati_noleggio">
            Inizio Noleggio:<br /><input type="date" v-model="indate" />
          </p>
          <p class="dati_noleggio">
            Fine Noleggio:<br /><input type="date" v-model="fndate" />
          </p>
          <div class="dati_noleggio">
            <button class="logreg1" id="btnreg" @click="verifica_dispo">
              Verifica disponibilità</button
            ><br />
            <p>{{ messaggio }}</p>
            <div v-if="messaggio === 'Prodotto disponibile'">
                <button
                data-toggle="modal"
                data-target="#exampleModal"
                class="logreg1"
                id="btnreg"
                @click="add"
                >
                Invia
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="Modifica avvenuta con successo"
      aria-hidden="true"
      onClick="window.location.reload();"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header"></div>
          <div class="modal-body">
            {{ mess }}
          </div>
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
</template>


<script>
import axios from "axios";
import Nav from "./Nav.vue";
import manageSales from "./utilities/manageSales.js";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      items: [],
      messaggio: "",
      mess: "",
      usernamecliente: "",
      id_noleggio: "",
      prodotto_nome: "",
      prodotto_serie: "",
      prodotto_codice: "",
      prezzo: "",
      indate: "",
      fndate: "",
      old_product: "",
      old_codice: "",
      old_period: "",
      periodo_noleggio: "",
      categoria: "",
      mex: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    this.cliente_id = localStorage.getItem("cliente");
    this.id_noleggio = localStorage.getItem("id_noleggio");
    const params = {
      cod: this.id_noleggio,
    };
    axios.get("/getResbyId", { params }).then((response) => {
      const responseData = response.data;
      this.items = responseData;
      this.usernamecliente = this.items.usernamecliente;
      this.prodotto_serie = this.items.prodotto_serie;
      this.prodotto_nome = this.items.prodotto_nome;
      this.prodotto_codice = this.items.prodotto_codice;
      this.prezzo = this.items.prezzo;
      this.old_product = this.items.prodotto_serie;
      this.old_codice = this.items.prodotto_codice;
      this.indate = this.items.inizio_noleggio;
      this.fndate = this.items.fine_noleggio;
      this.categoria = this.items.categoria;
      this.old_period =
        this.items.inizio_noleggio + "," + this.items.fine_noleggio;
    });
  },
  methods: {
    getDates(startDate, endDate) {
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
    },
    async manageNolwCod(initdate, findate, prodotto, codice, vecchio_codice) {
      const params = {
        codiceprodotto: prodotto,
      };
      let p = await axios.get("/getProdById", { params });
      let prod = p.data
      console.log(prod)
      let old_data = this.old_period
      old_data = old_data.split(',');
      let old_data_in = old_data[0].split('-');
      let old_data_fin = old_data[1].split('-');
      old_data = this.getDates(new Date(old_data_in[0], old_data_in[1]-1, old_data_in[2]), new Date(old_data_fin[0], old_data_fin[1]-1, old_data_fin[2]));
      let occupato = false;
      let prezzo = 0;
      let cntrl = true;
      for (var e in prod.magazzino) {
        var data_in = initdate.split("-");
        var data_fin = findate.split("-");
        var data_richiesta = this.getDates(
          new Date(data_in[0], data_in[1] - 1, data_in[2]),
          new Date(data_fin[0], data_fin[1] - 1, data_fin[2])
        );
        if (prod.magazzino[e].codice == codice) {
            cntrl = false
          for (var d in prod.magazzino[e].nondisp) {
            var data_occ = prod.magazzino[e].nondisp[d].split(",");
            var data_occ_in = data_occ[0].split("-");
            var data_occ_fin = data_occ[1].split("-");
            var data_occupata = this.getDates(
              new Date(data_occ_in[0], data_occ_in[1] - 1, data_occ_in[2]),
              new Date(data_occ_fin[0], data_occ_fin[1] - 1, data_occ_fin[2])
            );

            for (var r in data_richiesta) {
              for (var o in data_occupata) {
                if (data_richiesta[r].toString() == data_occupata[o].toString() && ((JSON.stringify(old_data) != JSON.stringify(data_occupata) && codice == vecchio_codice) || (JSON.stringify(old_data) == JSON.stringify(data_occupata) && codice != vecchio_codice) || (JSON.stringify(old_data) != JSON.stringify(data_occupata) && codice != vecchio_codice) )) {
                  occupato = true;
                }
              }
            }
          }
            console.log(prod.sconti)
          if (prod.sconti[0] != undefined && prod.sconti.length != 0) {
            prezzo = manageSales(data_richiesta, prod.magazzino[e], prod);
          } else {
            prezzo =
              parseFloat(prod.magazzino[e].prezzo) * data_richiesta.length;
          }
        }
      }
      if(cntrl == true)
      {
        return [
          0,
          "Codice non esistente",
        ];
      }
      if (occupato == true) {
        return [
          prezzo,
          "Il prodotto è già occupato nelle date da lei inserite.",
        ];
      } else {
        return [prezzo, "Libero"];
      }
    },
    async verifica_dispo() {
      let cntrl = false;
      if (this.indate == "" || this.fndate == "") {
        this.messaggio = "Inserire entrambe le date";
        cntrl = true;
      }
      if (new Date(this.fndate) < new Date(this.indate)) {
        this.messaggio = "Inserire date valide";
        cntrl = true;
      }
      if (cntrl == false) {
        let results = [];
        results = await this.manageNolwCod(
          this.indate,
          this.fndate,
          this.prodotto_serie,
          this.prodotto_codice,
          this.old_codice,
        );
        let text = results[1];
        this.prezzo = parseFloat(results[0]).toFixed(2);
        console.log(text);
        if (text != "Libero") {
          this.messaggio = text;
        } else {
          this.messaggio = "Prodotto disponibile";
        }
        console.log(this.messaggio);
        this.prezzo = this.prezzo + "€";
      }
    },
    add() {
      this.periodo_noleggio = this.indate + "," + this.fndate;
      let newOrder = {
        old_product: this.old_product,
        old_code: this.old_codice,
        old_period: this.old_period,
        book_id: this.id_noleggio,
        price: this.prezzo,
        product_series: this.prodotto_serie,
        product_id: this.prodotto_codice,
        periodo_noleggio: this.periodo_noleggio,
        client: this.cliente,
        categoria: this.categoria,
      };
      console.log(newOrder);
      axios
        .post("/editBook_bo", newOrder)
        .then((response) => {
          if (response.status == 200) {
            this.mess = "Modifica avvenuta con successo";
            /* window.location.href = "/manager/noleggi_attivi"; */
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let book = {
        book_id: this.id_noleggio,
      };
      axios
        .post("/removeAnnotation", book)
        .then((response) => {
          if (response.status == 200) {
            console.log("Ok");
            this.mess = "Modifica avvenuta con successo";
            /* window.location.href = "/manager/noleggi_attivi"; */
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    go_back() {
      window.location.href = "/manager/noleggi_attivi";
    },
  },
};
</script>
<style>
input {
  text-align: center;
  width: 30%;
}
.alt {
  height: 50%;
}
.center {
  text-align: center;
  margin: auto;
}
</style>