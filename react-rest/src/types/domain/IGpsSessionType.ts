import type { IDomainId } from "./IDomainId"

export interface IGpsSessionType extends IDomainId {
    id: string
    name: string
    description: string
    paceMin: number
    paceMax: number
}
