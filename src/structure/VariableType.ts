import ValueType from "./ValueType"

export default class VariableType<T extends ValueType<any>> {
  label: string
  value: T

  constructor (label: string, value: T) {
    this.label = label
    this.value = value
  }
}