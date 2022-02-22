import BucketType from "../structure/BucketType";
import { UtilsType } from "../util/ContextWrapper";

export default function *radixSort(input: number[], {declare, assign, wait, setDivider}: UtilsType) {
  let home = new BucketType(input)
  let buckets = new Array(10).fill(0).map(() => new BucketType([]))
  let max = input.reduce((a, b) => Math.max(a, b), input[0])
  let n = input.length
  declare("结果", home)
  buckets.forEach((bucket, offset) => declare(`${offset}`, bucket))

  function *sort(divider: number) {
    for (let i = 0; i < n; i++) {
      let bucket = buckets[Math.floor(home.get(i).value % (divider * 10) / divider)]
      yield assign(bucket.prepareInsert(), home.get(i))
      bucket.finishPreparation()
    }
    home.clear()
    for (let i = 0; i < buckets.length; i++) {
      for (let j = 0; j < buckets[i].getLength(); j++) {
        yield assign(home.prepareInsert(), buckets[i].get(j))
        home.finishPreparation()
      }
      buckets[i].clear()
    }
  }

  for (let i = 1; i <= max; i *= 10) {
    yield wait(() => setDivider(i))
    yield *sort(i)
  }
  yield wait(() => setDivider(null))
}
