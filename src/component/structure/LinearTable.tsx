import LinearTableType from "../../structure/LinearTableType"
import SingleNumber from "../value/Number"
import "./linearTable.scss"

type PropsType = {
  data: LinearTableType,
}

export default function LinearTable({ data }: PropsType) {
  return (
    <div className="linear-table">
      {data.map((number, index) => (
        <div className="number-room" key={index} ref={number.ref}>
          <SingleNumber
            number={number}
          />
        </div>
      ))}
    </div>
  )
}