import type { IGpsSession } from '@/domain/IGpsSession'
import { EntityService } from './EntityService'

export class GpsSessionService extends EntityService<IGpsSession> {
  constructor() {
    super('GpsSessions')
  }
}
