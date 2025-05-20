import type { IDomainId } from "./IDomainId"

export interface IGpsLocation extends IDomainId {
    recordedAt: string
    latitude: number
    longitude: number
    accuracy: number
    altitude: number
    verticalAccuracy: number
    appUserId: string
    gpsSessionId: number
    gpsLocationTypeId: number
}
