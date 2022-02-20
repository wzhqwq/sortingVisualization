import { createRef, RefObject } from "react"
import ValueType from "./ValueType"

export default class SubstanceType<T> extends ValueType<T> {
  private _ref: RefObject<HTMLDivElement>

  get ref() {
    return this._ref
  }

  constructor(value: T) {
    super(value)
    this._ref = createRef<HTMLDivElement>()
  }

  getRect() {
    return this._ref.current?.getBoundingClientRect?.()
  }
}