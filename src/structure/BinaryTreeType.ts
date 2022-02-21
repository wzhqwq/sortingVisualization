import LinearTableType from "./LinearTableType"
import NumberType from "./NumberType"

export default class BinaryTreeType extends LinearTableType {
  getHeight() {
    return Math.floor(Math.log2(this.value.length - 1)) + 1
  }
  getLayers() {
    let layers: NumberType[][] = []
    let start = 1, i = 1
    for (; start + i <= this.value.length; i <<= 1) {
      layers.push(this.value.slice(start, start + i))
      start += i
    }
    if (start < this.value.length) {
      layers.push(this.value.slice(start).concat(new Array(start + i - this.value.length).fill(null)))
    }
    return layers
  }
}