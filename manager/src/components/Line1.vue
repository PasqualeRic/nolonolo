<script>
import { Line, mixins } from "vue-chartjs";
import axios from "axios";

export default {
  mixins: [mixins.reactiveData],
  data() {
    return {
      chartData: "",
    };
  },
  extends: Line,
  mounted() {
    this.renderChart(this.chartData);
  },
  created() {
    axios
      .get("/getReservations")
      .then((response) => {
        const responseData = response.data;
        var prova = responseData.map((item) => item.inizio_noleggio);
        const arrayfiltrato = prova.filter(function (ele, pos) {
          return prova.indexOf(ele) == pos;
        });
        arrayfiltrato.sort();
        var fat = [];
        var fattura = [];
        var somma;
        for (var j = 0; j < arrayfiltrato.length; j += 1) {
          somma = 0;
          for (var k = 0; k < responseData.length; k += 1) {
            if (arrayfiltrato[j] == responseData[k].inizio_noleggio) {
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
              data: fattura,
              fill: false,
              borderColor: "#f87979",
              tension: 0.1,
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
