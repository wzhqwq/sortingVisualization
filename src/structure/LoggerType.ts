import { Dispatch, SetStateAction, ReactElement } from "react"
import ValueType from "./ValueType"

type Hook<T> = Dispatch<SetStateAction<T>>

export type LogType = {
  content: ReactElement,
  indent: number,
}

export default class LoggerType extends ValueType<LogType[]> {
  constructor() {
    super([])
  }

  public addLog(content: ReactElement, isChild: boolean = false) {
    const indent = (this.value.length !== 0 ? this.value[this.value.length - 1].indent : 0) + (isChild ? 1 : 0)
    this.value.push({ content, indent })
    this.value = this.value.slice()
  }

  public changeLatestLog(content: ReactElement) {
    this.value[this.value.length - 1].content = content
    this.value = this.value.slice()
  }

  public popLog() {
    this.value.pop()
    this.value = this.value.slice()
  }

  public registerHooks(setLogs: Hook<LogType[]>) {
    this.registerValueHook(setLogs)
  }
  public unregisterHooks() {
    this.unregisterValueHook()
  }
}