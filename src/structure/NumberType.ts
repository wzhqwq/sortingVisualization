import { Dispatch, SetStateAction } from "react"
import SubstanceType from "./SubstanceType"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class NumberType extends SubstanceType<number> {
  private _highlighted: boolean = false
  private _hidden: boolean = false

  private setHighlighted: Hook<boolean> = null
  private setHidden: Hook<boolean> = null

  highlight() {
    this.highlighted = true
  }

  unhighlight() {
    this.highlighted = false
  }

  get highlighted() {
    return this._highlighted
  }

  set highlighted(highlighted: boolean) {
    this._highlighted = highlighted
    this.setHighlighted?.(highlighted)
  }

  get hidden() {
    return this._hidden
  }

  set hidden(hidden: boolean) {
    this._hidden = hidden
    this.setHidden?.(hidden)
  }

  registerHooks(setHighlighted: Hook<boolean>, setHidden: Hook<boolean>, setValue: Hook<number>) {
    this.registerValueHook(setValue)
    this.setHighlighted = setHighlighted
    this.setHidden = setHidden
    setHighlighted(this._highlighted)
    setHidden(this._hidden)
  }

  unregisterHooks() {
    super.unregisterValueHook()
    this.setHighlighted = null
  }

  copy(original: NumberType) {
    super.copy(original)
    this.highlighted = original._highlighted
    this.hidden = original._hidden
  }
}