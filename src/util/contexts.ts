import { createContext } from "react"
import { Algorithm } from "../algorithm/algorithmType"
import ValueType from "../structure/ValueType"
import Variable from "../structure/VariableType"
import { AnimationCommandHandlerType } from "./ContextWrapper"

export const Controller = createContext<ControllerType>({
  step: null,
  setSpeed: null,
  onAnimationCommand: null,
  startAlgorithm: null,
  stopAlgorithm: null,
})

export const Model = createContext<ModelType>({
  variables: [],
  divider: null,
})

export type ControllerType = {
  step: () => Promise<boolean>,
  setSpeed: (speed: number) => void,
  onAnimationCommand: (handler: AnimationCommandHandlerType) => void,
  startAlgorithm: (arr: number[], algorithm: Algorithm) => boolean,
  stopAlgorithm: () => void,
}

export type ModelType = {
  variables: Variable<ValueType<any>>[],
  divider: number,
}