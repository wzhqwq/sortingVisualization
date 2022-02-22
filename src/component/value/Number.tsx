import { ArrowForward } from "@mui/icons-material"
import { Fragment, useContext, useEffect, useState } from "react"
import NumberType from "../../structure/NumberType"
import { Model } from "../../util/contexts"
import "./number.scss"

type PropsType = {
  number: NumberType,
  linked?: boolean,
}

const toEmphasized = (value: string, divider: string) => {
  let preLen = value.length - divider.length
  return (
    <Fragment>
      {preLen > 0 && (<div className="weaken">{value.substring(0, preLen)}</div>)}
      {preLen >= 0 && (<div>{value.substring(preLen, preLen + 1)}</div>)}
      {divider.length > 1 && (<div className="weaken">{value.substring(preLen + 1)}</div>)}
    </Fragment>
  )
}

export default function Number({ number, linked = false }: PropsType) {
  const [highlighted, setHighlighted] = useState(number.highlighted)
  const [hidden, setHidden] = useState(number.hidden)
  const [value, setValue] = useState(number.value)

  const { divider } = useContext(Model)

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
        {value !== null ? (divider !== null ? toEmphasized(`${value}`, `${divider}`) : value) : ""}
      </div>
      <div className={`link transition${linked ? ' show' : ''}`}>
        <ArrowForward />
      </div>
    </div>
  )
}
