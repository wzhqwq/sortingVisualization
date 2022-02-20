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
      className={`number${highlighted ? ' highlight' : ''}${value === null ? ' null' : ''}`}
      style={{ filter: hidden ? 'opacity(.3)' : '' }}
      ref={number.ref}
    >
      {value ?? ""}
    </div>
  )
}
