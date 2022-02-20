import LinearTableType from "../structure/LinearTableType"
import { UtilsType } from "../util/ContextWrapper"

export default function *bubbleSort(input: number[], {declare, compare, swap}: UtilsType) {
  let swapped = true
  let array = new LinearTableType(input)
  let n = input.length
  declare("结果", array)
  
  let i: number
  for (i = 0; swapped && i < n - 1; i++) {
    swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      if ((yield compare(array.get(j), array.get(j + 1))) > 0) {
        yield swap(array.get(j), array.get(j + 1))
        swapped = true
      }
    }
    array.get(n - 1 - i).highlight()
  }
  for (let j = 0; j < n - i; j++) {
    array.get(j).highlight()
  }
}
