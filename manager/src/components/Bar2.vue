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
        var noleggi = [];
        var num_noleggi = 0;
        for (var j = 0; j < arrayfiltrato.length; j += 1) {
          num_noleggi = 0;
          for (var k = 0; k < responseData.length; k += 1) {
            if (arrayfiltrato[j] == responseData[k].usernamecliente) {
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
              backgroundColor: "#f87979",
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
