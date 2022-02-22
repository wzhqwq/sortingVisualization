import { Dispatch, SetStateAction } from "react"
import LinearTableType from "./LinearTableType"
import NumberType from "./NumberType"

type Hook<T> = Dispatch<SetStateAction<T>>

export default class BucketType extends LinearTableType {
  private setPrepare: Hook<boolean>

  prepareInsert() {
    let t = new NumberType(null)
    this.value = this.value.concat(t)
    this.setPrepare?.(true)
    return t
  }

  finishPreparation() {
    this.setPrepare?.(false)
  }

  clear() {
    this.value = []
  }

  public registerHooks(setData: Hook<NumberType[]>, setPrepare: Hook<boolean>) {
    this.registerValueHook(setData)
    this.setPrepare = setPrepare
  }
  public unregisterHooks() {
    this.unregisterValueHook()
    this.setPrepare = null
  }
}