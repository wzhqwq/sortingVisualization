import BinaryTreeType from "../structure/BinaryTreeType"
import IndexType from "../structure/IndexType"
import LinearTableType from "../structure/LinearTableType"
import NumberType from "../structure/NumberType"
import { UtilsType } from "../util/ContextWrapper"

export default function *heapSort(input: number[], {declare, assign, compare, wait}: UtilsType) {
  let heap = new BinaryTreeType([0, ...input])
  let array = new LinearTableType(new Array(input.length).fill(null))
  let current = new NumberType(null)
  let indexC = new IndexType(null)
  let n = input.length
  declare("堆", heap)
  declare("结果", array)
  declare("要处理的节点", current)
  declare("c", indexC)

  function *heapify(root: number) {
    yield assign(current, heap.get(root))
    let c = root << 1
    indexC.icon = 'search'
    while (c <= n) {
      indexC.value = heap.get(c)
      if (c < n && (yield compare(heap.get(c), heap.get(c + 1))) < 0) {
        indexC.value = heap.get(++c)
      }
      if ((yield compare(current, heap.get(c))) >= 0) {
        break;
      }
      yield assign(heap.get(c >> 1), heap.get(c))
      c <<= 1
    }
    indexC.icon = 'ok'
    yield assign(heap.get(c >> 1), current)
    current.value = indexC.value = null
  }

  // 初始化堆
  for (let i = Math.floor(n / 2); i > 0; i--) {
    yield *heapify(i)
  }
  // 堆排序
  for (let i = 0; i < n; i++) {
    yield assign(array.get(i), heap.get(1))
    if (i < n - 1) {
      yield assign(heap.get(1), heap.get(n - i))
    }
    heap.get(n - i).value = null
    if (i < n - 1) {
      yield *heapify(1)
    }
  }
}
