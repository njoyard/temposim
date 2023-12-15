<script setup lang="ts">
import {
  Chart as ChartJs,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
  LinearScale,
  ChartData,
  ChartDataset,
  ChartOptions,
  FontSpec
} from 'chart.js'

import 'chartjs-adapter-luxon'

import { DateTime } from 'luxon'

import { computed, ComputedRef } from 'vue'
import { Bar } from 'vue-chartjs'
import { SeriesDefs, Point } from '../utils/calcul'

const props = defineProps({
  series: Object,
  unit: String,
  title: String
})

const font: Partial<FontSpec> = {
  family: 'CooperHewittBook',
  size: 10
}

const formats = {
  fallback: 'd LLL yyyy TT',
  month: 'LLLL yyyy',
  year: 'yyyy'
}

const colors: { [key: keyof SeriesDefs]: string } = {
  base: '#5214dc',
  hchp: '#f4b44a',
  tempo: '#25adde'
}

const labels: { [key: keyof SeriesDefs]: string } = {
  base: 'Option Base',
  hchp: 'Option Heures Creuses',
  tempo: 'Option Tempo'
}

type RawPoint = {
  x: number
  y: number
}

ChartJs.register(Title, Tooltip, Legend, BarElement, TimeScale, LinearScale)

const chartOptions: ComputedRef<ChartOptions<'bar'>> = computed(() => {
  let yBeginAtZero = true,
    timeUnit = (props.unit || false) as 'year' | 'month' | false,
    ar = 2.5

  let timeFormat = formats[timeUnit as never] || formats.fallback

  let options: ChartOptions<'bar'> = {
    aspectRatio: ar,
    animation: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        border: {
          display: false
        },
        grid: {
          display: false
        },
        ticks: {
          autoSkipPadding: 10,
          font,
          maxRotation: 0
        },
        time: { unit: timeUnit }
      },
      y: {
        beginAtZero: yBeginAtZero,
        border: {
          display: false
        },
        grid: {
          color: 'rgba(127, 127, 127, 0.3)',
          drawTicks: false
        },
        ticks: {
          font
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      filler: {
        propagate: true
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        enabled: true,

        borderColor: 'rgba(127, 127, 127, 0.3)',
        borderWidth: 1,
        backgroundColor: 'rgba(35, 35, 35, 0.7)',

        titleColor: '#bbbbbb',
        titleFont: font,

        bodyFont: {
          weight: 'bold',
          ...font
        },
        displayColors: false,

        callbacks: {
          title: (items) => {
            if (items.length) {
              let [item] = items

              return DateTime.fromMillis((item.raw as RawPoint).x)
                .setLocale('fr')
                .toFormat(timeFormat)
            }
          },

          label: (item) => {
            let y = (item.raw as RawPoint).y
            let label = item.dataset.label

            if (y === null) return

            let itemLabel = `${Math.round(y * 100) / 100} €`

            if (label) {
              itemLabel = `${label}: ${itemLabel}`
            }

            return itemLabel
          }
        }
      }
    }
  }

  return options
})

const chartData: ComputedRef<ChartData<'bar'>> = computed(() => {
  let datasets: ChartDataset<'bar'>[] = []

  for (let key of Object.keys(colors)) {
    if (!props.series || !props.series[key]) continue

    let dataset: ChartDataset<'bar'> = {
      label: labels[key],
      parsing: false,
      data: props.series[key].map((p: Point) => ({ x: p.ts, y: p.value })),
      backgroundColor: colors[key]
    }

    datasets.push(dataset)
  }

  return { datasets }
})
</script>

<template>
  <v-card class="my-8">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <Bar :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>
