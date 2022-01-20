<template>
  <div id="app">
    <Nav />
    <h1>TABELLA DEI PRODOTTI</h1>

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
                  <th class="colore" scope="col">Non Disponibilità</th>
                  <th class="colore">
                    <button
                      class="btn btn-primary"
                      type="button"
                      data-toggle="modal"
                      @click="cerca(item.nome, item.categoria)"
                      data-target="#modaltab"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-circle"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                        />
                        <path
                          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                        />
                      </svg>
                    </button>
                  </th>
                </tr>
                <tr v-for="(mag, e) in item.magazzino" :key="e">
                  <th class="colore" scope="row">{{ mag.codice }}</th>
                  <td>{{ mag.prezzo }}</td>
                  <td>{{ mag.condizione }}</td>
                  <td>
                    <tbody v-for="(p, k) in mag.nondisp" :key="k">
                      <template v-if="p.substring(11, 21) === '2100-12-31'">
                        <td>{{ p }}</td>
                        <tr>
                          <td>
                            <button
                              @click="rendidisp(mag.codice, p, item._id)"
                              class="logreg1"
                              id="btnreg"
                            >
                              rendi disponibile
                            </button>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="modifica(mag.codice, item._id)"
                      role="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      data-toggle="modal"
                      data-target="#exampleModal"
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="elimina(item._id, mag.codice, item.nome)"
                      role="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      class="btn btn-primary"
      type="button"
      data-toggle="modal"
      data-target="#modalCenter"
    >
      Aggiungi Prodotto
    </button>

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
            <p>{{ messElimina }}</p>
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

    <div class="modal fade" tabindex="-1" role="dialog" id="modalCenter">
      <div
        class="modal-dialog modal-dialog-centered modal-lg"
        style="width: 80%"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-body">
            <div class="form">
              <p style="color: red">{{ error }}</p>
              <p style="color: red">{{ error1 }}</p>
              <div class="form-group" aria-label="form di aggiunta prodotti">
                <div class="form-group">
                  <label>Immagine*</label>
                  <input
                    aria-label="inserisci l'immagine del prodotto"
                    type="file"
                    @change="handleFileChange($event)"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>Nome prodotto*</label>
                  <input
                    aria-label="inserisci il nome del prodotto"
                    type="text"
                    class="form-control"
                    v-model="titolo"
                    placeholder="Nome"
                  />
                </div>
                <div class="form-group">
                  <label>Descrizione*</label>
                  <input
                    aria-label="inserisci la descrizione del prodotto"
                    type="text"
                    class="form-control"
                    v-model="descrizione"
                    placeholder="Descrizione"
                  />
                </div>
                <div class="form-group">
                  <label>Categoria*</label>
                  <input
                    aria-label="inserisci la categoria del prodotto"
                    type="text"
                    class="form-control"
                    v-model="categoria"
                    placeholder="Categoria"
                  />
                </div>
                <div class="form-group">
                  <label>Codice*</label>
                  <input
                    aria-label="inserisci il codice del prodotto"
                    type="text"
                    class="form-control"
                    v-model="codice"
                    placeholder="Codice"
                  />
                </div>
                <div class="form-group">
                  <label>Prezzo*</label>
                  <input
                    aria-label="inserisci il prezzo del prodotto"
                    type="text"
                    class="form-control"
                    v-model="prezzo"
                    placeholder="Prezzo"
                  />
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    role="switch"
                    name="flexRadioDefault"
                    id="mcTerra"
                    value="mcTerra"
                    v-model="check"
                  />
                  <label
                    class="form-check-label"
                    for="mcTerra"
                    style="margin-left: 35px"
                    >mcTerra</label
                  >
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    role="switch"
                    name="flexRadioDefault"
                    id="Ecologico"
                    value="Ecologico"
                    v-model="check"
                  />
                  <label
                    class="form-check-label"
                    for="Ecologico"
                    style="margin-left: 35px"
                    >Ecologico</label
                  >
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    role="switch"
                    name="flexRadioDefault"
                    id="nolomonday"
                    value="nolomonday"
                    v-model="check"
                  />
                  <label
                    class="form-check-label"
                    for="nolomonday"
                    style="margin-left: 35px"
                    >nolomonday</label
                  >
                </div>
                <div class="dati_noleggio" aria-label="select prodotti">
                  <label for="prodotto">Condizioni:*</label><br />
                  <select
                    name="prodotto"
                    v-model="condizione"
                    class="form-select"
                    aria-label="scegli il prodotto con cui creare il noleggio"
                  >
                    <option selected>Ottime condizioni</option>
                    <option value="Buone condizioni">Buone condizioni</option>
                    <option value="Pessime condizioni">
                      Pessime condizioni
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <p style="color: red">{{ mess }}</p>
            <div class="modal-footer">
              <div class="buttons">
                <button @click="add()" class="logreg1" id="btnreg">
                  Aggiungi Prodotto
                </button>
                <p style="color: red">{{ messInterno }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" id="modaltab">
      <div
        class="modal-dialog modal-dialog-centered modal-lg"
        style="width: 80%"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-body">
            <div class="form">
              <p style="color: red">{{ error }}</p>
              <p style="color: red">{{ error1 }}</p>
              <div class="form-group" aria-label="form di aggiunta prodotti">
                <div class="form-group">
                  <label>Nome prodotto</label>
                  <input
                    aria-label="nome del prodotto"
                    type="text"
                    class="form-control"
                    :value="this.nome"
                    @input="nome = $event.target.value"
                    readonly="readonly"
                  />
                </div>
                <div class="form-group">
                  <label>Categoria</label>
                  <input
                    aria-label="categoria del prodotto"
                    type="text"
                    class="form-control"
                    :value="this.categoria"
                    @input="categoria = $event.target.value"
                    readonly="readonly"
                  />
                </div>
                <div class="form-group">
                  <label>Codice*</label>
                  <input
                    aria-label="inserisci il codice del prodotto"
                    type="text"
                    class="form-control"
                    v-model="cod"
                    placeholder="Codice"
                  />
                </div>
                <div class="form-group">
                  <label>Prezzo*</label>
                  <input
                    aria-label="inserisci il prezzo del prodotto"
                    type="text"
                    class="form-control"
                    v-model="prez"
                    placeholder="Prezzo"
                  />
                </div>
                <div class="dati_noleggio" aria-label="select prodotti">
                  <label for="prodotto">Condizioni:*</label><br />
                  <select
                    name="prodotto"
                    v-model="condiz"
                    class="form-select"
                    aria-label="scegli il prodotto con cui creare il noleggio"
                  >
                    <option selected>Ottime condizioni</option>
                    <option value="Buone condizioni">Buone condizioni</option>
                    <option value="Pessime condizioni">
                      Pessime condizioni
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="buttons">
                <button @click="addMag()" class="logreg1" id="btnreg">
                  Aggiungi Prodotto
                </button>
              </div>
            </div>
          </div>
          <p style="color: red">{{ messInterno }}</p>
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
      mag: "",
      check: [],
      k: "",
      prezzo: "",
      titolo: "",
      descrizione: "",
      categoria: "",
      codice: "",
      mess: "",
      nome: "",
      messInterno: "",
      messaggio: "",
      messElimina: "",
      nomeProd : []
    };
  },
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
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    handleFileChange(evt) {
      this.file = evt.target.files;
    },
    cerca(nome, categoria) {
      (this.nome = nome), (this.categoria = categoria);
    },
    addMag() {
      if (
        this.cod == "" ||
        this.prez == undefined ||
        this.condiz == undefined ||
        this.prez == ""
      ) {
        this.messInterno = "Compila tutti i campi";
      } else {
        let prodotti = {
          nome: this.nome,
          categoria: this.categoria,
          codice: this.cod,
          prezzo: this.prez,
          condizione: this.condiz,
        };
        axios
          .post("/insertProduct", prodotti)
          .then((res) => {
            if (res.status == 200) {
              window.location.reload();
            }
          })
          .catch((err) => {
            if (err) {
              this.messInterno = "Codice esistente";
            }
          });
      }
    },
    async add() {
      let sconti = [];
      let array = [];
      array = this.check;
      let nomesconto, descrizionesconto;
      descrizionesconto = "";
      nomesconto = "";
      console.log(array);
      if (array != "") {
        nomesconto = array;
        if (array == "mcTerra") {
          descrizionesconto =
            "Ottieni uno sconto del 50% nei sabato interni del tuo periodo di noleggio, mentre i giorni festivi non li paghi!";
        }
        if (array == "periodTerra") {
          descrizionesconto =
            "I prezzi potrebbero aumentare nel periodo estivo, dove la richiesta è abbondante. Al contrario, nel periodo invernale avrai uno sconto del 10%";
        }
        if (array == "Ecologico") {
          descrizionesconto =
            "Noleggia il prodotto nei giorni feriali, e avrai uno sconto del 10% per ogni giorno del noleggio, il giusto premio per rispettare il pianeta";
        }
        if (array == "nolomonday") {
          descrizionesconto =
            "Su questo prodotto potrai usufruire del nolomonday! Per i primi due lunedì del mese di Gennaio, 30% di sconto sul noleggio";
        }

        sconti.push({
          nomesconto: nomesconto,
          descrizionesconto: descrizionesconto,
        });
      }
      console.log(sconti);
      let nomeFile = "null";
      console.log(this.file);
      if (this.file != undefined) {
        nomeFile = this.file[0].name;
        let formData = new FormData();
        formData.append("img", this.file[0]);
        await axios.post("/uploadPhoto", formData);
        if (
          this.condizione == undefined ||
          this.prezzo == "" ||
          this.titolo == "" ||
          this.descrizione == "" ||
          this.categoria == "" ||
          this.codice == ""
        ) {
          this.messInterno = "Inserire i dati mancanti";
        } else {
          let prodotti = {
            nome: this.titolo,
            descrizione: this.descrizione,
            categoria: this.categoria,
            codice: this.codice,
            prezzo: this.prezzo,
            condizione: this.condizione,
            nomefile: nomeFile,
            sconti: sconti,
          };
          console.log(prodotti);
          await axios
            .post("/insertProduct", prodotti)
            .then((res) => {
              if (res.status == 200) {
                window.location.reload();
              }
            })
            .catch((err) => {
              if (err) this.messInterno = "Prodotto esistente";
            });
        }
      } else {
        this.messInterno = "Inserire tutti i dati";
      }
    },
    modifica(codice, id) {
      localStorage.setItem("prodotto_codice", codice);
      localStorage.setItem("prodotto_id", id);
      this.$router.push("/manager/modifica_dati");
    },
    elimina(id, codice, titolo) {
      let elimina = {
        serie_prodotto: id,
        codice: codice,
        nome: titolo,
      };
      axios.post("/deleteProduct", elimina).then((res) => {
        if (res.status == 200) {
          if (res.data.error == null) {
            this.messElimina = "Prodotto eliminato con successo";
          } else {
            this.messElimina = res.data.error;
          }
        }
      });
    },
    rendidisp(cod, nondispo, id) {
      let rendi_disp = {
        codice: cod,
        id: id,
        nondispo: nondispo,
      };
      axios.post("/update_disp", rendi_disp).then((res) => {
        if (res.status == 200) {
          window.location.reload();
        }
      });
    },
  },
};
</script>
<style>
.codice {
  font-weight: bold;
  color: white;
  width: 100%;
  background-color: #00a0e0;
}
.dati {
  font-size: 18px;
}
.secondario {
  text-align: left;
}
.form,
h3 {
  margin: auto;
  width: 40%;
}
.contenitore {
  margin: auto;
}
.logreg1 {
  background-color: #00a0e0;
  text-align: center;
  width: 150px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  padding: 8px;
  margin-bottom: 10px;
}
</style>
