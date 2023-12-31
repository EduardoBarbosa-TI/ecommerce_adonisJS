import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class extends BaseSchema {
  protected tableName = 'product_shopping_carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('product_id').unsigned().references('products.id').onDelete('CASCADE')
      table.integer('shopping_cart_id').unsigned().references('shopping_carts.id').onDelete('CASCADE')
      table.integer('unitProducts')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
