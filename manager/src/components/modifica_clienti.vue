<template>
  <div id="app">
    <Nav />
    <h3>Modifica Cliente</h3>

    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Nome</th>
            <th scope="col">Cognome</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th class="colore" scope="row">
              <input
                aria-label="inserici il nuovo username"
                style="width: 90%"
                type="text"
                :value="items.username"
                @input="username = $event.target.value"
              />
            </th>
            <td>
              <input
                aria-label="inserici il nuovo nome"
                type="text"
                style="width: 90%"
                :value="items.nome"
                @input="nome = $event.target.value"
              />
            </td>
            <td>
              <input
                aria-label="inserici il nuovo cognome"
                type="text"
                style="width: 90%"
                :value="items.cognome"
                @input="cognome = $event.target.value"
              />
            </td>
            <td>
              <input
                aria-label="inserisci la nuova email"
                type="text"
                style="width: 90%"
                :value="items.email"
                @input="email = $event.target.value"
              />
            </td>
            <td>
              <div class="buttons">
                <button @click="add" class="logreg1" id="btnreg">
                  Salva modifiche
                </button>
                <p style="color: red">{{ err }}</p>
              </div>
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
      username: "",
      nome: "",
      cognome: "",
      email: "",
      vecchia_email: "",
      vecchio_username: "",
      err: "",
    };
  },
  created() {
    if (localStorage.getItem("token_manager") === null) {
      this.$router.push("/manager/login");
    }
  },
  mounted() {
    this.prod = localStorage.getItem("username_cliente");
    const params = {
      username: this.prod,
    };
    axios
      .get("/getUserByUsername", { params })
      .then((response) => {
        if (response.status == 200) {
          const responseData = response.data;
          this.items = responseData;
          this.vecchia_email = this.items.email;
          this.vecchio_username = this.items.username;
          this.nome = this.items.nome;
          this.cognome = this.items.cognome;
          this.username = this.items.username;
          this.email = this.items.email;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    add() {
      let u = {
        username: this.username,
        nome: this.nome,
        cognome: this.cognome,
        email: this.email,
        ident: this.vecchio_username,
        emI: this.vecchia_email,
      };
      axios
        .post("/editUser", u)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem("username_cliente", this.username);
            this.$router.push("/manager/clienti");
          }
        })
        .catch((error) => {
          this.err = error.response.data.error;
        });
    },
  },
};
</script>

<style >
h3 {
  margin-top: 20px;
}
.dati_cliente {
  text-align: center;
}
</style>