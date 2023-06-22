import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import ShoppingCart from './ShoppingCart'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @manyToMany(() => ShoppingCart,{
    pivotTimestamps: true,
    pivotColumns: ['unitProducts'],
  })
  public shoppingCart: ManyToMany<typeof ShoppingCart>
  @column()
  public unitStoke: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
