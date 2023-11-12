<template>
  <div style="display: flex;flex-direction:column;">
    <h1>
      {{ title }}
    </h1>
    <vue3-chart-js
      ref="chartRef"
      :type="chart.type"
      :id="chart.id"
      :data="chart.data"
      :key="renderKey"
    ></vue3-chart-js>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const props = defineProps<{
  chartData: any;
}>();

const chartRef = ref<HTMLElement>()
const renderKey = ref(0)

const title = ref('')

const chart = {
  id: 'chart',
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      fill: false,
      borderColor: 'rgb(0, 0, 0)',
      tension: 0.1
    }]
  },
}

const updateChart = (newChart: object) => {
  chart.data.labels = newChart.data.labels
  chart.data.datasets = newChart.data.datasets
  chart.type = newChart.type
  renderKey.value++
  // @ts-ignore
  chartRef.value.update()

}

const trimEmptyStrings = (matrix: (number | string | undefined)[][]): (number | string | undefined)[][] => {
  let numCols = matrix[0].length

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const nonEmptyCellIndex = row.findIndex(cell => cell !== '');

    if (nonEmptyCellIndex !== -1 && row.every((cell, index) => index === nonEmptyCellIndex || cell === '')) {
      // Found a row with only one non-empty cell

      // Remove the row
      matrix.splice(i, 1);

      // Return the value
      title.value = String(row[nonEmptyCellIndex])
    }
  }

  // remove empty rows
  matrix = matrix.filter(row => row.some(cell => cell !== ''))

  // remove trailing empty strings
  for (let row = 0; row < matrix.length; row++) {
    let lastNonEmptyIndex = numCols - 1

    while (lastNonEmptyIndex >= 0 && matrix[row][lastNonEmptyIndex] === '') {
      lastNonEmptyIndex--
    }

    matrix[row] = matrix[row].slice(0, lastNonEmptyIndex + 1)
  }

  // remove empty cols
  for (let col = 0; col < numCols; col++) {
    let isColumnEmpty = true

    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][col] !== '') {
        isColumnEmpty = false
        break
      }
    }

    if (isColumnEmpty) {
      for (let row = 0; row < matrix.length; row++) {
        matrix[row].splice(col, 1)
      }
      col--
      numCols--
    }
  }

  // convert to undefined for graphing
  for (let row = 1; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === '') {
        matrix[row][col] = undefined
      }
    }
  }

  return matrix;
}

// run before trimEmptyStrings() otherwise type error due to undefined in the array
// DOES NOT INTERPOLATE MORE THAN ONE DATA POINT
const interpolateMissingValues = (matrix: (number | string)[][]): (number | string)[][] => {
  return matrix.map(row => {
    for (let i = 1; i < row.length - 1; i++) {
      if (row[i] === '' && typeof row[i - 1] === 'number' && typeof row[i + 1] === 'number') {
        const average = (row[i - 1] + row[i + 1]) / 2
        row[i] = average
      }
    }
    return row
  })
}

// converts $ and , to numbers
const cleanAndConvert = (matrix: (number | string)[][]): (number | string)[][] => {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      let cellValue = matrix[row][col]
      if (typeof cellValue === 'string' && cellValue !== '') {
        let checkCanConvertToNumber = parseFloat(cellValue.replace(/[$,]/g, ''))
        matrix[row][col] = checkCanConvertToNumber ? checkCanConvertToNumber : cellValue
      }
    }
  }
  return matrix
}

const removeLeadingEmptyStrings = (arr: (string | number | undefined)[]): (string | number | undefined)[] => {
  let i = 0
  while (i < arr.length && arr[i] === '') i++
  return arr.slice(i)
}

// test cases
const generateRandomMatrix = (n: number, m: number): (number | string)[][] => {
  const matrix: (number | string)[][] = [];

  for (let i = 0; i < n; i++) {
    const row: (number | string)[] = [];

    for (let j = 0; j < m; j++) {
      const rand = Math.random();

      if (rand < 0.3) {
        // 30% chance for a number
        row.push(Math.floor(Math.random() * 100));
      } else if (rand < 0.6) {
        // 30% chance for a string with a number and a dollar sign
        row.push(`$${Math.floor(Math.random() * 100)}`);
      } else {
        // 40% chance for an empty string
        row.push('');
      }
    }

    matrix.push(row);
  }

  return matrix;
};

// Generate test cases
for (let i = 0; i <= 5; i++) {
  const n = Math.ceil(Math.random() * 10)
  const m = Math.ceil(Math.random() * 10)

  const testCase = generateRandomMatrix(n, m);

  // console.log(`Test Case ${i + 1}:`);
  // console.log(testCase);
  // console.log(trimEmptyStrings(interpolateMissingValues(cleanAndConvert(testCase))));
}

const generateRandomGreenShade = (): string => {
  const red = 0
  const green = Math.floor(Math.random() * 256) + 50
  const blue = Math.floor(Math.random() * 256) + 50

  // Format the RGB values into a CSS color string
  const color = `rgb(${red}, ${green}, ${blue})`

  return color
}

const pushChart = (matrix: (string | number | undefined)[][], chartType: string) => {
  let tempChart

  switch(chartType) {
    case 'line':
      tempChart = {
        id: 'chart',
        type: 'line',
        data: {
          labels: removeLeadingEmptyStrings(matrix[0]),
          datasets: [],
        },
      };

    for (let i = 1; i < matrix.length; i++) {
      tempChart.data.datasets.push({
        label: String(matrix[i][0] ?? 'No Label'),
        data: matrix[i].slice(1),
        fill: false,
        borderColor: generateRandomGreenShade(),
        tension: 0.1,
      });
    } break
    case 'bar':
      tempChart = {
        id: 'chart',
        type: 'bar',
        data: {
          labels: matrix[0],
          datasets: [{
            label: 'Series',
            data: matrix[1],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }],
        },

      };

      for (let i = 0; i < matrix[1].length; i++) {
        tempChart.data.datasets[0].backgroundColor.push(generateRandomGreenShade())
        tempChart.data.datasets[0].borderColor.push('rgb(255, 255, 255)')
      } break
    case 'scatter':
      tempChart = {
        id: 'chart',
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Series',
            data: [],
            backgroundColor: generateRandomGreenShade()
          }],
        },
      };
      console.log('data')

      for (let i = 1; i < matrix.length; i++) {
        tempChart.data.datasets[0].data.push({
          'x': matrix[i][0],
          'y': matrix[i][1]
        })
      } break
    default:
      throw new Error("Unknown Chart Type passed to function pushChart()")
  }
  return tempChart
}



const isLineChartData = (arr: any): arr is any[][] => {
  // must be at least 3 high by m wide
  /*
    VALID:
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    INVALID:
    [
      [1, 2, 3],
      [4, 5, 6],
    ]
  */
  return Array.isArray(arr) && arr.length > 2 && arr.every(subArr => Array.isArray(subArr));
}

const isBarChartData = (arr: any): arr is [any[], any[]] => {
  // must be 2 high by m wide
  /*
    VALID:
    [
      [1, 2, 3],
      [4, 5, 6],
    ]
    INVALID:
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
  */
  return Array.isArray(arr) && arr.length === 2 && arr.every(subArr => Array.isArray(subArr));
}

const isScatterChartData = (arr: any): arr is [any, any][] => {
  // must be n high by 2 wide
  /*
    VALID:
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ]
    INVALID:
    [
      [1, 2, 3],
      [4, 5, 6],
    ]
  */
  return (
    Array.isArray(arr) &&
    arr.length >= 2 &&
    arr.every((row) => Array.isArray(row) && row.length === 2)
  )
}

const inferChartType = (data: any): string[] => {
  let availableChartTypes = []
  if (isScatterChartData(data)) availableChartTypes.push('scatter');
  if (isBarChartData(data)) availableChartTypes.push('bar')
  if (isLineChartData(data)) availableChartTypes.push('line')
  if (availableChartTypes.length === 0) throw new Error('Unknown Chart Type')
  return availableChartTypes
}

const cleanedData = trimEmptyStrings(interpolateMissingValues(cleanAndConvert(props.chartData)))
const chartTypes = inferChartType(cleanedData)
console.log(chartTypes)

setTimeout(() => {
  // delay loading
  updateChart(pushChart(cleanedData, chartTypes[0] ?? 'bar'))
}, 200)

</script>