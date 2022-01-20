<template>
  <div id="app">
    <Nav />
    <h1>Tabella Utenti</h1>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Nome</th>
            <th scope="col">Cognome</th>
            <th scope="col">Email</th>
            <th scope="col">Modifica</th>
            <th scope="col">Elimina</th>
            <th scope="col">Noleggi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            aria-label="tabella clienti"
          >
            <th class="colore" scope="row">{{ item.username }}</th>
            <td>{{ item.nome }}</td>
            <td>{{ item.cognome }}</td>
            <td>{{ item.email }}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="modifica(item._id, item.username)"
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
                @click="elimina(item.username)"
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
            <td>
              <button
                class="logreg1"
                id="btnreg"
                @click="noleggi(item._id)"
                role="button"
              >
                Noleggi cliente
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
          <div class="modal-body">
            {{ messElimina }}
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
  name: "App",
  components: {
    Nav,
  },
  data() {
    return {
      items: [],
      id: "",
      err: "",
      messElimina: "",
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
  },
  methods: {
    modifica(id, username) {
      localStorage.setItem("id_cliente", id);
      localStorage.setItem("username_cliente", username);
      this.$router.push("/manager/modifica_clienti");
    },
    elimina(username) {
      let params = {
        username: username,
      };
      axios.post("/deleteUser", params).then((res) => {
        if (res.data == "Noleggi futuri") {
          this.messElimina =
            "L'utente ha noleggi futuri, per cui non è possibile eliminarlo.";
        } else {
          this.messElimina = "Utente eliminato con successo";
        }
      });
    },
    noleggi(id) {
      localStorage.setItem("id_cliente", id);
      this.$router.push("/manager/noleggi_cliente");
    },
  },
};
</script>

<style>
.username {
  font-weight: bold;
  color: black;
  width: 100%;
}
.dati_noleggio {
  text-align: center;
}
</style>