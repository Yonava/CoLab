<template>
  <div style="height:600px;width: 600px;display: flex;flex-direction:column;">
    <vue3-chart-js :id="doughnutChart.id" ref="chartRef" :type="doughnutChart.type"
      :data="doughnutChart.data"></vue3-chart-js>

    <button @click="updateChart">Update Chart</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup() {
    const chartRef = ref(null)

    const doughnutChart = {
      id: 'doughnut',
      type: 'doughnut',
      data: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: [
              '#41B883',
              '#E46651',
              '#00D8FF',
              '#DD1B16'
            ],
            data: [40, 20, 80, 10]
          }
        ]
      }
    }

    const updateChart = () => {
      doughnutChart.data.labels = ['Cats', 'Dogs', 'Hamsters', 'Dragons']
      doughnutChart.data.datasets = [
        {
          backgroundColor: [
            '#333333',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [100, 20, 800, 20]
        }
      ]

      chartRef.value.update()
    }

    return {
      doughnutChart,
      updateChart,
      chartRef
    }
  },
}
</script>