import IndexType from "../structure/IndexType"
import LinearTableType from "../structure/LinearTableType"
import NumberType from "../structure/NumberType"
import { UtilsType } from "../util/ContextWrapper"

export default function *insertionSort(input: number[], {declare, assign, compare, wait}: UtilsType) {
  let array = new LinearTableType(input)
  let current = new NumberType(null)
  let indexJ = new IndexType(null)
  let n = input.length
  declare("current", current)
  declare("结果", array)
  declare("j", indexJ)

  if (array.getLength() === 0) return
  
  array.get(0).highlight()
  for (let i = 1; i < n; i++) {
    yield assign(current, array.get(i))
    let j = i
    indexJ.value = array.get(i)
    while (j > 0 && (yield compare(array.get(j - 1), current)) > 0) {
      yield assign(array.get(j), array.get(j - 1))
      j--
      indexJ.value = array.get(j)
    }
    indexJ.value = null
    yield assign(array.get(j), current)
    yield wait(() => array.get(j).highlight())
  }
  current.value = null
}
