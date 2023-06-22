import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_shopping_carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('productId').unsigned().references('products.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('shoppingCartId').unsigned().references('shopping_carts.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('unitProducts')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
