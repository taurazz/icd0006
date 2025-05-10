import type { IDomainId } from "./IDomainId"

export interface IGpsLocationType extends IDomainId {
    id: string
    name: string
    description: string
    paceMin: number
    paceMax: number
}