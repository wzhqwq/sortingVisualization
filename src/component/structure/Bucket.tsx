import { useEffect, useState } from "react"
import BucketType from "../../structure/BucketType"
import Number from "../value/Number"

import './bucket.scss'

type PropsType = {
  bucket: BucketType,
  label: string
}

export default function Bucket({ bucket, label }: PropsType) {
  const [data, setData] = useState(bucket.value)
  const [prepare, setPrepare] = useState(false)
  
  useEffect(() => {
    bucket.registerHooks(setData, setPrepare)
    return () => bucket.unregisterHooks()
  }, [bucket])

  return (
    <div className="bucket">
      <div className="label">{label}</div>
      <div className="numbers">
        {
          data.map((number, index) => (
            <div className="bucket-item" key={index}>
              <Number number={number} linked={index < data.length - (prepare ? 2 : 1)} />
            </div>
          ))
        }
      </div>
    </div>
  )
}