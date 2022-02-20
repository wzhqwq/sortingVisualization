import SubstanceType from "../structure/SubstanceType"

export class Command {
  constructor(
    readonly type: "swap"| "moveTo" | "compare" | "mark" | "clearMark",
    readonly a: SubstanceType<any>,
    readonly b: SubstanceType<any>,
    readonly duration: number,
    readonly extra?: string
  ) {}
}