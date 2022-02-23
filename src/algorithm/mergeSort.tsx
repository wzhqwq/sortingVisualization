import { ArrowForward } from "@mui/icons-material"
import { Fragment } from "react"
import IndexType from "../structure/IndexType"
import LinearTableType from "../structure/LinearTableType"
import LoggerType from "../structure/LoggerType"
import { UtilsType } from "../util/ContextWrapper"

export default function *mergeSort(input: number[], {declare, compare, assign, wait}: UtilsType) {
  const a = new LinearTableType(input)
  const b = new LinearTableType(new Array(input.length).fill(null))
  const logger = new LoggerType()
  const indexI = new IndexType(null), indexJ = new IndexType(null)
  let n = input.length
  declare("结果", a)
  declare("临时", b)
  declare("状态", logger)
  declare("i", indexI)
  declare("j", indexJ)

  // 由于递归式归并排序每一层都有个数组，不易于展示，所以使用非递归归并排序
  let s = 1
  function *merge(a: LinearTableType, b: LinearTableType, l: number, m: number, r: number) {
    let i = l, j = m + 1, k = l
    indexI.value = a.get(i)
    indexJ.value = a.get(j)
    while (i <= m && j <= r) {
      if ((yield compare(a.get(j), a.get(i))) > 0) {
        yield assign(b.get(k), a.get(i))
        indexI.value = a.get(++i)
      }
      else {
        yield assign(b.get(k), a.get(j))
        indexJ.value = a.get(++j)
      }
      k++
    }
    while (i <= m) {
      yield assign(b.get(k), a.get(i))
      indexI.value = a.get(++i)
      k++
    }
    while (j <= r) {
      yield assign(b.get(k), a.get(j))
      indexJ.value = a.get(++j)
      k++
    }
    indexI.value = indexJ.value = null
  }
  function *mergeSequence(a: LinearTableType, b: LinearTableType) {
    yield wait(() => logger.addLog(
      <Fragment>
        <div className="primary">正在归并</div>
        <div className="text">{s}</div>
        <ArrowForward />
        <div className="text">{s << 1}</div>
      </Fragment>
    ))
    let s2 = s << 1
    for (let i = s2; i < n; i++) {
      a.get(i).hidden = true
    }
    for (let i = 0; i + s2 <= n; i += s2) {
      yield *merge(a, b, i, i + s - 1, i + s2 - 1)
      let next = Math.min(i + (s2 << 1), n)
      for (let j = i + s2; j < next; j++) {
        a.get(j).hidden = false
      }
    }
    if (n % s2 !== 0) {
      let start = n - n % s2
      if (start + s < n) {
        yield *merge(a, b, start, start + s - 1, n - 1)
      }
      else {
        for (let i = start; i < n; i++) {
          yield assign(b.get(i), a.get(i))
        }
      }
    }
    yield wait(() => logger.changeLatestLog(
      <Fragment>
        <div className="primary">完成</div>
        <div className="text">{s}</div>
        <ArrowForward />
        <div className="text">{s << 1}</div>
      </Fragment>
    ))
    for (let i = 0; i < n; i++) {
      a.get(i).value = null
    }
  }
  while (s <= n) {
    yield *mergeSequence(a, b)
    s <<= 1
    yield *mergeSequence(b, a)
    s <<= 1
  }
}