import { Dispatch, SetStateAction } from "react"
import LinkedNodeType from "./LinkedNodeType"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class PointerType {
  private _to: LinkedNodeType

  private setTo: Hook<LinkedNodeType> = null

  set to(node: LinkedNodeType) {
    this.setTo?.(node)
    this._to = node
  }

  get to() {
    return this._to
  }
  
  constructor(node: LinkedNodeType) {
    this._to = node
  }

  registerHooks(setTo: Hook<LinkedNodeType>) {
    this.setTo = setTo
    setTo(this._to)
  }

  unregisterHooks() {
    this.setTo = null
  }
}