import Product from "App/Models/Product"

export default class ProductsRepository{
  public async findAll(page?: number, limit?: number){
    const pagination = await Product.query().paginate(page || 1,limit || 5)
    return pagination.toJSON().data
  }

  public async findById(productId: number){
    const product =  await Product.findBy('id',productId)
    if(!product) throw new Error('NOT_FOUND')
    return product
  }

  public async store(product: Product){
    await Product.create(product)
    return {message: `Produto ${product.name} adicionado com sucesso!`}
  }

  public async update(productId : number, product: Product){
    if(!await this.findById(productId)) throw new Error('NOT_FOUND')
    await Product.query().where('id',productId).update(product)
    return {message: `Produto atualizado com sucesso!`}
  }

  public async delete(productId: number){
    if(!await this.findById(productId)) throw new Error('NOT_FOUND')
    await Product.query().where('id',productId).delete()
    return {message: `Produto deletado com sucesso!`}
  }
}
