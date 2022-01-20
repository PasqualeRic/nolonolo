<script>
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
        const responseData = response.data;
        var arr_us = responseData.map((item) => item.usernamecliente);
        const arrayfiltrato = arr_us.filter(function (ele, pos) {
          return arr_us.indexOf(ele) == pos;
        });
        var fat = [];
        var fattura = [];
        var somma;
        for (var j = 0; j < arrayfiltrato.length; j += 1) {
          somma = 0;
          for (var k = 0; k < responseData.length; k += 1) {
            if (arrayfiltrato[j] == responseData[k].usernamecliente) {
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





