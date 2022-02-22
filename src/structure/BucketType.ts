import { Dispatch, SetStateAction } from "react"
import LinearTableType from "./LinearTableType"
import NumberType from "./NumberType"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class BucketType extends LinearTableType {
  private _prepare: boolean = false

  private setPrepare: Hook<boolean> = null

  prepareInsert() {
    let t = new NumberType(null)
    this.value = this.value.concat(t)
    this._prepare = true
    this.setPrepare?.(true)
    return t
  }

  finishPreparation() {
    this._prepare = false
    this.setPrepare?.(false)
  }

  clear() {
    this.value = []
  }

  public registerHooks(setData: Hook<NumberType[]>, setPrepare: Hook<boolean>) {
    this.registerValueHook(setData)
    this.setPrepare = setPrepare
    setPrepare(this._prepare)
  }
  public unregisterHooks() {
    this.unregisterValueHook()
    this.setPrepare = null
  }
}