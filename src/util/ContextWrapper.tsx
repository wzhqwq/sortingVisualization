import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Algorithm } from "../algorithm/algorithmType"
import NumberType from "../structure/NumberType"
import ValueType from "../structure/ValueType"
import VariableType from "../structure/VariableType"
import { Command } from "./Command"
import { Controller, Model, ControllerType, ModelType } from './contexts'

export type UtilReturnType = () => Promise<void | number>
export type GeneratorNextType = void | number
export type AnimationCommandHandlerType = (command: Command) => Promise<void>
export type UtilsType = {
  declare: <T extends ValueType<any>>(label: string, value: T) => void,
  assign: (destination: NumberType, source: NumberType) => UtilReturnType,
  wait: (fn?: () => void) => UtilReturnType,
  swap: (i: NumberType, j: NumberType) => UtilReturnType,
  compare: (i: NumberType, j: NumberType) => UtilReturnType,
}

const speedToDuration = [2000, 1000, 500, 250]

export default function ContextWrapper({ children }) {
  const [variables, setVariables] = useState<VariableType<ValueType<any>>[]>([])
  const [speed, setSpeed] = useState(1)

  const speedRef = useRef(1)
  const animationPromise = useRef<UtilReturnType>(() => new Promise(r => r()))
  const animationCommandHandler = useRef<AnimationCommandHandlerType>(null)
  const generator = useRef<Generator<UtilReturnType, void, GeneratorNextType>>(null)

  const declare = useCallback(<T extends ValueType<any>>(name: string, value: T) => {
    setVariables(variables => [...variables, new VariableType<T>(name, value)])
  }, [])
  const wait = useCallback((fn) => () =>
    new Promise<void>(resolve => {
      fn?.()
      setTimeout(resolve, speedToDuration[speedRef.current])
    })
  , [])
  const assign = useCallback((destination: NumberType, source: NumberType) => () =>
    animationCommandHandler.current?.(
      new Command("moveTo", source, destination, speedToDuration[speedRef.current])
    )
  , [])
  const swap = useCallback((a: NumberType, b: NumberType) => () =>
    animationCommandHandler.current?.(
      new Command("swap", a, b, speedToDuration[speedRef.current])
    )
  , [])
  const compare = useCallback((a: NumberType, b: NumberType) => async () => {
    await animationCommandHandler.current?.(
      new Command("compare", a, b, speedToDuration[speedRef.current],
                  a.value === b.value ? "=" : (a.value > b.value ? ">" : "<"))
    )
    return a.value - b.value
  }, [])

  const utils = useMemo<UtilsType>(() => ({
    declare,
    assign,
    wait,
    swap,
    compare,
  }), [declare, assign, wait, swap, compare])

  const step = useCallback(async () => {
    let result = generator.current?.next(await animationPromise?.current?.())
    if (result.done) return true
    animationPromise.current = result.value as UtilReturnType
    return false
  }, [])

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const onAnimationCommand = useCallback((handler: AnimationCommandHandlerType) => {
    animationCommandHandler.current = handler
  }, [])

  const startAlgorithm = useCallback((arr: number[], algorithm: Algorithm) => {
    generator.current = algorithm(arr, utils)
    let result = generator.current?.next()
    if (result.done) return true
    animationPromise.current = result.value as UtilReturnType
    return false
  }, [utils])
    
  const stopAlgorithm = useCallback(() => {
    generator.current = null
    setVariables([])
  }, [])

  const controller = useMemo<ControllerType>(() => ({
    step,
    setSpeed,
    onAnimationCommand,
    startAlgorithm,
    stopAlgorithm,
  }), [step, setSpeed, onAnimationCommand, startAlgorithm, stopAlgorithm])
  const model = useMemo<ModelType>(() => ({
    variables,
  }), [variables])

  return (
    <Controller.Provider value={controller}>
      <Model.Provider value={model}>
        <div className={`speed-${speed}`} style={{ height: "100%" }}>
          {children}
        </div>
      </Model.Provider>
    </Controller.Provider>
  )
}
