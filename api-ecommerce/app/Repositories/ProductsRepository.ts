import Product from "App/Models/Product"

export default class ProductsRepository{
  public async getAll(page?: number, limit?: number){
    const pagination = await Product.query().paginate(page || 1,limit || 5)
    return pagination.toJSON().data
  }

  public async getById(productId: number){
   return await Product.query().where('id',productId).select('*')
  }

  public async store(product: Product){
    return await Product.create(product)
  }

  public async update(productId : number, product: Product){
    return await Product.query().where('id',productId).update(product)
  }

  public async delete(productId: number){
    return await Product.query().where('id',productId).delete()
  }
}
