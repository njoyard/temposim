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
import couleurs from '../utils/couleurs'
import { Donnees, Option, TypeSerie, Pas } from '../utils/types'

ChartJs.register(Title, Tooltip, Legend, BarElement, TimeScale, LinearScale)

const props = defineProps<{
  pas: Pas
  donnees: Donnees
  type: TypeSerie
  separer: Boolean
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
  stack: string
  color: string
  label: string
}

const options: ComputedRef<OptionParams[]> = computed(() => {
  if (props.type === 'cout') {
    if (props.separer) {
      return [
        {
          option: 'base',
          stack: 'base',
          color: couleurs.orange,
          label: 'Total'
        },
        {
          option: 'hp',
          stack: 'hchp',
          color: couleurs.jauneFonce,
          label: 'Heures Pleines'
        },
        {
          option: 'hc',
          stack: 'hchp',
          color: couleurs.vertClair,
          label: 'Heures Creuses'
        },
        {
          option: 'hpbleu',
          stack: 'tempo',
          color: couleurs.bleu,
          label: 'HP Bleu'
        },
        {
          option: 'hcbleu',
          stack: 'tempo',
          color: couleurs.bleuClair,
          label: 'HC Bleu'
        },
        {
          option: 'hpblanc',
          stack: 'tempo',
          color: couleurs.gris,
          label: 'HP Blanc'
        },
        {
          option: 'hcblanc',
          stack: 'tempo',
          color: couleurs.grisClair,
          label: 'HC Blanc'
        },
        {
          option: 'hprouge',
          stack: 'tempo',
          color: couleurs.rouge,
          label: 'HP Rouge'
        },
        {
          option: 'hcrouge',
          stack: 'tempo',
          color: couleurs.rose,
          label: 'HC Rouge'
        }
      ]
    } else {
      return [
        {
          option: 'base',
          stack: 'base',
          color: couleurs.orange,
          label: 'Option Base'
        },
        {
          option: 'hchp',
          stack: 'hchp',
          color: couleurs.vert,
          label: 'Option Heures Creuses'
        },
        {
          option: 'tempo',
          stack: 'tempo',
          color: couleurs.bleu,
          label: 'Option Tempo'
        }
      ]
    }
  } else {
    if (props.separer) {
      return [
        {
          option: 'base',
          stack: 'base',
          color: couleurs.orange,
          label: 'Total'
        },
        {
          option: 'hp',
          stack: 'hchp',
          color: couleurs.jauneFonce,
          label: 'Heures Pleines'
        },
        {
          option: 'hc',
          stack: 'hchp',
          color: couleurs.vertClair,
          label: 'Heures Creuses'
        },
        {
          option: 'hpbleu',
          stack: 'tempo',
          color: couleurs.bleu,
          label: 'HP Bleu'
        },
        {
          option: 'hcbleu',
          stack: 'tempo',
          color: couleurs.bleuClair,
          label: 'HC Bleu'
        },
        {
          option: 'hpblanc',
          stack: 'tempo',
          color: couleurs.gris,
          label: 'HP Blanc'
        },
        {
          option: 'hcblanc',
          stack: 'tempo',
          color: couleurs.grisClair,
          label: 'HC Blanc'
        },
        {
          option: 'hprouge',
          stack: 'tempo',
          color: couleurs.rouge,
          label: 'HP Rouge'
        },
        {
          option: 'hcrouge',
          stack: 'tempo',
          color: couleurs.rose,
          label: 'HC Rouge'
        }
      ]
    } else {
      return [
        {
          option: 'base',
          stack: 'base',
          color: couleurs.jaune,
          label: 'Consommation'
        }
      ]
    }
  }
})

const unite: ComputedRef<string> = computed(() => {
  if (props.type === 'cout') return '€'
  return 'kWh'
})

type RawPoint = {
  x: number
  y: number
}

const chartOptions: ComputedRef<ChartOptions<'bar'>> = computed(() => {
  let yBeginAtZero = true,
    timeUnit = props.pas,
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
        },
        title: {
          font,
          display: true,
          text: unite.value
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
        position: 'bottom',
        labels: {
          boxHeight: 12,
          boxWidth: 12
        }
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

            let itemLabel = `${Math.round(y * 100) / 100} ${unite.value}`

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

  let jeu = props.donnees.donneesGraphique.find((jeu) => jeu.pas === props.pas)
  if (jeu) {
    for (let { option, stack, color, label } of options.value) {
      let serie = jeu.series.find(
        (s) => s.type === props.type && s.option === option
      )

      if (serie) {
        // Forçage du type - les points {x,y} sont pas autorisés dans les barchart par les types
        // mais l'API chartjs les autorise
        let dataset = {
          label,
          parsing: false,
          backgroundColor: color,
          stack,
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
