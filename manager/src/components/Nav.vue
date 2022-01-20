<template>
  <nav
    class="navbar navbar-expand-lg navbar-light fixed-top bg-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto" role="menu">
        <li class="nav-item" role="menuitem">
          <button
            aria-label="premi per effettuare il logout"
            @click="logout"
            class="logreg1"
            id="btnreg"
            style="width: 100%"
          >
            Logout
          </button>
        </li>
        <li class="nav-item" role="menuitem">
          <router-link
            aria-label="premi per accedere ai dati dei clienti"
            to="/manager/clienti"
            class="nav-link"
            >Dati Clienti</router-link
          >
        </li>
        <li class="nav-item dropdown" role="menuitem">
          <a
            class="nav-link dropdown-toggle"
            id="navbardrop"
            data-toggle="dropdown"
            aria-label="menu grafici"
          >
            Grafici
          </a>
          <div class="dropdown-menu">
            <a
              class="dropdown-item"
              href="/manager/grafici_clienti"
              aria-label="informazioni degli acquisti fatti dai clienti"
              >Grafici Clienti</a
            >
            <a
              class="dropdown-item"
              href="/manager/grafici_categoria"
              aria-label="informazioni sulle categorie dei prodotti"
              >Grafici Categoria</a
            >
            <a
              class="dropdown-item"
              href="/manager/grafici_fattura"
              aria-label="informazioni degli acquisti sul sito "
              >Grafici Fatture</a
            >
            <a
              class="dropdown-item"
              href="/manager/grafici_prodotti"
              aria-label="informazioni degli per ogni prodotto"
              >Grafici Prodotti</a
            >
          </div>
        </li>
        <li class="nav-item dropdown" role="menuitem">
          <a
            class="nav-link dropdown-toggle"
            id="navbardrop"
            data-toggle="dropdown"
            role="navigation"
            aria-label="menu noleggi"
          >
            Noleggi
          </a>
          <div class="dropdown-menu">
            <a
              class="dropdown-item"
              href="/manager/crea_noleggio"
              aria-label="creazione dei noleggi"
              >Crea Noleggio</a
            >
            <a
              class="dropdown-item"
              href="/manager/noleggi_attivi"
              aria-label="controllo dei noleggi attivi"
              >Noleggi Attivi</a
            >
            <a
              class="dropdown-item"
              href="/manager/conferma_noleggi"
              aria-label="approvare noleggi e controllo fatture"
              >Conferma Noleggi</a
            >
            <a
              class="dropdown-item"
              href="/manager/noleggi_conclusi"
              aria-label="tutti i noleggi conclusi"
              >Noleggi Conclusi</a
            >
          </div>
        </li>
        <li class="nav-item" role="menuitem">
          <router-link
            aria-label="premi per accedere alla sezione dove modificare, eliminare o aggiungere prodotti "
            to="/manager/prodotti"
            class="nav-link"
            >Prodotti</router-link
          >
        </li>
      </ul>
      <span class="navbar-text"> Ciao, {{ NomeUtente }} </span>
    </div>
  </nav>
</template>
<script>
import axios from "axios";
export default {
  name: "Nav",
  data() {
    return {
      NomeUtente: "",
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/manager/login");
    },
  },
  mounted() {
    axios
      .get("/manager_test", {
        headers: { token: localStorage.getItem("token_manager") },
      }) // se il token è stato creato allora lo passo alla post dentro il server per estrapolare i dati
      .then((res) => {
        this.NomeUtente = res.data.user.username;
      });
  },
};
</script>
