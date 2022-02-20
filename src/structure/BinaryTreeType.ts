import LinearTableType from "./LinearTableType"

export default class BinaryTreeType extends LinearTableType {
  getHeight() {
    return Math.floor(Math.log2(this.value.length)) + 1
  }
}