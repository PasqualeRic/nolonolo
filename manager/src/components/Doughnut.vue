<script>
import { Doughnut, mixins } from "vue-chartjs";
import axios from "axios";

export default {
  mixins: [mixins.reactiveData],
  data() {
    return {
      chartData: "",
    };
  },
  extends: Doughnut,
  mounted() {
    this.renderChart(this.chartData);
  },
  created() {
    axios
      .get("/getReservations")
      .then((response) => {
        const responseData = response.data;
        var prova = responseData.map((item) => item.categoria);
        const arrayfiltrato = prova.filter(function (ele, pos) {
          return prova.indexOf(ele) == pos;
        });
        var noleggi = [];
        var num_noleggi = 0;
        for (var j = 0; j < arrayfiltrato.length; j += 1) {
          num_noleggi = 0;
          for (var k = 0; k < responseData.length; k += 1) {
            if (arrayfiltrato[j] == responseData[k].categoria) {
              num_noleggi = num_noleggi + 1;
            }
          }
          noleggi.push(num_noleggi);
        }

        this.chartData = {
          labels: arrayfiltrato,
          datasets: [
            {
              label: "numero noleggi",
              backgroundColor: [
                "#f87979",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
              ],
              borderWidth: 1,
              pointBorderColor: "#249EBF",
              data: noleggi,
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
