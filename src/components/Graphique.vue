<script setup lang="ts">
import {
  Chart as ChartJs,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
  ChartDataset,
  ChartOptions,
  FontSpec
} from 'chart.js'

import { computed, ComputedRef } from 'vue'

import { Bar } from 'vue-chartjs'
import couleurs from '../utils/couleurs'
import { libellePas } from '../utils/pas'
import { Donnees, Option, TypeSerie, Pas } from '../utils/types'

ChartJs.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  pas: Pas
  donnees: Donnees
  type: TypeSerie
  separer: Boolean
}>()

const font: Partial<FontSpec> = {
  family: 'CooperHewittBook',
  size: 12
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
          label: 'Base'
        },
        {
          option: 'hp',
          stack: 'hchp',
          color: couleurs.vert,
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
          color: couleurs.vert,
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

const chartOptions: ComputedRef<ChartOptions<'bar'>> = computed(() => {
  let yBeginAtZero = true
  let ar = 3

  let options: ChartOptions<'bar'> = {
    aspectRatio: ar,
    animation: false,
    responsive: true,
    scales: {
      x: {
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
        }
      },
      y: {
        beginAtZero: yBeginAtZero,
        border: {
          display: false
        },
        grid: {
          color: couleurs.grisClair,
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
          boxWidth: 12,
          font
        }
      },
      tooltip: {
        enabled: true,

        borderColor: couleurs.grisClair,
        borderWidth: 1,
        backgroundColor: couleurs.grisFonce,

        titleColor: couleurs.grisClair,
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
              return item.label
            }
          },

          label: (item) => {
            let y = item.raw as number | null
            let label = item.dataset.label

            if (y === null) return

            let itemLabel = `${Math.round(y * 100) / 100} ${unite.value}`

            if (label) {
              itemLabel = `${label} : ${itemLabel}`
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
  let labels: string[] = []

  if (jeu) {
    for (let { option, stack, color, label } of options.value) {
      let serie = jeu.series.find(
        (s) => s.type === props.type && s.option === option
      )

      if (serie) {
        let dataset = {
          label,
          backgroundColor: color,
          stack,
          data: serie.points.map((p) => p.valeur)
        } as ChartDataset<'bar'>

        labels = serie.points.map((p) => libellePas(props.pas, p.ts))
        datasets.push(dataset)
      }
    }
  }

  return { labels, datasets }
})
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
