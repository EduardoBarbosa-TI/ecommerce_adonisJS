import { DateTime } from 'luxon'
import { BaseModel,BelongsTo,ManyToMany,belongsTo,column, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Product from './Product'

export default class ShoppingCart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status: string

  @column({columnName: 'userId'})
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Product,{
    localKey: 'id',
    relatedKey: 'id',
    pivotTable: 'product_shopping_carts',
    pivotTimestamps: true,
    pivotColumns: ['unitProducts'],
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
