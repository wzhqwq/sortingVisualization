import { useEffect, useState } from "react"
import NumberType from "../../structure/NumberType"
import "./number.scss"

type PropsType = {
  number: NumberType,
}

export default function Number({ number }: PropsType) {
  const [highlighted, setHighlighted] = useState(number.highlighted)
  const [hidden, setHidden] = useState(number.hidden)
  const [value, setValue] = useState(number.value)

  useEffect(() => {
    number.registerHooks(setHighlighted, setHidden, setValue)
    return () => number.unregisterHooks()
  }, [number])

  return (
    <div
      className={`number${value === null ? ' null' : ''}${hidden ? ' hide': ''}`}
      ref={number.ref}
    >
      <div className={`content transition${highlighted ? ' highlight' : ''}`}>
        {value ?? ""}
      </div>
    </div>
  )
}
