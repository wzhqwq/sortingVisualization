import IndexType from "../structure/IndexType"
import LinearTableType from "../structure/LinearTableType"
import { UtilsType } from "../util/ContextWrapper"

export default function *selectionSort(input: number[], {declare, compare, swap, wait}: UtilsType) {
  let array = new LinearTableType(input)
  let n = input.length
  let indexMax = new IndexType(null)
  declare("结果", array)
  declare("max", indexMax)
  
  for (let i = 0; i < n - 1; i++) {
    indexMax.value = array.get(0)
    for (let j = 1; j < n - i; j++) {
      if ((yield compare(indexMax.value, array.get(j))) < 0) {
        indexMax.value = array.get(j)
      }
    }
    let max = indexMax.value
    indexMax.value = null
    if (max !== array.get(n - 1 - i)) {
      yield swap(array.get(n - 1 - i), max)
    }
    yield wait(() => array.get(n - 1 - i).highlight())
  }
  array.get(0).highlight()
}
