import { useCallback, useContext, useEffect, useRef, useState } from "react"
import LinearTableType from "../../structure/LinearTableType"
import NumberType from "../../structure/NumberType"
import ValueType from "../../structure/ValueType"
import IndexType from "../../structure/IndexType"
import VariableType from "../../structure/VariableType"
import { Controller, Model } from "../../util/contexts"
import LinearTable from "../structure/LinearTable"
import Number from "../value/Number"

import "./stage.scss"
import Indexer from "../structure/Indexer"
import LoggerType from "../../structure/LoggerType"
import Logger from "../structure/Logger"
import BinaryTreeType from "../../structure/BinaryTreeType"
import BinaryTree from "../structure/BinaryTree"
import BucketType from "../../structure/BucketType"
import Bucket from "../structure/Bucket"

const numActor1 = new NumberType(null)
const numActor2 = new NumberType(null)

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
  if (variable.value instanceof BinaryTreeType)
    return (
      <Label label={variable.label} key={variable.label}>
        <BinaryTree data={variable.value} />
      </Label>
    )
  if (variable.value instanceof BucketType)
    return (
      <Bucket bucket={variable.value} label={variable.label} key={variable.label} />
    )
  if (variable.value instanceof LinearTableType)
    return (
      <Label label={variable.label} key={variable.label}>
        <LinearTable data={variable.value} />
      </Label>
    )
  return null
}

export default function Stage() {
  const [compareSymbol, setCompareSymbol] = useState("")

  const controller = useContext(Controller)
  const { variables } = useContext(Model)

  const stageRef = useRef<HTMLDivElement>(null)
  const compareRef = useRef<HTMLDivElement>(null)
  const compareLineRef = useRef<HTMLDivElement>(null)

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
            break
          case "moveTo":
            numActor1.copy(a)
            if (command.extra === 'setNull') {
              a.value = null
            }
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
            break
          case "compare":
            numActor1.copy(a)
            numActor2.copy(b)
            let left = Math.min(rectA.left, rectB.left), right = Math.max(rectA.left + rectA.width, rectB.left + rectB.width),
                top = Math.min(rectA.top, rectB.top), bottom = Math.max(rectA.top + rectA.height, rectB.top + rectB.height)
            let compareStyle = compareRef.current.style
            let compareLineStyle = compareLineRef.current.style
            compareStyle.width = `${right - left}px`
            compareStyle.height = `${bottom - top}px`
            compareStyle.left = `${left}px`
            compareStyle.top = `${top}px`
            let [ap, bp] = [rectA, rectB].map(({top, left, width, height}) => [left + width / 2, top + height / 2])
            let angle = Math.atan2(ap[1] - bp[1], ap[0] - bp[0]) - Math.PI
            let length = Math.sqrt((ap[0] - bp[0]) ** 2 + (ap[1] - bp[1]) ** 2)
            compareLineStyle.width = `${length}px`
            compareLineStyle.transform = `rotateZ(${angle}rad)`
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
            afterWork = () => {
              numActor1.value = numActor2.value = null
            }
            setCompareSymbol(command.extra)
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
        <Number number={numActor1} />
        <Number number={numActor2} />
        <div className="compare-wrap" ref={compareRef}>
          <div className="compare-line" ref={compareLineRef}>
            <div className="compare-symbol">
              <div className={`symbol-${compareSymbol}`}></div>
            </div>
          </div>
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