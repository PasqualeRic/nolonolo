<template>
  <div id="app">
    <Nav />
    <h1>Conferma noleggi e restituzioni</h1>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col">Prodotto</th>
            <th scope="col">Numero Codice Prodotto</th>
            <th scope="col">Funzionario</th>
            <th scope="col">Prezzo</th>
            <th scope="col">Data Inizio Noleggio</th>
            <th scope="col">Data Fine Noleggio</th>
            <th scope="col">Data Restituzione</th>
            <th scope="col">Stato ordine</th>
          </tr>
        </thead>
        <tbody
          v-for="(item, index) in items"
          :key="index"
          class="principale"
          aria-label="noleggio"
        >
          <template
            v-if="
              new Date(item.inizio_noleggio) <= new Date() ||
              item.inizio_noleggio === item.fine_noleggio
            "
          >
            <template v-if="item.funzionario_noleggio != 'not_confirmed'">
              <template v-if="item.effettiva_restituzione != 'not_confirmed'">
                <template
                  v-if="item.funzionario_restituzione != 'not_confirmed'"
                >
                  <template v-if="item.fattura != true">
                    <tr>
                      <th class="colore" scope="row">
                        {{ item.usernamecliente }}
                      </th>
                      <td>{{ item.prodotto_nome }}</td>
                      <td>{{ item.prodotto_codice }}</td>
                      <td>{{ item.funzionario_noleggio }}</td>
                      <td>{{ item.prezzo }}</td>
                      <td>{{ item.inizio_noleggio }}</td>
                      <td>{{ item.fine_noleggio }}</td>
                      <td>{{ item.effettiva_restituzione }}</td>
                      <td>
                        <button
                          data-toggle="modal"
                          data-target="#exampleModal"
                          class="logreg1"
                          id="btnreg"
                          @click="
                            crea_fattura(
                              item._id,
                              item.cliente,
                              item.prodotto_serie
                            )
                          "
                        >
                          Crea fattura
                        </button>
                      </td>
                    </tr>
                  </template>
                </template>
                <template v-else>
                  <tr>
                    <th class="colore" scope="row">
                      {{ item.usernamecliente }}
                    </th>
                    <td>{{ item.prodotto_nome }}</td>
                    <td>{{ item.prodotto_codice }}</td>
                    <td>{{ item.funzionario_noleggio }}</td>
                    <td>{{ item.prezzo }}</td>
                    <td>{{ item.inizio_noleggio }}</td>
                    <td>{{ item.fine_noleggio }}</td>
                    <td>{{ item.effettiva_restituzione }}</td>
                    <td>
                      <button
                        class="logreg1"
                        id="btnreg"
                        @click="conferma_restituzione(item._id)"
                      >
                        Conferma Restituzione
                      </button>
                    </td>
                  </tr>
                </template>
              </template>
              <template v-else>
                <tr>
                  <th class="colore" scope="row">{{ item.usernamecliente }}</th>
                  <td>{{ item.prodotto_nome }}</td>
                  <td>{{ item.prodotto_codice }}</td>
                  <td>{{ item.funzionario_noleggio }}</td>
                  <td>{{ item.prezzo }}</td>
                  <td>{{ item.inizio_noleggio }}</td>
                  <td>{{ item.fine_noleggio }}</td>
                  <td>{{ item.effettiva_restituzione }}</td>
                  <td>In corso...</td>
                </tr>
              </template>
            </template>
            <template v-else>
              <tr>
                <th class="colore" scope="row">{{ item.usernamecliente }}</th>
                <td>{{ item.prodotto_nome }}</td>
                <td>{{ item.prodotto_codice }}</td>
                <td>{{ item.funzionario_noleggio }}</td>
                <td>{{ item.prezzo }}</td>
                <td>{{ item.inizio_noleggio }}</td>
                <td>{{ item.fine_noleggio }}</td>
                <td>{{ item.effettiva_restituzione }}</td>
                <td>
                  <button
                    class="logreg1"
                    id="btnreg"
                    @click="conferma_ordine(item._id)"
                  >
                    Conferma Ordine
                  </button>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <th class="colore" scope="row">{{ item.usernamecliente }}</th>
              <td>{{ item.prodotto_nome }}</td>
              <td>{{ item.prodotto_codice }}</td>
              <td>{{ item.funzionario_noleggio }}</td>
              <td>{{ item.prezzo }}</td>
              <td>{{ item.inizio_noleggio }}</td>
              <td>{{ item.fine_noleggio }}</td>
              <td>{{ item.effettiva_restituzione }}</td>
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="Prodotto eliminato con successo"
      aria-hidden="true"
      onClick="window.location.reload();"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header"></div>
          <div class="modal-body">
            Fattura creata con successo. Per accedere alla fattura andare in
            Noleggi > Noleggi conclusi
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

export default {
  components: {
    Nav,
  },
  data() {
    return {
      items: [],
      data: "",
      funzionario: "",
      prova: "",
      sconti: "",
      penale: "",
      totale: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
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
    conferma_ordine(id) {
      axios
        .get("/manager_test", {
          headers: { token: localStorage.getItem("token_manager") },
        })
        .then((res) => {
          this.funzionario = res.data.user.username;
          let order = {
            book_id: id,
            funzionario_noleggio: this.funzionario,
          };
          axios
            .post("/update_order_funz_noleggio", order)
            .then((response) => {
              if (response.status == 200) {
                window.location.reload();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
    conferma_restituzione(id) {
      axios
        .get("/manager_test", {
          headers: { token: localStorage.getItem("token_manager") },
        })
        .then((res) => {
          this.funzionario = res.data.user.username;
          let order = {
            book_id: id,
            funzionario_restituzione: this.funzionario,
          };
          axios
            .post("/update_order_funz_restituzione", order)
            .then((response) => {
              if (response.status == 200) {
                window.location.reload();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
    fattura(id) {
      localStorage.setItem("id_ordine", id);
      this.$router.push("/manager/fattura");
    },
    async crea_fattura(ordine, cliente, prodotto) {
      const params = {
        cod: ordine,
      };
      axios
        .get("/getResbyId", { params })
        .then((response) => {
          const responseData = response.data;
          this.order = responseData;
          const params = {
            _id: cliente,
          };
          axios
            .get("/one_user", { params })
            .then((response) => {
              const responseData = response.data;
              this.user = responseData;
              const params = {
                codiceprodotto: prodotto,
              };
              axios
                .get("/getProdbyId", { params })
                .then((response) => {
                  const responseData = response.data;
                  this.prodotti = responseData;
                  for (var i in this.prodotti.sconti) {
                    this.sconti =
                      this.sconti + " " + this.prodotti.sconti[i].nomesconto;
                  }
                  let penale = "+0€";
                  let totale = 0;
                  let eff = new Date(this.order.effettiva_restituzione);
                  let fin = new Date(this.order.fine_noleggio);
                  if (eff > fin) {
                    let ritardo = (eff - fin) / 86400000;
                    let prova;
                    totale =
                      parseFloat(this.order.prezzo) +
                      ritardo * (parseFloat(this.order.prezzo) * 0.1);
                    prova = parseFloat(
                      ritardo * (parseFloat(this.order.prezzo) * 0.1)
                    ).toFixed(2);
                    penale = "+" + prova + "€";
                  } else if (new Date(this.order.effettiva_restituzione) <= new Date(this.order.fine_noleggio)) {
                    totale = this.order.prezzo;
                  }
                  let newBill = {
                    id_fatt: this.order._id,
                    cliente: this.user._id,
                    us_cliente: this.user.username,
                    funzionario: this.order.funzionario_noleggio,
                    prodotto_codice: this.order.prodotto_codice,
                    prodotto_nome: this.prodotti.nome,
                    totale: totale,
                    periodo_noleggio:
                      this.order.inizio_noleggio +
                      "-" +
                      this.order.fine_noleggio,
                    sconti: this.sconti,
                    penale: penale,
                    subtotale: this.order.prezzo,
                    data_creazione: this.data,
                  };
                  axios
                    .post("/createBill", newBill)
                    .then((response) => {
                      if (response.status == 200) {
                        console.log("Ok");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
