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
import { Donnees, Option, Unite } from '../utils/types'

ChartJs.register(Title, Tooltip, Legend, BarElement, TimeScale, LinearScale)

const props = defineProps<{
  unite: Unite
  data: Donnees
}>()

const font: Partial<FontSpec> = {
  family: 'CooperHewittBook',
  size: 10
}

const formats = {
  month: 'LLLL yyyy',
  year: 'yyyy'
}

type OptionParams = {
  option: Option
  color: string
  label: string
}

const options: OptionParams[] = [
  { option: 'base', color: '#5214dc', label: 'Option Base' },
  { option: 'hchp', color: '#f4b44a', label: 'Option Heures Creuses' },
  { option: 'tempo', color: '#25adde', label: 'Option Tempo' }
]

type RawPoint = {
  x: number
  y: number
}

const chartOptions: ComputedRef<ChartOptions<'bar'>> = computed(() => {
  let yBeginAtZero = true,
    timeUnit = props.unite,
    ar = 3

  let timeFormat = formats[timeUnit]

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

  let jeu = props.data.donneesGraphique.find((jeu) => jeu.unite === props.unite)
  if (jeu) {
    for (let { option, color, label } of options) {
      let serie = jeu.series.find((s) => s.option === option)

      if (serie) {
        // Forçage du type - les points {x,y} sont pas autorisés par le type system dans les barchart
        // mais l'API chartjs les autorise
        let dataset = {
          label,
          parsing: false,
          backgroundColor: color,
          data: serie.points.map((p) => ({ x: p.ts, y: p.valeur }))
        } as unknown as ChartDataset<'bar'>

        datasets.push(dataset)
      }
    }
  }

  return { datasets }
})
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
