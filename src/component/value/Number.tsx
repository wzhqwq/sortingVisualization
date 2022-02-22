import { ArrowForward } from "@mui/icons-material"
import { useEffect, useState } from "react"
import NumberType from "../../structure/NumberType"
import "./number.scss"

type PropsType = {
  number: NumberType,
  linked?: boolean,
}

export default function Number({ number, linked = false }: PropsType) {
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
      <div className={`link transition${linked && value !== null ? ' show' : ''}`}>
        <ArrowForward />
      </div>
    </div>
  )
}
