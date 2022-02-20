import { Dispatch, SetStateAction } from "react"
import NumberType from "./NumberType"
import PointerType from "./PointerType"
import SubstanceType from "./SubstanceType"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class LinkedNodeType extends SubstanceType<NumberType> {
  _next: PointerType

  get next() {
    return this._next
  }

  constructor(value: number, next: LinkedNodeType) {
    super(new NumberType(value))
    this._next = new PointerType(next)
  }

  registerHooks(setNext: Hook<LinkedNodeType>) {
    this._next.registerHooks(setNext)
  }

  unregisterHooks() {
    this._value.unregisterHooks()
    this._next.unregisterHooks()
  }
}