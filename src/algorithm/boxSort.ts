import BucketType from "../structure/BucketType";
import { UtilsType } from "../util/ContextWrapper";

export default function *boxSort(input: number[], {declare, compare, assign, wait}: UtilsType) {
  let home = new BucketType(input)
  let max = input.reduce((a, b) => Math.max(a, b), input[0])
  let min = input.reduce((a, b) => Math.min(a, b), input[0])
  let buckets = new Array(max - min + 1).fill(0).map(() => new BucketType([]))
  let n = input.length
  declare("结果", home)
  buckets.forEach((bucket, offset) => declare(`${min + offset}`, bucket))

  for (let i = 0; i < n; i++) {
    yield assign(buckets[home.get(i).value - min].prepareInsert(), home.get(i))
  }
}
