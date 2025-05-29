import type { IGpsSession } from '@/types/domain/IGpsSession'
import { EntityService } from './EntityService'
import { BaseService } from './BaseService'
import type { IResultObject } from '@/types/IResultObject'
import type { AxiosError } from 'axios'
import type { IGpsSessionCreate } from '@/types/domain/IGpsSessionCreate'

interface GpsSessionFilters {
  fromDateTime?: string
  toDateTime?: string
  minLocationsCount?: number
  minDuration?: number
  minDistance?: number
}

export class GpsSessionService extends EntityService<IGpsSession, IGpsSessionCreate> {
  constructor() {
    super('GpsSessions')
  }

  async getAllAsync(filters: GpsSessionFilters = {}): Promise<IResultObject<IGpsSession[]>> {
    try {
      const response = await BaseService.axios.get<IGpsSession[]>('GpsSessions', {
        params: {
          minLocationsCount: filters.minLocationsCount ?? 0,
          minDuration: filters.minDuration ?? 0,
          minDistance: filters.minDistance ?? 0,
          fromDateTime: filters.fromDateTime ?? '0001-01-01T00:00:00Z',
          toDateTime: filters.toDateTime ?? '9999-12-31T23:59:59Z',
        },
      })
      console.log('getAll response', response)
      if (response.status <= 300) {
        return {
          data: response.data,
        }
      }
      return {
        errors: [response.status.toString() + ' ' + response.statusText],
      }
    } catch (error) {
      console.log('error: ', (error as AxiosError).message)

      return {
        errors: [(error as AxiosError).code ?? ''],
      }
    }
  }
}
