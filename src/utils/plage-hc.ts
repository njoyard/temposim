import { Ref, ref } from 'vue'

export default class PlageHeuresCreuses {
  _debut: Ref<number>
  _fin: Ref<number>

  constructor(debut: number, fin: number) {
    this._debut = ref(debut)
    this._fin = ref(fin)
  }

  _getter(ref: Ref<number>) {
    let hours = Math.floor(ref.value)
    let shours = `${hours}`
    let minutes = `${Math.floor(60 * (ref.value - hours))}`

    if (minutes.length === 1) minutes = `0${minutes}`
    if (shours.length === 1) shours = `0${hours}`

    return `${shours}:${minutes}`
  }

  _setter(ref: Ref<number>, value: string) {
    let [hours, minutes] = value.split(':').map(Number)
    ref.value = hours + minutes / 60
  }

  get debut() {
    return this._getter(this._debut)
  }

  set debut(v: string) {
    this._setter(this._debut, v)
  }

  get fin() {
    return this._getter(this._fin)
  }

  set fin(v: string) {
    this._setter(this._fin, v)
  }

  get duree() {
    let debut = this._debut.value
    let fin = this._fin.value

    if (debut > fin) fin += 24

    return fin - debut
  }

  intersection(debut: number, fin: number) {
    let debutPlage = this._debut.value
    let finPlage = this._fin.value

    let intervalles =
      debutPlage > finPlage
        ? [
            [0, finPlage],
            [debutPlage, 24]
          ]
        : [[debutPlage, finPlage]]

    return intervalles.reduce((taille, [debutInt, finInt]) => {
      if (debutInt >= fin || debut >= finInt) return taille
      return taille + Math.min(fin, finInt) - Math.max(debut, debutInt)
    }, 0)
  }
}
