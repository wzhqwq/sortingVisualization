import NumberType from "./NumberType"
import ValueType from "./ValueType"
import { Dispatch, SetStateAction } from "react"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class IndexType extends ValueType<NumberType> {
  private setIcon: Hook<string> = null

  private _icon: string = ""

  set icon(value: string) {
    this._icon = value
    this.setIcon?.(value)
  }

  get icon() {
    return this._icon
  }

  public registerHooks(setTarget: Hook<NumberType>, setIcon: Hook<string>) {
    this.registerValueHook(setTarget)
    this.setIcon = setIcon
    setIcon(this._icon)
  }
  public unregisterHooks() {
    this.unregisterValueHook()
    this.setIcon = null
  }
}