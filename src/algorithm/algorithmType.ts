import { GeneratorNextType, UtilReturnType, UtilsType } from "../util/ContextWrapper"

export type Algorithm = (input: number[], controller: UtilsType) => Generator<UtilReturnType, void, GeneratorNextType>