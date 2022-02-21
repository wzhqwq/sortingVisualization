import LinearTableType from "./LinearTableType"
import NumberType from "./NumberType"

export default class BucketType extends LinearTableType {
  prepareInsert() {
    let t = new NumberType(null)
    this.value.push(t)
    return t
  }

  clear() {
    this.value = []
  }
}