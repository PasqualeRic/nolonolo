import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Landing from './components/Landing.vue'
import Login from './components/Login.vue'
import GraficiClienti from './components/Grafici_Clienti.vue'
import GraficiProdotti from './components/Grafici_prodotti.vue'
import GraficiCategoria from './components/Grafici_categoria.vue'
import GraficiFattura from './components/Grafici_fattura.vue'
import Clienti from './components/Clienti.vue'
import NoleggiCliente from './components/Noleggi_cliente.vue'
import Tabella from './components/tabella.vue'
import ModificaClienti from './components/modifica_clienti.vue'
import ModificaProdotti from './components/modifica_dati.vue'
import CreaNoleggio from './components/Crea_noleggio.vue'
import NoleggiAttivi from './components/Noleggi_attivi.vue'
import ModificaNoleggi from './components/Modifica_Noleggi.vue'
import ConfermaNoleggi from './components/Conferma_Noleggi.vue'
import Fattura from './components/Fattura.vue'
import NoleggiConclusi from './components/Noleggi_Conclusi.vue'

Vue.use(VueRouter);
const routes = [
    { path: '/manager', component: Landing },
    { path: '/manager/login', component: Login },
    { path: '/manager/grafici_clienti', component: GraficiClienti },
    { path: '/manager/grafici_categoria', component: GraficiCategoria },
    { path: '/manager/grafici_prodotti', component: GraficiProdotti },
    { path: '/manager/grafici_fattura', component: GraficiFattura },
    { path: '/manager/clienti', component: Clienti },
    { path: '/manager/noleggi_cliente', component: NoleggiCliente },
    { path: '/manager/modifica_dati', component: ModificaProdotti },
    { path: '/manager/Prodotti', component: Tabella },
    { path: '/manager/modifica_clienti', component: ModificaClienti },
    { path: '/manager/crea_noleggio', component: CreaNoleggio },
    { path: '/manager/noleggi_attivi', component: NoleggiAttivi },
    { path: '/manager/modifica_noleggi', component: ModificaNoleggi },
    { path: '/manager/conferma_noleggi', component: ConfermaNoleggi },
    { path: '/manager/noleggi_conclusi', component: NoleggiConclusi },
    { path: '/manager/fattura', component: Fattura },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

new Vue({
    router,
    render: h => {
        return h(App);
    }
}).$mount('#app');

