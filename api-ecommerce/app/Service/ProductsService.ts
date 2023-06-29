import Product from "App/Models/Product";
import ProductsRepository from "App/Repositories/ProductsRepository";

export default class ProductsServices{
  private productsRepository: ProductsRepository

  constructor(){
    this.productsRepository = new ProductsRepository()
  }

  public async index(page: number, limit: number){
    return await this.productsRepository.findAll(page,limit)
  }

  public async store(product: Product){
    return await this.productsRepository.store(product)
  }

  public async show(productId: number){
    return await this.productsRepository.findById(productId)
  }

  public async update(productId: number, product: Product){
    return await this.productsRepository.update(productId,product)

  }

  public async delete(productId: number){
    return await this.productsRepository.delete(productId)
  }
}
