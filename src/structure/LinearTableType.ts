import NumberType from "./NumberType"
import ValueType from "./ValueType"

export default class LinearTableType extends ValueType<NumberType[]> {
  constructor(arr: number[]) {
    super(arr.map(value => typeof value === "undefined" ? undefined : new NumberType(value)))
  }

  get(index: number) {
    if (index < 0 || index >= this.value.length) {
      throw new Error(`越界啦笨蛋哈哈哈哈哈: ${index}`)
    }
    return this.value[index]
  }

  getLength() {
    return this.value.length
  }

  map<T>(callback: (value: NumberType, index: number, array: NumberType[]) => T) {
    return this.value.map(callback)
  }
}