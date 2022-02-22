import { ArrowForward, ArrowBack, Search, Check } from "@mui/icons-material"
import { useEffect, useState } from "react"
import IndexType from "../../structure/IndexType"
import NumberType from "../../structure/NumberType"

import './indexer.scss'

export type PropsType = {
  index: IndexType,
  label: string,
}

const icons = {
  'left': <ArrowBack />,
  'right': <ArrowForward />,
  'search': <Search />,
  'ok': <Check className='ok' />
}

export default function Indexer({ index, label }: PropsType) {
  const [target, setTarget] = useState<NumberType>(index.value)
  const [icon, setIcon] = useState("")
  const [show, setShow] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    index.registerHooks(setTarget, setIcon)
    return () => index.unregisterHooks()
  }, [index])

  useEffect(() => {
    if (!target) {
      setShow(false)
      return
    }
    const rect = target.getRect()
    if (!rect) {
      setShow(false)
      return
    }
    setX(rect.x + rect.width / 2 - 50)
    setY(rect.y + rect.height)
    setShow(true)
  }, [target])

  return (
    <div className={`indexer${show ? ' show' : ''}`} style={{ left: `${x}px`, top: `${y}px` }}>
      <div className="label">
        {
          icon && (
            <div className="icon">{icons[icon]}</div>
          )
        }
        {label}
      </div>
    </div>
  )
}