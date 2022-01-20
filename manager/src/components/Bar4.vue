<script>
//import VueCharts from 'vue-chartjs'
import { Bar, mixins } from "vue-chartjs";
import axios from "axios";

export default {
  mixins: [mixins.reactiveData],
  data() {
    return {
      chartData: "",
    };
  },
  extends: Bar,
  mounted() {
    this.renderChart(this.chartData);
  },
  created() {
    axios
      .get("/getReservations")
      .then((response) => {
        // JSON responses are automatically parsed.
        const responseData = response.data;
        var prova = responseData.map((item) => item.prodotto_nome);
        const arrayfiltrato = prova.filter(function (ele, pos) {
          return prova.indexOf(ele) == pos;
        });
        var fat = [];
        var fattura = [];
        var somma;
        for (var j = 0; j < arrayfiltrato.length; j += 1) {
          somma = 0;
          for (var k = 0; k < responseData.length; k += 1) {
            if (arrayfiltrato[j] == responseData[k].prodotto_nome) {
              fat = parseFloat(responseData[k].prezzo);
              somma += fat;
            }
          }
          fattura.push(somma);
        }

        this.chartData = {
          labels: arrayfiltrato,
          datasets: [
            {
              label: "saldo fatture",
              backgroundColor: "#f87979",
              borderWidth: 1,
              pointBorderColor: "#249EBF",
              data: fattura,
            },
          ],
        };
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>





