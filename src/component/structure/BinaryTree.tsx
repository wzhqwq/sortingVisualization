import BinaryTreeType from "../../structure/BinaryTreeType"
import SingleNumber from "../value/Number"
import "./binaryTree.scss"

type PropsType = {
  data: BinaryTreeType,
}

export default function BinaryTree({ data }: PropsType) {
  return (
    <div className="binary-tree-wrap">
      <div className="binary-tree" style={{ width: Math.pow(2, data.getHeight() - 1) * 70 }}>
        {data.getLayers().map((layer, index) => (
          <div key={index} className="layer">
            {layer.map((number, index) => (
              <div className="number-room" key={index}>
                {
                  number && (
                    <SingleNumber
                      number={number}
                    />
                  )
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}