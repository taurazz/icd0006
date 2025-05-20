import type { IGpsSession } from '@/types/domain/IGpsSession'
import { EntityService } from './EntityService'

export class GpsSessionService extends EntityService<IGpsSession> {
  constructor() {
    super('GpsSessions')
  }
}
