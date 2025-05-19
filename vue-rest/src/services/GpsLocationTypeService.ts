import type { IGpsLocationType } from '@/domain/IGpsLocationType'
import { EntityService } from './EntityService'

export class GpsLocationTypeService extends EntityService<IGpsLocationType> {
  constructor() {
    super('GpsLocationTypes')
  }
}
