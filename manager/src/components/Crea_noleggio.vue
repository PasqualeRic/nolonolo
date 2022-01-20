<template>
  <div id="app">
    <Nav />
    <h3>Crea noleggio</h3>
    <div
      class="tabella1"
      style="
        width: 40%;
        margin: auto;
        box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
        border-radius: 10px;
        padding: 10px;
      "
      aria-label="crea noleggio"
    >
      <div class="principale">
        <div class="dati_noleggio" aria-label="select utente">
          <label class="utente" for="user">Scegli l' utente:</label><br />
          <select
            name="user"
            v-model="utente"
            aria-label="scegli l'utente con cui creare il noleggio"
          >
            <option v-for="(item, index) in items" :key="index">
              {{ item._id }} {{ item.nome }} {{ item.cognome }}
            </option></select
          ><br />
        </div>
        <div class="dati_noleggio" aria-label="select prodotti">
          <label for="prodotto">Scegli il prodotto:</label><br />
          <select
            name="prodotto"
            v-model="prodotto"
            aria-label="scegli il prodotto con cui creare il noleggio"
          >
            <option v-for="(item, index) in prod" :key="index">
              {{ item._id }} {{ item.nome }}
            </option>
          </select>
        </div>
        <p class="dati_noleggio">
          Data inizio: <br /><input
            aria-label="inserisci la data di inizio noleggio"
            type="date"
            v-model="indate"
          />
        </p>
        <p class="dati_noleggio">
          Data fine: <br /><input
            aria-label="inserisci la data di fine noleggio"
            type="date"
            v-model="fndate"
          />
        </p>
        <p class="dati_noleggio">
          Data restituzione:<br />
          <input
            aria-label="inserisci la data di restituzione ma solo se il noleggio è terminato"
            type="date"
            v-model="data_res"
          />
        </p>
        <div class="dati_noleggio">
          <button @click="add()" class="logreg1" id="btnreg">
            Aggiungi noleggio
          </button>
          <div v-if="messaggio">
            <div class="overlay" id="pop">
              <div
                class="popup"
                style="border-radius: 4px; box-shadow: 3px 3px 2px #dedede"
              >
                <div style="height: 45%; text-align: center; margin: auto">
                  <p style="margin-top: 20px">{{ messaggio }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>{{ mex }}</p>
          </div>
        </div>
      </div>
    </div>
    <form></form>
  </div>
</template>
<script>
import axios from "axios";
import ManageNol from "./utilities/manageNol.js";
import Nav from "./Nav.vue";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      messaggio: "",
      mex: "",
      items: [],
      prod: [],
      error: "",
      indate: "",
      fndate: "",
      data_res: "",
      utente: "",
      prodotto: "",
      username: "",
      data_noleggio: "",
      data: [],
      nol: "",
      nomeCliente: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    axios
      .get("/getUsers")
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("/getProducts")
      .then((response) => {
        const responseData = response.data;
        this.prod = responseData;
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("/manager_test", {
        headers: { token: localStorage.getItem("token_manager") },
      })
      .then((res) => {
        this.username = res.data.user.username;
      });
  },
  methods: {
    add() {
      let cntrl;
      cntrl = false;
      if (new Date(this.indate) > new Date(this.fndate)) {
        this.mex = "Inserire date valide";
        cntrl = true;
      } else if (
        this.utente == "" ||
        this.prodotto == "" ||
        this.fndate == "" ||
        this.indate == ""
      ) {
        this.mex = "Inserire tutti i dati";
        cntrl = true;
      } else if (this.data_res == "" && new Date(this.fndate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        this.mex = "Inserire la data di restituzione per noleggi passati";
        cntrl = true;
      } else if (this.data_res != "" && new Date(this.data_res) < new Date(this.fndate)) {
        this.mex = "Inserire una data di restituzione valida";
        cntrl = true;
      }
      if (cntrl == false) {
        const params = {
          id: this.utente.substring(0, 24),
        };
        console.log(params);
        axios
          .get("/getUserbyId", { params })
          .then((response) => {
            const responseData = response.data;
            this.items = responseData;
            this.nomeCliente = this.items.username;
            console.log(this.nomeCliente);
            console.log(this.items);
            const params = {
              codiceprodotto: this.prodotto.substring(0, 24),
            };
            axios
              .get("/getProdbyId", { params })
              .then((response) => {
                const responseData = response.data;
                this.prod = responseData;
                let dati = ManageNol(this.indate, this.fndate, this.prod);
                if (dati == "nondisp") {
                  this.mex = "Prodotto non disponibile nelle date selezionate";
                  axios
                    .get("/getUsers")
                    .then((response) => {
                      const responseData = response.data;
                      this.items = responseData;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  axios
                    .get("/getProducts")
                    .then((response) => {
                      const responseData = response.data;
                      this.prod = responseData;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  console.log(dati);
                  this.mag = JSON.parse(
                    JSON.stringify(response.data.magazzino)
                  );
                  this.data_noleggio = this.indate + "," + this.fndate;
                  var data_att = new Date();
                  this.data = data_att.toISOString().substring(0, 10);
                  let newOrder;
                  newOrder = {
                    user: this.utente.substring(0, 24),
                    prodotto_nome: this.prod.nome,
                    usernamecliente: this.nomeCliente,
                    product_series: this.prod._id,
                    product_id: dati[2],
                    funzionario_noleggio: this.username,
                    funzionario_restituzione: this.username,
                    periodo_noleggio: this.data_noleggio,
                    data_restituzione: this.data_res,
                    prezzo: dati[1].toFixed(2),
                    categoria: this.prod.categoria,
                    annotazioni: "",
                  };
                  if (this.indate >= this.data) {
                    newOrder = {
                      user: this.utente.substring(0, 24),
                      prodotto_nome: this.prod.nome,
                      usernamecliente: this.nomeCliente,
                      product_series: this.prod._id,
                      product_id: dati[2],
                      funzionario_noleggio: "not_confirmed",
                      funzionario_restituzione: "not_confirmed",
                      periodo_noleggio: this.data_noleggio,
                      data_restituzione: "not_confirmed",
                      prezzo: dati[1].toFixed(2),
                      categoria: this.prod.categoria,
                      annotazioni: "",
                    };
                  } else if (this.indate <= this.data && this.fndate >= this.data
                  ) {
                    newOrder = {
                      user: this.utente.substring(0, 24),
                      prodotto_nome: this.prod.nome,
                      usernamecliente: this.nomeCliente,
                      product_series: this.prod._id,
                      product_id: dati[2],
                      funzionario_noleggio: this.username,
                      funzionario_restituzione: "not_confirmed",
                      periodo_noleggio: this.data_noleggio,
                      data_restituzione: "not_confirmed",
                      prezzo: dati[1].toFixed(2),
                      categoria: this.prod.categoria,
                      annotazioni: "",
                    };
                  }
                  console.log(newOrder);
                  axios
                    .post("/book", newOrder)
                    .then((response) => {
                      if (response.status == 200) {
                        this.messaggio =
                          "Noleggio creato con successo! verrai reindirizzato alla pagina dei noleggi tra qualche secondo";
                        setTimeout(function () {
                          window.location.href = "/manager/conferma_noleggi";
                        }, 1900);
                      }
                    })
                    .catch((error) => {
                      this.mex = "date non disponibili";
                      console.log(error);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
<style>
.utente {
  padding: 10px;
}
select {
  padding: 7px 40px 7px 12px;
  width: 100%;
  border: 1px solid #e8eaed;
  border-radius: 5px;
  background: white;
  box-shadow: 0 1px 3px #9098a9;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  transition: all 150ms ease;
  color: #5a667f;
  width: 50%;
}
.popup {
  width: 20%;
  height: 200px;
  background: #fefefe;
  margin: 10% auto;
  padding: 10px 20px;
  position: relative;
  color: #333;
}

.overlay {
  position: fixed; /* schermo intero*/
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* colore sfondo e opcità */
  text-align: center;
  display: block; /*cambiaremo in display: none*/
}
</style>
