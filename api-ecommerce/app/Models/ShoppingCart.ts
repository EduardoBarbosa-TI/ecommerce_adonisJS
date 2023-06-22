import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import User from './User'

export default class ShoppingCart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status: string

  @hasMany(() => User)
  public user: HasMany<typeof User>

  @manyToMany(() => Product,{
    pivotTimestamps: true,
    pivotColumns: ['unitProducts'],
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
