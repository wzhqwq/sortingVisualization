import BucketType from "../structure/BucketType";
import { UtilsType } from "../util/ContextWrapper";

export default function *boxSort(input: number[], {declare, assign, wait}: UtilsType) {
  let home = new BucketType(input)
  let max = input.reduce((a, b) => Math.max(a, b), input[0])
  let min = input.reduce((a, b) => Math.min(a, b), input[0])
  let buckets = new Array(max - min + 1).fill(0).map(() => new BucketType([]))
  let n = input.length
  declare("结果", home)
  buckets.forEach((bucket, offset) => declare(`${min + offset}`, bucket))

  for (let i = 0; i < n; i++) {
    let bucket = buckets[home.get(i).value - min]
    yield assign(bucket.prepareInsert(), home.get(i), true)
    bucket.finishPreparation()
  }
  home.clear()
  for (let i = 0; i < buckets.length; i++) {
    for (let j = 0; j < buckets[i].getLength(); j++) {
      yield assign(home.prepareInsert(), buckets[i].get(j), true)
      home.finishPreparation()
    }
    buckets[i].clear()
  }
}
