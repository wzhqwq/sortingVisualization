import { Fragment } from "react"
import IndexType from "../structure/IndexType"
import LinearTableType from "../structure/LinearTableType"
import LoggerType from "../structure/LoggerType"
import { UtilsType } from "../util/ContextWrapper"

export default function* quickSort(input: number[], { declare, compare, swap, wait }: UtilsType) {
  const array = new LinearTableType(input)
  const indexI = new IndexType(null), indexJ = new IndexType(null)
  const logger = new LoggerType()
  let n = input.length
  declare("调用栈", logger)
  declare("结果", array)
  declare("i", indexI)
  declare("j", indexJ)

  function* sort(l: number, r: number) {
    let pivot = array.get(l)
    let i = l + 1, j = r
    indexI.value = array.get(l + 1)
    indexJ.value = array.get(r)
    while (i <= j) {
      indexI.icon = 'right'
      while (i <= r && (yield compare(pivot, indexI.value)) > 0) {
        indexI.value = array.get(++i)
      }
      indexI.icon = ''
      indexJ.icon = 'left'
      while (l <= j && (yield compare(indexJ.value, pivot)) > 0) {
        indexJ.value = array.get(--j)
      }
      indexJ.icon = ''
      if (i <= j) {
        yield swap(array.get(i), array.get(j))
        indexI.value = array.get(++i)
        indexJ.value = array.get(--j)
      }
    }
    yield swap(array.get(l), array.get(j))
    array.get(j).highlight()
    indexI.value = indexJ.value = null
    if (l < j - 1) {
      yield wait(() => logger.addLog((<Fragment>{leftRange}{computing}{toRange(l, j - 1)}</Fragment>), true))
      for (let k = j; k <= r; k++) array.get(k).hidden = true
      yield* sort(l, j - 1)
      yield wait(() => logger.changeLatestLog((<Fragment>{leftRange}{finished}{toRange(l, j - 1)}</Fragment>)))
      for (let k = j; k <= r; k++) array.get(k).hidden = false
    }
    else {
      yield wait(() => logger.addLog((<Fragment>{leftRange}{skipped}</Fragment>), true))
      if (l === j - 1) array.get(l).highlight()
    }
    if (j + 1 < r) {
      yield wait(() => logger.addLog((<Fragment>{rightRange}{computing}{toRange(j + 1, r)}</Fragment>)))
      for (let k = l; k <= j; k++) array.get(k).hidden = true
      yield* sort(j + 1, r)
      yield wait(() => logger.changeLatestLog(<Fragment>{rightRange}{finished}{toRange(j + 1, r)}</Fragment>))
      for (let k = l; k <= j; k++) array.get(k).hidden = false
    }
    else {
      yield wait(() => logger.addLog((<Fragment>{rightRange}{computing}{toRange(j + 1, r)}</Fragment>)))
      if (j + 1 === r) array.get(r).highlight()
    }
    yield wait(() => {
      logger.popLog()
      logger.popLog()
    })
  }

  yield wait(() => logger.addLog((<Fragment>{computing}{toRange(0, n - 1)}</Fragment>)))
  yield* sort(0, n - 1)
  yield wait(() => logger.changeLatestLog(<Fragment>{finished}{toRange(0, n - 1)}</Fragment>))
  yield wait(() => logger.popLog())
}

const leftRange = (<div className="info">左区间</div>)
const rightRange = (<div className="info">右区间</div>)
const finished = (<div className="success">结束</div>)
const skipped = (<div className="gray">不运算</div>)
const computing = (<div className="primary">运算中</div>)

const toRange = (l: number, r: number) => (<div className="text">{`[${l}, ${r}]`}</div>)