import { Dispatch, SetStateAction } from "react"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class ValueType<T> {
  protected _value: T
  private setValue: Hook<T> = null

  constructor(value: T) {
    this._value = value
  }

  set value(value: T) {
    this.setValue?.(value)
    this._value = value
  }

  get value() {
    return this._value
  }

  protected registerValueHook(setValue: Hook<T>) {
    this.setValue = setValue
    setValue(this._value)
  }

  protected unregisterValueHook() {
    this.setValue = null
  }

  copy(original: ValueType<T>) {
    this.value = original._value
  }
}