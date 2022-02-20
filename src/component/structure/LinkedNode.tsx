import LinkedNodeType from "../../structure/LinkedNodeType"
import Number from "../value/Number"

type PropsType = {
  node: LinkedNodeType,
  hide?: boolean,
}

export default function LinkedNode({ node, hide = false }: PropsType) {
  return (
    <div className="linked-node" style={{ filter: hide ? 'opacity(0)' : '' }} ref={node.ref}>
      <Number number={node.value} />
      <div className="next"></div>
    </div>
  )
}