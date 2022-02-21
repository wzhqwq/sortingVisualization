import BucketType from "../../structure/BucketType"
import Number from "../value/Number"

import './bucket.scss'

type PropsType = {
  bucket: BucketType,
  label: string
}

export default function Bucket({ bucket, label }: PropsType) {
  return (
    <div className="bucket">
      <div className="label">{label}</div>
      <div className="numbers">
        {
          bucket.value.map((number, index) => (
            <div className="bucket-item" key={index}>
              <Number number={number} linked />
            </div>
          ))
        }
      </div>
    </div>
  )
}