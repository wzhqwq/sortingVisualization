import { useCallback, useContext, useEffect, useRef, useState } from "react"
import LinearTableType from "../../structure/LinearTableType"
import NumberType from "../../structure/NumberType"
import LinkedNodeType from "../../structure/LinkedNodeType"
import ValueType from "../../structure/ValueType"
import IndexType from "../../structure/IndexType"
import VariableType from "../../structure/VariableType"
import { Controller, Model } from "../../util/contexts"
import LinearTable from "../structure/LinearTable"
import Number from "../value/Number"
import LinkedNode from "../structure/LinkedNode"

import "./stage.scss"
import Indexer from "../structure/Indexer"
import LoggerType from "../../structure/LoggerType"
import Logger from "../structure/Logger"

const numActor1 = new NumberType(null)
const numActor2 = new NumberType(null)
const nodeActor = new LinkedNodeType(null, null)

function Label({ children, inline = false, label }) {
  return (
    <div className={`variable${inline ? ' inline' : ''}`} key={label}>
      <div className="variable-label">
        <div className="label-text">{label + (inline ? " =" : "")}</div>
      </div>
      {children}
    </div>
  )
}

const getElement = (variable: VariableType<ValueType<any>>) => {
  if (variable.value instanceof LinearTableType)
    return (
      <Label label={variable.label} key={variable.label}>
        <LinearTable data={variable.value} />
      </Label>
    )
  return null
}

enum AnimationType {
  None,
  Swap,
  Compare,
  Move,
  NodeMove,
  Mark,
}

export default function Stage() {
  const [animationType, setAnimationType] = useState(AnimationType.None)
  const [compareSymbol, setCompareSymbol] = useState("")

  const controller = useContext(Controller)
  const { variables } = useContext(Model)

  const stageRef = useRef<HTMLDivElement>(null)
  const compareRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)

  const toStagePosition = useCallback((rect: DOMRect) => {
    const stage = stageRef.current?.getBoundingClientRect()
    rect.x -= stage?.x ?? 0
    rect.y -= stage?.y ?? 0
    return rect
  }, [])

  useEffect(() => {
    controller.onAnimationCommand(async command => {
      let keyframe: KeyframeEffect = null
      let extraAnimationPromise: Promise<void> = null
      let afterWork: () => void = null
      let rectA = toStagePosition(command.a.getRect()),
          rectB = toStagePosition(command.b.getRect())
      let rangeWidth = Math.max(rectA.width * 2 + 10, rectB.x + rectB.width - rectA.x)
      let animationOptions: KeyframeEffectOptions = {
        duration: command.duration,
      }
      
      if (command.a instanceof NumberType && command.b instanceof NumberType) {
        let a = command.a as NumberType, b = command.b as NumberType
        switch (command.type) {
          case "swap":
            numActor1.copy(a)
            numActor2.copy(b)
            a.value = b.value = null
            keyframe = new KeyframeEffect(numActor1.ref.current, [
              { transform: `translate(${rectA.left}px, ${rectA.top}px)` },
              { transform: `translate(${(rectA.left + rectB.left) / 2}px, ${(rectA.top + rectB.top) / 2}px) scale(.8)` },
              { transform: `translate(${rectB.left}px, ${rectB.top}px)` },
            ], animationOptions)
            {
              const oppositeKeyframe = new KeyframeEffect(numActor2.ref.current, [
                { transform: `translate(${rectB.left}px, ${rectB.top}px)` },
                { transform: `translate(${(rectA.left + rectB.left) / 2}px, ${(rectA.top + rectB.top) / 2}px) scale(1.2)` },
                { transform: `translate(${rectA.left}px, ${rectA.top}px)` },
              ], animationOptions)
              const oppositeAnimation = new Animation(oppositeKeyframe, document.timeline)
              extraAnimationPromise = new Promise(resolve => {
                oppositeAnimation.onfinish = () => resolve()
                oppositeAnimation.play()
              })
            }
            afterWork = () => {
              a.copy(numActor2)
              b.copy(numActor1)
              numActor1.value = numActor2.value = null
            }
            setAnimationType(AnimationType.Swap)
            break
          case "moveTo":
            numActor1.copy(a)
            a.hidden = true
            keyframe = new KeyframeEffect(numActor1.ref.current, [
              { transform: `translate(${rectA.left}px, ${rectA.top}px)` },
              { transform: `translate(${(rectA.left + rectB.left) / 2}px, ${(rectA.top + rectB.top) / 2}px) scale(1.2)` },
              { transform: `translate(${rectB.left}px, ${rectB.top}px)` },
            ], animationOptions)
            afterWork = () => {
              b.copy(numActor1)
              numActor1.value = null
            }
            setAnimationType(AnimationType.Move)
            break
          case "compare":
            numActor1.copy(a)
            numActor2.copy(b)
            compareRef.current.style.width = `${rangeWidth}px`
            compareRef.current.style.left = `${rectA.left}px`
            compareRef.current.style.top = `${rectA.top}px`
            numActor1.ref.current.style.transform = `translate(${rectA.left}px, ${rectA.top}px)`
            numActor2.ref.current.style.transform = `translate(${rectB.left}px, ${rectB.top}px)`
            const keyframes = command.duration <= 500 ? [
              { filter: 'opacity(1)' },
              { filter: 'opacity(1)' },
            ] : [
              { filter: 'opacity(0)' },
              { filter: 'opacity(1)', offset: 0.3 },
              { filter: 'opacity(1)', offset: 0.7 },
              { filter: 'opacity(0)' },
            ]
            keyframe = new KeyframeEffect(compareRef.current, keyframes, animationOptions)
            {
              const maskKeyframe = new KeyframeEffect(maskRef.current, keyframes, animationOptions)
              const maskAnimation = new Animation(maskKeyframe, document.timeline)
              extraAnimationPromise = new Promise(resolve => {
                maskAnimation.onfinish = () => resolve()
                maskAnimation.play()
              })
            }
            afterWork = () => {
              numActor1.value = numActor2.value = null
            }
            setCompareSymbol(command.extra)
            setAnimationType(AnimationType.Compare)
            break
          case "mark":
            // highlight
            break
          case "clearMark":
            break
          default:
            return null
        }
      }
      const animationPromise: Promise<void> = new Promise(resolve => {
        const animation = new Animation(keyframe, document.timeline)
        animation.onfinish = () => {
          afterWork?.()
          setTimeout(resolve, 0)
          setAnimationType(AnimationType.None)
        }
        animation.play()
      })
      await animationPromise
      if (extraAnimationPromise) await extraAnimationPromise
    })
  }, [controller, toStagePosition])

  const logger = variables.find(v => v.value instanceof LoggerType) as VariableType<LoggerType>

  const getDataStage = useCallback(() => (
    <div className="stage-static">
      <div className="inline-variables">
        {variables
        .filter(v => v.value instanceof NumberType)
        .map(variable => (
          <Label inline label={variable.label} key={variable.label}>
            <div className="number-room">
              <Number number={variable.value as NumberType} />
            </div>
          </Label>
        ))}
      </div>
      {variables.map(variable => getElement(variable))}
    </div>
  ), [variables])

  return (
    <div className="stage" ref={stageRef}>
      {
        logger ? (
          <div className="stage-static logged">
            <div className="stage-logger">
              <Label label={logger.label} key={logger.label}>
                <Logger logger={logger.value} />
              </Label>
            </div>
            {getDataStage()}
          </div>
        ) : getDataStage()
      }
      <div className="stage-animation">
        <div className="mask" ref={maskRef}>
        </div>
        <Number number={numActor1} />
        <Number number={numActor2} />
        <LinkedNode node={nodeActor} hide={
          animationType !== AnimationType.NodeMove
        } />
        <div className="compare-wrap" ref={compareRef}>
          <div className="compare-symbol">{compareSymbol}</div>
        </div>
        {variables
          .filter(variable => variable.value instanceof IndexType)
          .map(variable => 
            (<Indexer label={variable.label} index={variable.value as IndexType} key={variable.label} />)
          )
        }
      </div>
    </div>
  )
}