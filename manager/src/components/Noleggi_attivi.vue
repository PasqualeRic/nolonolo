<template>
<div id = "app">
    <Nav /> 
<h3>Tabella noleggi attivi/futuri</h3>
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
        <th scope="col">Note</th>
        <th scope="col">Modifica</th>
        <th scope="col">Elimina</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in items" :key="index" class="principale" aria-label="tabella noleggi attivi">
        <tr v-if="new Date(item.inizio_noleggio).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) && new Date(item.fine_noleggio).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)">
        
        <th class="colore" scope="row">{{item.usernamecliente}}</th>
        <td>{{item.prodotto_nome}}</td>
        <td>{{item.prodotto_codice}}</td>
        <td>{{item.funzionario_noleggio}}</td>
        <td>{{item.prezzo}}</td>
        <td>{{item.inizio_noleggio}}</td>
        <td>{{item.fine_noleggio}}</td>
        <td>{{item.effettiva_restituzione}}</td>
        <td>{{item.annotazioni}}</td>
        <td>
            <button type ="button" class="btn btn-outline-secondary" @click="modifica(item.cliente, item._id)" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg></button>
        </td>
        <td>
            <button data-toggle="modal" data-target="#exampleModal" type ="button" class="btn btn-outline-secondary" @click="elimina(item._id,item.prodotto_serie, item.prodotto_codice, item.inizio_noleggio, item.fine_noleggio)" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg></button>
        </td>       
        </tr>
        <tr v-if="item.funzionario_noleggio != 'not_confirmed' && (new Date(item.inizio_noleggio).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) && new Date(item.fine_noleggio).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) && item.effettiva_restituzione === 'not_confirmed' ">
            <th class="colore" scope="row">{{item.usernamecliente}}</th>
            <td>{{item.prodotto_nome}}</td>
            <td>{{item.prodotto_codice}}</td>
            <td>{{item.funzionario_noleggio}}</td>
            <td>{{item.prezzo}}</td>
            <td>{{item.inizio_noleggio}}</td>
            <td>{{item.fine_noleggio}}</td>
            <td>{{item.effettiva_restituzione}}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>  
        </tbody>
    </table>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="Noleggio eliminato con successo" aria-hidden="true" onClick="window.location.reload();" >
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      </div>
      <div class="modal-body">
          {{messElimina}}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick="window.location.reload();" style="background-color:#00a0e0" >Ok</button>
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
      .get("/getReservations")
      .then((response) => {
        const responseData = response.data;
        this.items = responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    elimina(id, prod_serie, prod_codice, indate, fndate) {
      let ordine = {
        book_id: id,
        product_series: prod_serie,
        product_id: prod_codice,
        old_period: indate + "," + fndate,
      };
      axios
        .post("/deleteBook", ordine)
        .then((response) => {
          if (response.status == 200) {
            this.messElimina = "Noleggio eliminato con successo";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modifica(cliente, id) {
      localStorage.setItem("cliente", cliente);
      localStorage.setItem("id_noleggio", id);
      this.$router.push("/manager/modifica_noleggi");
    },
  },
};
</script>
