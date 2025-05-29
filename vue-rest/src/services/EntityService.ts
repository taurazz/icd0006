import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from './BaseService'
import { useUserDataStore } from '@/stores/userDataStore'
import type { IDomainId } from '@/types/domain/IDomainId'

export abstract class EntityService<TEntity extends IDomainId, TCreate extends IDomainId = TEntity> extends BaseService {
  private store = useUserDataStore()

  constructor(private basePath: string) {
    super()
  }

  async getAllAsync(): Promise<IResultObject<TEntity[]>> {
    try {
      const response = await BaseService.axios.get<TEntity[]>(
        this.basePath,
        this.store.jwt ? { headers: { Authorization: `Bearer ${this.store.jwt}` } } : {}
      )
      if (response.status <= 300) {
        return { data: response.data }
      }
      return {
        errors: [response.status.toString() + ' ' + response.statusText],
      }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return {
        errors: [JSON.stringify(error)],
      }
    }
  }

  async addAsync(entity: TCreate): Promise<IResultObject<TEntity>> {
    try {
      const response = await BaseService.axios.post<TEntity>(
        this.basePath,
        entity,
        this.store.jwt ? { headers: { Authorization: `Bearer ${this.store.jwt}` } } : {}
      )
      if (response.status <= 300) {
        return { data: response.data }
      }
      return {
        errors: [response.status.toString() + ' ' + response.statusText],
      }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return {
        errors: [JSON.stringify(error)],
      }
    }
  }

  async updateAsync(entity: TCreate): Promise<IResultObject<TEntity>> {
    try {
      const response = await BaseService.axios.put<TEntity>(
        this.basePath + '/' + entity.id,
        entity,
        this.store.jwt ? { headers: { Authorization: `Bearer ${this.store.jwt}` } } : {}
      )
      if (response.status <= 300) {
        return { data: response.data }
      }
      return { errors: [response.status.toString() + ' ' + response.statusText] }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return { errors: [JSON.stringify(error)] }
    }
  }

  async removeAsync(id: string): Promise<IResultObject<string>> {
    try {
      const response = await BaseService.axios.delete<string>(
        `${this.basePath}/${id}`,
        this.store.jwt ? { headers: { Authorization: `Bearer ${this.store.jwt}` } } : {}
      )
      if (response.status <= 300) {
        return { data: response.data }
      }
      return { errors: [response.status.toString() + ' ' + response.statusText] }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return { errors: [JSON.stringify(error)] }
    }
  }

  async getByIdAsync(id: string): Promise<IResultObject<TEntity>> {
    try {
      const response = await BaseService.axios.get<TEntity>(
        `${this.basePath}/${id}`,
        this.store.jwt ? { headers: { Authorization: `Bearer ${this.store.jwt}` } } : {}
      )
      if (response.status <= 300) {
        return { data: response.data }
      }
      return { errors: [response.status.toString() + ' ' + response.statusText] }
    } catch (error) {
      console.log('error: ', (error as Error).message)
      return { errors: [JSON.stringify(error)] }
    }
  }
}
